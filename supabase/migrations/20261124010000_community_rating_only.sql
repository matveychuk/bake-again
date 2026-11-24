BEGIN;
ALTER TABLE bake_again_community.contributions
  ALTER COLUMN display_name DROP NOT NULL,
  ALTER COLUMN body DROP NOT NULL,
  ADD CONSTRAINT community_review_content CHECK
    (display_name IS NOT NULL OR (rating IS NOT NULL AND body IS NULL));
ALTER TABLE bake_again_community.guest_contacts
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN email_key DROP NOT NULL,
  ADD CONSTRAINT community_contact_pair CHECK ((email IS NULL) = (email_key IS NULL));

-- A rating and its later written review share one row and one owner capability.
CREATE FUNCTION public.community_save_review(command jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  existing bake_again_community.contributions;
  contact bake_again_community.guest_contacts;
  operation uuid := (command->>'operation_id')::uuid;
  target uuid := (command->>'contribution_id')::uuid;
  stars smallint := (command->>'rating')::smallint;
  rating_only boolean := command->>'display_name' IS NULL;
  receipt uuid;
BEGIN
  IF operation IS NULL OR command->>'owner_hash' IS NULL OR command->>'browser_key' IS NULL
    OR command->>'fingerprint' IS NULL OR command->>'state' IS DISTINCT FROM 'published'
    OR (rating_only AND (stars IS NULL OR command->>'email' IS NOT NULL OR command->>'body' IS NOT NULL))
    OR (NOT rating_only AND (command->>'email' IS NULL OR command->>'email_key' IS NULL))
  THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  -- Same order and lock names as the existing submit RPC, including its quota.
  PERFORM pg_advisory_xact_lock(hashtextextended('browser:' || (command->>'browser_key'), 0));
  PERFORM pg_advisory_xact_lock(hashtextextended('operation:' || operation, 0));
  SELECT * INTO existing FROM bake_again_community.contributions WHERE operation_id=operation FOR UPDATE;
  IF FOUND THEN
    SELECT * INTO STRICT contact FROM bake_again_community.guest_contacts WHERE contribution_id=existing.id;
    IF contact.owner_hash IS DISTINCT FROM command->>'owner_hash'
      OR existing.recipe_id IS DISTINCT FROM command->>'recipe_id'
      OR existing.recipe_version IS DISTINCT FROM command->>'recipe_version'
      OR existing.configuration IS DISTINCT FROM command->>'configuration'
      OR existing.state <> 'published' OR (target IS NOT NULL AND target <> existing.id)
    THEN RAISE EXCEPTION 'OPERATION_REUSED'; END IF;
    IF contact.fingerprint = command->>'fingerprint' THEN
      RETURN jsonb_build_object('id',existing.id,'status',existing.state,'replayed',true);
    END IF;
    -- Only an anonymous vote may be changed or enriched. A late vote can never
    -- replace a completed comment, even if a client retries after losing a reply.
    IF existing.display_name IS NOT NULL THEN RAISE EXCEPTION 'OPERATION_REUSED'; END IF;
    UPDATE bake_again_community.contributions SET rating=coalesce(stars,existing.rating), display_name=command->>'display_name',
      body=command->>'body' WHERE id=existing.id;
    UPDATE bake_again_community.guest_contacts SET email=command->>'email', email_key=command->>'email_key',
      fingerprint=command->>'fingerprint' WHERE contribution_id=existing.id;
    receipt := existing.id;
  ELSE
    IF target IS NOT NULL THEN RAISE EXCEPTION 'OPERATION_REUSED'; END IF;
    IF (SELECT count(*) FROM bake_again_community.contributions c
      JOIN bake_again_community.guest_contacts g ON g.contribution_id=c.id
      WHERE g.browser_key=command->>'browser_key' AND c.created_at>now()-interval '24 hours') >= 10
    THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
    INSERT INTO bake_again_community.contributions
      (operation_id,recipe_id,recipe_version,configuration,display_name,body,rating,state)
      VALUES (operation,command->>'recipe_id',command->>'recipe_version',command->>'configuration',
        command->>'display_name',command->>'body',stars,'published') RETURNING id INTO receipt;
    INSERT INTO bake_again_community.guest_contacts (contribution_id,email,email_key,browser_key,owner_hash,fingerprint)
      VALUES (receipt,command->>'email',command->>'email_key',command->>'browser_key',command->>'owner_hash',command->>'fingerprint');
  END IF;
  RETURN jsonb_build_object('id',receipt,'status','published','replayed',false);
END;
$function$;
REVOKE ALL ON FUNCTION public.community_save_review(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_save_review(jsonb) TO service_role;

CREATE OR REPLACE FUNCTION public.community_recipe_reviews(recipe text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT coalesce(jsonb_agg(item ORDER BY created_at DESC, id DESC), '[]'::jsonb)
  FROM (
    SELECT c.id, c.created_at, jsonb_build_object(
      'id', c.id,
      'name', c.display_name,
      'text', coalesce(c.body,''),
      'rating', c.rating,
      'createdAt', c.created_at,
      'photos', coalesce((SELECT jsonb_agg(p.id ORDER BY p.issued_at, p.id)
        FROM bake_again_community.photo_upload_admissions p
        WHERE p.contribution_id=c.id AND p.state='stored'), '[]'::jsonb)
    ) AS item
    FROM bake_again_community.contributions c
    WHERE c.recipe_id=recipe AND c.state='published' AND c.display_name IS NOT NULL
      AND (c.body IS NOT NULL OR EXISTS (
        SELECT 1 FROM bake_again_community.photo_upload_admissions p WHERE p.contribution_id=c.id AND p.state='stored'
      ))
    ORDER BY c.created_at DESC, c.id DESC
    LIMIT 200
  ) reviews;
$function$;
REVOKE ALL ON FUNCTION public.community_recipe_reviews(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_recipe_reviews(text) TO service_role;

CREATE FUNCTION public.community_recipe_feedback(recipe text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT jsonb_build_object('reviews',public.community_recipe_reviews(recipe),
    'ratingCount',count(rating),'ratingTotal',coalesce(sum(rating),0))
  FROM bake_again_community.contributions WHERE recipe_id=recipe AND state='published';
$function$;
REVOKE ALL ON FUNCTION public.community_recipe_feedback(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_recipe_feedback(text) TO service_role;
COMMIT;
