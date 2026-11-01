-- Public recipe reviews without moderation (Sasha, 2026-11-01): every accepted
-- review and stored photo is published at once; the owner deletes rows later.
-- Requires 20261031210000_community_probe and 20261031223000_community_photo_admissions.
BEGIN;
-- The form no longer asks question/result or as-written/changed.
ALTER TABLE bake_again_community.contributions
  ALTER COLUMN kind DROP NOT NULL,
  ALTER COLUMN experience DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS contributions_check;
CREATE INDEX community_recipe_published ON bake_again_community.contributions
  (recipe_id, created_at DESC, id DESC) WHERE state='published';

-- Same checks as before, minus the pending downgrade of a repeated rating.
CREATE OR REPLACE FUNCTION public.community_submit_probe(command jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  existing bake_again_community.contributions;
  contact bake_again_community.guest_contacts;
  contribution_id uuid;
  lock_key text;
BEGIN
  IF command IS NULL OR jsonb_typeof(command) <> 'object'
    OR command->>'state' NOT IN ('pending','published') OR command->>'state' IS NULL
    OR command->>'owner_hash' IS NULL OR command->>'fingerprint' IS NULL
    OR command->>'email_key' IS NULL OR command->>'browser_key' IS NULL
  THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  FOR lock_key IN SELECT unnest(ARRAY[
    'operation:' || (command->>'operation_id'),
    'browser:' || (command->>'browser_key'),
    'email:' || (command->>'email_key')
  ]) ORDER BY 1 LOOP
    PERFORM pg_advisory_xact_lock(hashtextextended(lock_key, 0));
  END LOOP;
  SELECT * INTO existing FROM bake_again_community.contributions WHERE operation_id=(command->>'operation_id')::uuid;
  IF FOUND THEN
    SELECT * INTO contact FROM bake_again_community.guest_contacts g WHERE g.contribution_id=existing.id;
    IF contact.owner_hash IS DISTINCT FROM command->>'owner_hash'
      OR contact.fingerprint IS DISTINCT FROM command->>'fingerprint'
    THEN RAISE EXCEPTION 'OPERATION_REUSED'; END IF;
    RETURN jsonb_build_object('id',existing.id,'status',existing.state,'replayed',true);
  END IF;
  IF (SELECT count(*) FROM bake_again_community.contributions c
    JOIN bake_again_community.guest_contacts g ON g.contribution_id=c.id
    WHERE g.browser_key=command->>'browser_key' AND c.created_at>now()-interval '24 hours') >= 10
  THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
  INSERT INTO bake_again_community.contributions
    (operation_id,recipe_id,recipe_version,configuration,display_name,body,kind,experience,rating,state)
  VALUES ((command->>'operation_id')::uuid,command->>'recipe_id',command->>'recipe_version',command->>'configuration',
    command->>'display_name',command->>'body',command->>'kind',command->>'experience',(command->>'rating')::smallint,
    command->>'state')
  RETURNING id INTO contribution_id;
  INSERT INTO bake_again_community.guest_contacts (contribution_id,email,email_key,browser_key,owner_hash,fingerprint)
  VALUES (contribution_id,command->>'email',command->>'email_key',command->>'browser_key',command->>'owner_hash',command->>'fingerprint');
  RETURN jsonb_build_object('id',contribution_id,'status',command->>'state','replayed',false);
END;
$function$;
REVOKE ALL ON FUNCTION public.community_submit_probe(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_submit_probe(jsonb) TO service_role;

-- Explicit public fields only: no email, hashes or recipe configuration.
CREATE FUNCTION public.community_recipe_reviews(recipe text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT coalesce(jsonb_agg(item ORDER BY created_at DESC, id DESC), '[]'::jsonb)
  FROM (
    SELECT c.id, c.created_at, jsonb_build_object(
      'id', c.id,
      'name', c.display_name,
      'text', c.body,
      'rating', c.rating,
      'createdAt', c.created_at,
      'photos', coalesce((SELECT jsonb_agg(p.id ORDER BY p.issued_at, p.id)
        FROM bake_again_community.photo_upload_admissions p
        WHERE p.contribution_id=c.id AND p.state='stored'), '[]'::jsonb)
    ) AS item
    FROM bake_again_community.contributions c
    WHERE c.recipe_id=recipe AND c.state='published'
    ORDER BY c.created_at DESC, c.id DESC
    LIMIT 200
  ) reviews;
$function$;
REVOKE ALL ON FUNCTION public.community_recipe_reviews(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_recipe_reviews(text) TO service_role;

-- Resolves a stored photo only while its review is still published.
CREATE FUNCTION public.community_public_photo(photo uuid) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT jsonb_build_object('id', p.id, 'mime', p.mime, 'objectBase', p.object_base)
  FROM bake_again_community.photo_upload_admissions p
  JOIN bake_again_community.contributions c ON c.id=p.contribution_id
  WHERE p.id=photo AND p.state='stored' AND c.state='published';
$function$;
REVOKE ALL ON FUNCTION public.community_public_photo(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_public_photo(uuid) TO service_role;
COMMIT;
