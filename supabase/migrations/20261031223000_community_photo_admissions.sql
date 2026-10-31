-- A short, durable server admission. No signed Storage upload URL is issued.
-- Requires the community foundation; no changes to personal/Auth or Storage RLS.
BEGIN;
CREATE TABLE bake_again_community.photo_upload_admissions (
  id uuid PRIMARY KEY,
  contribution_id uuid NOT NULL REFERENCES bake_again_community.contributions(id) ON DELETE CASCADE,
  admission_hash text NOT NULL CHECK (admission_hash ~ '^[a-f0-9]{64}$'),
  request_hash text NOT NULL CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  mime text NOT NULL CHECK (mime IN ('image/jpeg','image/png','image/webp')),
  expected_bytes integer NOT NULL CHECK (expected_bytes BETWEEN 1 AND 2097152),
  sha256 text NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
  object_base text NOT NULL UNIQUE,
  state text NOT NULL DEFAULT 'issued' CHECK (state IN ('issued','receiving','stored','failed','revoked')),
  issued_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  CHECK (expires_at = issued_at + interval '120 seconds'),
  CHECK (object_base = contribution_id::text || '/' || id::text)
);
CREATE INDEX community_photo_contribution ON bake_again_community.photo_upload_admissions(contribution_id, issued_at);
ALTER TABLE bake_again_community.photo_upload_admissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON bake_again_community.photo_upload_admissions FROM PUBLIC, anon, authenticated, service_role;

CREATE FUNCTION public.community_photo_admission(action text, input jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  photo bake_again_community.photo_upload_admissions;
  parent_id uuid;
  parent_state text;
  issued timestamptz;
BEGIN
  IF action IS NULL OR action NOT IN ('issue','claim','complete','fail','revoke') OR input IS NULL OR jsonb_typeof(input)<>'object'
    OR input->>'id' IS NULL OR input->>'admission_hash' IS NULL
  THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  IF action='issue' THEN
    parent_id := (input->>'contribution_id')::uuid;
  ELSE
    SELECT contribution_id INTO parent_id FROM bake_again_community.photo_upload_admissions
      WHERE id=(input->>'id')::uuid AND admission_hash=input->>'admission_hash';
  END IF;
  -- All actions lock parent then admission; issue/claim/finalize cannot race an
  -- author/moderator hiding or deleting the parent, or a fourth simultaneous slot.
  SELECT c.state INTO parent_state FROM bake_again_community.contributions c
    WHERE c.id=parent_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'UPLOAD_FORBIDDEN'; END IF;
  IF action<>'fail' AND parent_state NOT IN ('pending','published')
    THEN RAISE EXCEPTION 'UPLOAD_FORBIDDEN'; END IF;
  IF action='issue' AND NOT EXISTS (
    SELECT 1 FROM bake_again_community.guest_contacts g
    WHERE g.contribution_id=parent_id AND g.owner_hash=input->>'owner_hash'
  ) THEN RAISE EXCEPTION 'UPLOAD_FORBIDDEN'; END IF;
  SELECT * INTO photo FROM bake_again_community.photo_upload_admissions WHERE id=(input->>'id')::uuid FOR UPDATE;
  IF action='issue' THEN
    IF FOUND THEN
      IF photo.contribution_id<>parent_id OR photo.admission_hash<>input->>'admission_hash'
        OR photo.request_hash<>input->>'request_hash'
      THEN RAISE EXCEPTION 'OPERATION_REUSED'; END IF;
      -- No retry may extend the original deadline, including expired/used permits.
    ELSE
      IF (SELECT count(*) FROM bake_again_community.photo_upload_admissions WHERE contribution_id=parent_id
        AND (state='stored' OR (state IN ('issued','receiving') AND expires_at>clock_timestamp()))) >= 3
      THEN RAISE EXCEPTION 'PHOTO_LIMIT'; END IF;
      IF (SELECT count(*) FROM bake_again_community.photo_upload_admissions WHERE contribution_id=parent_id
        AND issued_at>clock_timestamp()-interval '24 hours') >= 10
      THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
      issued := clock_timestamp();
      INSERT INTO bake_again_community.photo_upload_admissions
        (id,contribution_id,admission_hash,request_hash,mime,expected_bytes,sha256,object_base,issued_at,expires_at)
      VALUES ((input->>'id')::uuid,parent_id,input->>'admission_hash',input->>'request_hash',input->>'mime',
        (input->>'expected_bytes')::integer,input->>'sha256',parent_id::text || '/' || (input->>'id')::uuid::text,
        issued,issued+interval '120 seconds') RETURNING * INTO photo;
    END IF;
  ELSE
    IF NOT FOUND OR photo.admission_hash IS DISTINCT FROM input->>'admission_hash'
      THEN RAISE EXCEPTION 'UPLOAD_FORBIDDEN'; END IF;
    IF action='fail' THEN
      IF photo.state='receiving' THEN
        UPDATE bake_again_community.photo_upload_admissions SET state='failed' WHERE id=photo.id RETURNING * INTO photo;
      END IF;
    ELSIF action='revoke' THEN
      IF photo.state NOT IN ('issued','receiving') THEN RAISE EXCEPTION 'UPLOAD_USED'; END IF;
      UPDATE bake_again_community.photo_upload_admissions SET state='revoked' WHERE id=photo.id RETURNING * INTO photo;
    ELSE
      IF photo.expires_at<=clock_timestamp() THEN RAISE EXCEPTION 'UPLOAD_EXPIRED'; END IF;
      IF action='claim' THEN
        IF photo.state<>'issued' THEN RAISE EXCEPTION 'UPLOAD_USED'; END IF;
        UPDATE bake_again_community.photo_upload_admissions SET state='receiving' WHERE id=photo.id RETURNING * INTO photo;
        RETURN jsonb_build_object('id',photo.id,'contributionId',photo.contribution_id,'mime',photo.mime,
          'expectedBytes',photo.expected_bytes,'sha256',photo.sha256,'objectBase',photo.object_base,
          'expiresAt',(extract(epoch from photo.expires_at)*1000)::bigint);
      ELSE
        IF photo.state<>'receiving' THEN RAISE EXCEPTION 'UPLOAD_USED'; END IF;
        UPDATE bake_again_community.photo_upload_admissions SET state='stored' WHERE id=photo.id RETURNING * INTO photo;
      END IF;
    END IF;
  END IF;
  RETURN jsonb_build_object('id',photo.id,'state',CASE WHEN photo.state IN ('issued','receiving')
    AND photo.expires_at<=clock_timestamp() THEN 'expired' ELSE photo.state END,
    'expiresAt',(extract(epoch from photo.expires_at)*1000)::bigint);
END;
$function$;
REVOKE ALL ON FUNCTION public.community_photo_admission(text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.community_photo_admission(text,jsonb) TO service_role;
COMMIT;
