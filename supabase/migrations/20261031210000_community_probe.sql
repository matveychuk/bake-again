-- Stage 0: server-only foundation. Not applied automatically or enabled on recipes.
-- No access for browser roles; no change to personal records, Auth or Storage.
BEGIN;
CREATE SCHEMA bake_again_community;
REVOKE ALL ON SCHEMA bake_again_community FROM PUBLIC, anon, authenticated;

CREATE TABLE bake_again_community.contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id uuid NOT NULL UNIQUE,
  recipe_id text NOT NULL CHECK (length(recipe_id) BETWEEN 1 AND 100),
  recipe_version text NOT NULL CHECK (length(recipe_version) BETWEEN 1 AND 100),
  configuration text NOT NULL CHECK (length(configuration) BETWEEN 1 AND 1024),
  display_name text NOT NULL CHECK (length(trim(display_name)) BETWEEN 2 AND 60),
  body text NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 2000),
  kind text NOT NULL CHECK (kind IN ('question','result')),
  experience text NOT NULL CHECK (experience IN ('as-written','changed')),
  rating smallint CHECK (rating BETWEEN 1 AND 5),
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','published','hidden','rejected','deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (rating IS NULL OR (kind='result' AND experience='as-written'))
);
CREATE INDEX community_recipe_page ON bake_again_community.contributions
  (recipe_id, recipe_version, configuration, created_at DESC, id DESC) WHERE state='published';

CREATE TABLE bake_again_community.guest_contacts (
  contribution_id uuid PRIMARY KEY REFERENCES bake_again_community.contributions(id) ON DELETE CASCADE,
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
  email_key text NOT NULL CHECK (email_key ~ '^[a-f0-9]{64}$'),
  browser_key text NOT NULL CHECK (browser_key ~ '^[a-f0-9]{64}$'),
  owner_hash text NOT NULL CHECK (owner_hash ~ '^[a-f0-9]{64}$'),
  fingerprint text NOT NULL CHECK (fingerprint ~ '^[a-f0-9]{64}$'),
  -- Always false for an initial guest submission. No account linking by email.
  email_verified boolean NOT NULL DEFAULT false CHECK (NOT email_verified)
);
CREATE INDEX community_guest_email ON bake_again_community.guest_contacts(email_key);
CREATE INDEX community_guest_browser ON bake_again_community.guest_contacts(browser_key);
ALTER TABLE bake_again_community.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bake_again_community.guest_contacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA bake_again_community FROM PUBLIC, anon, authenticated, service_role;

-- Only a trusted server may call this, AFTER anti-spam and canonical scope checks.
-- Retries return no content/contact and require the same capability + fingerprint.
CREATE FUNCTION public.community_submit_probe(command jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  existing bake_again_community.contributions;
  contact bake_again_community.guest_contacts;
  contribution_id uuid;
  outcome text;
  lock_key text;
BEGIN
  IF command IS NULL OR jsonb_typeof(command) <> 'object'
    OR command->>'state' NOT IN ('pending','published') OR command->>'state' IS NULL
    OR command->>'owner_hash' IS NULL OR command->>'fingerprint' IS NULL
    OR command->>'email_key' IS NULL OR command->>'browser_key' IS NULL
  THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  -- Sorted locks serialize operation replay, browser quota and duplicate votes,
  -- including concurrent requests from different browsers using one email.
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
  outcome := command->>'state';
  IF command->>'rating' IS NOT NULL AND EXISTS (
    SELECT 1 FROM bake_again_community.contributions c
    JOIN bake_again_community.guest_contacts g ON g.contribution_id=c.id
    WHERE g.email_key=command->>'email_key' AND c.recipe_id=command->>'recipe_id'
      AND c.recipe_version=command->>'recipe_version' AND c.configuration=command->>'configuration'
      AND c.rating IS NOT NULL AND c.state IN ('pending','published')
  ) THEN outcome := 'pending'; END IF;
  INSERT INTO bake_again_community.contributions
    (operation_id,recipe_id,recipe_version,configuration,display_name,body,kind,experience,rating,state)
  VALUES ((command->>'operation_id')::uuid,command->>'recipe_id',command->>'recipe_version',command->>'configuration',
    command->>'display_name',command->>'body',command->>'kind',command->>'experience',(command->>'rating')::smallint,outcome)
  RETURNING id INTO contribution_id;
  INSERT INTO bake_again_community.guest_contacts (contribution_id,email,email_key,browser_key,owner_hash,fingerprint)
  VALUES (contribution_id,command->>'email',command->>'email_key',command->>'browser_key',command->>'owner_hash',command->>'fingerprint');
  RETURN jsonb_build_object('id',contribution_id,'status',outcome,'replayed',false);
END;
$function$;
REVOKE ALL ON FUNCTION public.community_submit_probe(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_submit_probe(jsonb) TO service_role;
COMMIT;
