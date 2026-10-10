-- Supabase/PostgreSQL companion to the phase A D1 schema. Additive and read-only
-- for readers. Apply with Supabase migrations; never send this to Sites D1.
-- No signup triggers, automatic identity linking, grants to anon or write APIs.
BEGIN;

CREATE SCHEMA bake_again_private;
REVOKE ALL ON SCHEMA bake_again_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA bake_again_private TO authenticated;

CREATE TABLE public.personal_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at bigint NOT NULL CHECK (created_at BETWEEN 0 AND 8640000000000000),
  disabled_at bigint CHECK (disabled_at BETWEEN 0 AND 8640000000000000)
);

CREATE TABLE public.personal_identities (
  issuer text NOT NULL CHECK (length(issuer) BETWEEN 1 AND 256),
  subject text NOT NULL CHECK (length(subject) BETWEEN 1 AND 1024),
  account_id uuid NOT NULL REFERENCES public.personal_accounts(id) ON DELETE CASCADE,
  created_at bigint NOT NULL CHECK (created_at BETWEEN 0 AND 8640000000000000),
  revoked_at bigint CHECK (revoked_at BETWEEN 0 AND 8640000000000000),
  PRIMARY KEY (issuer, subject)
);
CREATE INDEX personal_identity_account ON public.personal_identities(account_id);

CREATE TABLE public.personal_records (
  account_id uuid NOT NULL REFERENCES public.personal_accounts(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('saved-recipe','shopping-item','recipe-note','bake-record','collection')),
  record_key text NOT NULL CHECK (length(record_key) BETWEEN 1 AND 1024),
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version = 1),
  revision bigint NOT NULL CHECK (revision BETWEEN 1 AND 9007199254740991),
  payload_json text,
  updated_at bigint NOT NULL CHECK (updated_at BETWEEN 0 AND 8640000000000000),
  deleted_at bigint,
  PRIMARY KEY (account_id, kind, record_key),
  CHECK (deleted_at IS NULL OR deleted_at = updated_at),
  CHECK (
    (deleted_at IS NOT NULL AND payload_json IS NULL) OR
    (deleted_at IS NULL AND payload_json IS NOT NULL AND
      jsonb_typeof(payload_json::jsonb) = 'object' AND octet_length(payload_json) <= 32768)
  )
);

ALTER TABLE public.personal_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.personal_accounts, public.personal_identities, public.personal_records FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.personal_accounts, public.personal_identities, public.personal_records TO authenticated;

-- SECURITY DEFINER avoids recursively evaluating identity/account policies. No
-- arguments, dynamic SQL or caller-selected account; not exposed as a Data API RPC.
-- Only verified gateway JWT claims are used, never user_metadata or email.
CREATE FUNCTION bake_again_private.current_account_id() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT i.account_id
  FROM public.personal_identities AS i
  JOIN public.personal_accounts AS a ON a.id = i.account_id
  WHERE i.subject = (SELECT auth.uid())::text
    AND i.issuer = (SELECT auth.jwt() ->> 'iss')
    AND (SELECT auth.jwt() ->> 'role') = 'authenticated'
    AND COALESCE((SELECT auth.jwt() ->> 'is_anonymous'), 'false') = 'false'
    AND i.revoked_at IS NULL AND a.disabled_at IS NULL
$function$;
REVOKE ALL ON FUNCTION bake_again_private.current_account_id() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION bake_again_private.current_account_id() TO authenticated;

CREATE POLICY personal_account_owner_read ON public.personal_accounts
FOR SELECT TO authenticated USING (id = (SELECT bake_again_private.current_account_id()));

CREATE POLICY personal_identity_owner_read ON public.personal_identities
FOR SELECT TO authenticated USING (
  account_id = (SELECT bake_again_private.current_account_id())
  AND subject = (SELECT auth.uid())::text
  AND issuer = (SELECT auth.jwt() ->> 'iss') AND revoked_at IS NULL
);

CREATE POLICY personal_record_owner_read ON public.personal_records
FOR SELECT TO authenticated USING (account_id = (SELECT bake_again_private.current_account_id()));

COMMIT;
