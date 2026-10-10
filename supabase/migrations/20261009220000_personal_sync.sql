-- Phase C. Apply only after the phase A migration. No changes to Sites D1.
BEGIN;
-- A separate database gate also covers direct Data API calls. Default is closed.
CREATE TABLE bake_again_private.personal_sync_settings (
 singleton boolean PRIMARY KEY CHECK(singleton), enabled boolean NOT NULL DEFAULT false
);
ALTER TABLE bake_again_private.personal_sync_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO bake_again_private.personal_sync_settings VALUES(true,false);
REVOKE ALL ON bake_again_private.personal_sync_settings FROM PUBLIC,anon,authenticated;
CREATE TABLE bake_again_private.personal_receipts (
 account_id uuid NOT NULL REFERENCES public.personal_accounts(id) ON DELETE CASCADE,
 operation_id uuid NOT NULL, request_hash bytea NOT NULL, result jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(account_id,operation_id)
);
CREATE INDEX personal_receipts_time ON bake_again_private.personal_receipts(account_id,created_at);
CREATE TABLE bake_again_private.personal_imports (
 account_id uuid PRIMARY KEY REFERENCES public.personal_accounts(id) ON DELETE CASCADE,
 imported_at timestamptz NOT NULL DEFAULT now()
);
-- No reader policies: internal state is accessed only by the owner-definer RPC.
ALTER TABLE bake_again_private.personal_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bake_again_private.personal_imports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON bake_again_private.personal_receipts,bake_again_private.personal_imports FROM PUBLIC,anon,authenticated;

-- Check the live Auth session too: a signed but signed-out JWT is insufficient.
CREATE FUNCTION bake_again_private.verified_subject() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.id FROM auth.users u JOIN auth.sessions s ON s.user_id=u.id
 WHERE u.id=auth.uid() AND s.id::text=auth.jwt()->>'session_id'
 AND u.email_confirmed_at IS NOT NULL AND COALESCE(u.is_anonymous,false)=false
 AND (u.banned_until IS NULL OR u.banned_until < now())
 AND (s.not_after IS NULL OR s.not_after > now())
 AND auth.jwt()->>'role'='authenticated'
 AND COALESCE(auth.jwt()->>'is_anonymous','false')='false'
$$;
REVOKE ALL ON FUNCTION bake_again_private.verified_subject() FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION bake_again_private.current_account_id() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT i.account_id FROM public.personal_identities i
 JOIN public.personal_accounts a ON a.id=i.account_id
 WHERE i.subject=bake_again_private.verified_subject()::text
 AND i.issuer=auth.jwt()->>'iss' AND i.revoked_at IS NULL AND a.disabled_at IS NULL
$$;

-- Payload validation also runs in PostgreSQL: direct RPC calls cannot bypass it.
CREATE FUNCTION bake_again_private.exact_keys(v jsonb, fields text[]) RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path='' AS $$
 SELECT COALESCE(jsonb_typeof(v)='object' AND v ?& fields AND v-fields='{}'::jsonb,false)
$$;
CREATE FUNCTION bake_again_private.valid_id(v jsonb) RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path='' AS $$
 SELECT COALESCE(jsonb_typeof(v)='string' AND v#>>'{}' ~ '^[a-z0-9][a-z0-9-]{0,127}$',false)
$$;
CREATE FUNCTION bake_again_private.valid_text(v jsonb, maximum integer) RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path='' AS $$
 SELECT COALESCE(jsonb_typeof(v)='string' AND length(v#>>'{}') + (SELECT count(*) FROM regexp_matches(v#>>'{}',U&'[\+010000-\+10FFFF]','g'))<=maximum,false)
$$;
CREATE FUNCTION bake_again_private.valid_iso(v jsonb) RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
BEGIN
 RETURN COALESCE(jsonb_typeof(v)='string' AND v#>>'{}' ~ '^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$' AND to_char((v#>>'{}')::timestamptz AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')=v#>>'{}',false);
EXCEPTION WHEN OTHERS THEN RETURN false;
END $$;
CREATE FUNCTION bake_again_private.valid_quantity(v jsonb) RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
BEGIN
 IF v='null'::jsonb THEN RETURN true; END IF;
 IF v->>'unit' NOT IN ('g','ml','piece','tsp','tbsp','cup','packet','pinch') OR v->>'unit' IS NULL THEN RETURN false; END IF;
 IF v->>'kind'='exact' THEN RETURN bake_again_private.exact_keys(v,ARRAY['kind','unit','value']) AND jsonb_typeof(v->'value')='number' AND (v->>'value')::double precision>0 AND (v->>'value')::double precision<='1.7976931348623157e308'::double precision; END IF;
 RETURN COALESCE(v->>'kind'='range' AND bake_again_private.exact_keys(v,ARRAY['kind','unit','min','max']) AND jsonb_typeof(v->'min')='number' AND jsonb_typeof(v->'max')='number' AND (v->>'min')::double precision>0 AND (v->>'max')::double precision<='1.7976931348623157e308'::double precision AND (v->>'max')::numeric >= (v->>'min')::numeric,false);
EXCEPTION WHEN OTHERS THEN RETURN false;
END $$;
CREATE FUNCTION bake_again_private.configuration_tuple(v jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE q jsonb;
BEGIN
 IF v='{"kind":"base"}'::jsonb THEN RETURN '["base"]'::jsonb; END IF;
 IF NOT bake_again_private.exact_keys(v,ARRAY['kind','geometryId','quantityAdjustment']) OR v->>'kind' IS DISTINCT FROM 'adjusted' OR NOT bake_again_private.valid_id(v->'geometryId') THEN RETURN NULL; END IF;
 q := v->'quantityAdjustment';
 IF q->>'mode'='batchScale' AND bake_again_private.exact_keys(q,ARRAY['mode','factor']) AND jsonb_typeof(q->'factor')='number' AND (q->>'factor')::numeric IN (0.5,1,1.5,2) THEN
  RETURN jsonb_build_array('adjusted',v->>'geometryId','batch',(q->>'factor')::double precision);
 END IF;
 IF q->>'mode'='useWhatIHave' AND bake_again_private.exact_keys(q,ARRAY['mode','anchorIngredientLineId','availableAmount']) AND bake_again_private.valid_id(q->'anchorIngredientLineId')
 AND bake_again_private.exact_keys(q->'availableAmount',ARRAY['value','unit']) AND bake_again_private.valid_quantity((q->'availableAmount') || '{"kind":"exact"}') THEN
  RETURN jsonb_build_array('adjusted',v->>'geometryId','anchor',q->>'anchorIngredientLineId',(q->'availableAmount'->>'value')::double precision,q->'availableAmount'->>'unit');
 END IF;
 RETURN NULL;
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END $$;
CREATE FUNCTION bake_again_private.valid_personal_payload(kind text, key text, v jsonb) RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE cfg jsonb; src jsonb; rid jsonb; expected_key text;
BEGIN
 IF jsonb_typeof(v) IS DISTINCT FROM 'object' OR octet_length(v::text)>32768 THEN RETURN false; END IF;
 IF kind='saved-recipe' THEN RETURN bake_again_private.exact_keys(v,ARRAY['recipeId']) AND bake_again_private.valid_id(v->'recipeId') AND key=v->>'recipeId'; END IF;
 IF kind='collection' THEN
  IF NOT bake_again_private.exact_keys(v,ARRAY['id','name','recipeIds']) OR NOT bake_again_private.valid_id(v->'id') OR key IS DISTINCT FROM v->>'id'
   OR NOT bake_again_private.valid_text(v->'name',120) OR length(trim(v->>'name'))=0 OR jsonb_typeof(v->'recipeIds') IS DISTINCT FROM 'array' OR jsonb_array_length(v->'recipeIds')>200 THEN RETURN false; END IF;
  FOR rid IN SELECT value FROM jsonb_array_elements(v->'recipeIds') LOOP IF NOT bake_again_private.valid_id(rid) THEN RETURN false; END IF; END LOOP;
  RETURN (SELECT count(*)=count(DISTINCT value) FROM jsonb_array_elements(v->'recipeIds'));
 END IF;
 IF kind IN ('recipe-note','bake-record') THEN
  IF NOT bake_again_private.valid_id(v->'recipeId') OR NOT bake_again_private.valid_id(v->'recipeVersionId') THEN RETURN false; END IF;
  cfg := bake_again_private.configuration_tuple(v->'configuration'); IF cfg IS NULL THEN RETURN false; END IF;
  expected_key := replace(jsonb_build_array(v->>'recipeId',v->>'recipeVersionId',cfg)::text,', ', ',');
  IF key<>expected_key THEN RETURN false; END IF;
  IF kind='recipe-note' THEN RETURN bake_again_private.exact_keys(v,ARRAY['recipeId','recipeVersionId','configuration','text']) AND bake_again_private.valid_text(v->'text',2000); END IF;
  RETURN bake_again_private.exact_keys(v,ARRAY['recipeId','recipeVersionId','configuration','completedAt','note','noteUpdatedAt']) AND bake_again_private.valid_text(v->'note',2000) AND bake_again_private.valid_iso(v->'completedAt') AND bake_again_private.valid_iso(v->'noteUpdatedAt');
 END IF;
 IF kind='shopping-item' THEN
  IF NOT bake_again_private.exact_keys(v,ARRAY['id','ingredientId','quantity','checked','createdAt','updatedAt','sources'])
  OR NOT bake_again_private.valid_text(v->'id',256) OR key IS DISTINCT FROM v->>'id' OR length(key)=0 OR NOT bake_again_private.valid_id(v->'ingredientId')
  OR NOT bake_again_private.valid_quantity(v->'quantity') OR jsonb_typeof(v->'checked') IS DISTINCT FROM 'boolean' OR NOT bake_again_private.valid_iso(v->'createdAt') OR NOT bake_again_private.valid_iso(v->'updatedAt')
  OR jsonb_typeof(v->'sources') IS DISTINCT FROM 'array' OR jsonb_array_length(v->'sources') NOT BETWEEN 1 AND 100 THEN RETURN false; END IF;
  FOR src IN SELECT value FROM jsonb_array_elements(v->'sources') LOOP
   IF jsonb_typeof(src) IS DISTINCT FROM 'object' OR NOT src ?& ARRAY['recipeId','recipeVersionId','ingredientLineId','sectionId','selectedIngredientId']
    OR src-ARRAY['recipeId','recipeVersionId','ingredientLineId','sectionId','selectedIngredientId','configurationKey','batchId']<>'{}'::jsonb THEN RETURN false; END IF;
   FOREACH expected_key IN ARRAY ARRAY['recipeId','recipeVersionId','ingredientLineId','sectionId','selectedIngredientId'] LOOP IF NOT bake_again_private.valid_id(src->expected_key) THEN RETURN false; END IF; END LOOP;
   IF src ? 'batchId' AND NOT bake_again_private.valid_id(src->'batchId') THEN RETURN false; END IF;
   IF src ? 'configurationKey' AND (jsonb_typeof(src->'configurationKey') IS DISTINCT FROM 'string' OR src->>'configurationKey' !~ '^[a-z0-9][a-z0-9:.-]{0,255}$') THEN RETURN false; END IF;
  END LOOP;
  RETURN true;
 END IF;
 RETURN false;
EXCEPTION WHEN OTHERS THEN RETURN false;
END $$;
REVOKE ALL ON FUNCTION bake_again_private.exact_keys(jsonb,text[]), bake_again_private.valid_id(jsonb), bake_again_private.valid_text(jsonb,integer), bake_again_private.valid_iso(jsonb), bake_again_private.valid_quantity(jsonb), bake_again_private.configuration_tuple(jsonb), bake_again_private.valid_personal_payload(text,text,jsonb) FROM PUBLIC,anon,authenticated;

-- All client writes go through this bounded transaction, not table grants.
-- It serializes one account, compares revisions and remembers operation results.
CREATE FUNCTION public.personal_sync(action text, input jsonb DEFAULT '{}') RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
 subject_id uuid; issuer_id text; owner_id uuid; milliseconds bigint;
 item jsonb; items jsonb; op uuid; fingerprint bytea; prior record; existing record;
 target_kind text; target_key text; payload jsonb; expected bigint; next_revision bigint;
 result jsonb; acknowledgements jsonb := '[]'; n integer; bytes bigint;
BEGIN
 IF NOT (SELECT enabled FROM bake_again_private.personal_sync_settings WHERE singleton) THEN RAISE EXCEPTION 'PERSONAL_FEATURES_DISABLED'; END IF;
 subject_id := bake_again_private.verified_subject(); issuer_id := auth.jwt()->>'iss';
 IF subject_id IS NULL OR issuer_id IS NULL OR length(issuer_id)>256 THEN
  RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE='P0001';
 END IF;
 IF jsonb_typeof(input) IS DISTINCT FROM 'object' OR octet_length(input::text)>1048576 THEN
  RAISE EXCEPTION 'INVALID_REQUEST';
 END IF;
 milliseconds := floor(extract(epoch FROM clock_timestamp())*1000);
 -- Provision is explicit, never a side effect of snapshot/read.
 IF action='provision' THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(subject_id::text,0));
  SELECT i.account_id INTO owner_id FROM public.personal_identities i WHERE i.issuer=issuer_id AND i.subject=subject_id::text;
  IF owner_id IS NULL THEN
   INSERT INTO public.personal_accounts(created_at) VALUES(milliseconds) RETURNING id INTO owner_id;
   INSERT INTO public.personal_identities(issuer,subject,account_id,created_at) VALUES(issuer_id,subject_id::text,owner_id,milliseconds);
  END IF;
 END IF;
 owner_id := bake_again_private.current_account_id();
 IF owner_id IS NULL THEN RAISE EXCEPTION 'ACCOUNT_UNAVAILABLE'; END IF;
 -- The same lock protects writes, snapshots, exports, imports and deletion.
 PERFORM 1 FROM public.personal_accounts WHERE id=owner_id AND disabled_at IS NULL FOR UPDATE;
 IF NOT FOUND OR bake_again_private.current_account_id() IS NULL THEN RAISE EXCEPTION 'ACCOUNT_UNAVAILABLE'; END IF;
 IF action IN ('provision','snapshot','export') THEN
  SELECT COALESCE(jsonb_agg(to_jsonb(r) - 'account_id' ORDER BY kind,record_key),'[]') INTO items
   FROM public.personal_records r WHERE account_id=owner_id;
  RETURN jsonb_build_object('accountId',owner_id,'records',items,'imported',EXISTS(SELECT 1 FROM bake_again_private.personal_imports WHERE account_id=owner_id));
 END IF;
 IF action='erase' THEN
  IF input <> '{"confirm":"DELETE_PERSONAL_DATA"}'::jsonb THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  DELETE FROM public.personal_records WHERE account_id=owner_id;
  DELETE FROM bake_again_private.personal_receipts WHERE account_id=owner_id;
  DELETE FROM bake_again_private.personal_imports WHERE account_id=owner_id;
  UPDATE public.personal_accounts SET disabled_at=milliseconds WHERE id=owner_id;
  UPDATE public.personal_identities SET revoked_at=milliseconds WHERE account_id=owner_id;
  RETURN '{"deleted":true}'::jsonb;
 END IF;
 IF action NOT IN ('mutate','import') THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
 IF action='import' AND EXISTS(SELECT 1 FROM bake_again_private.personal_imports WHERE account_id=owner_id) THEN
  RETURN '{"imported":true,"alreadyImported":true}'::jsonb;
 END IF;
 items := input->'mutations';
 IF jsonb_typeof(items) IS DISTINCT FROM 'array' OR jsonb_array_length(items) NOT BETWEEN (CASE WHEN action='import' THEN 0 ELSE 1 END) AND 200
   OR input - 'mutations' <> '{}'::jsonb THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(items) LOOP
  IF jsonb_typeof(item) IS DISTINCT FROM 'object' OR item->'schemaVersion' IS DISTINCT FROM '1'::jsonb
   OR item->>'operationId' IS NULL
   OR item->>'operationId' !~ '^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$'
   OR jsonb_typeof(item->'expectedRevision') IS DISTINCT FROM 'number'
   OR (item->>'expectedRevision') !~ '^[0-9]+$' THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  op := (item->>'operationId')::uuid; expected := (item->>'expectedRevision')::bigint;
  IF expected>9007199254740990 THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  fingerprint := sha256(convert_to(item::text,'UTF8'));
  SELECT * INTO prior FROM bake_again_private.personal_receipts WHERE account_id=owner_id AND operation_id=op;
  IF FOUND THEN
   IF prior.request_hash<>fingerprint THEN RAISE EXCEPTION 'OPERATION_REUSED'; END IF;
   acknowledgements := acknowledgements || jsonb_build_array(prior.result); CONTINUE;
  END IF;
  IF (SELECT count(*) FROM bake_again_private.personal_receipts WHERE account_id=owner_id)>=10000 THEN RAISE EXCEPTION 'PAYLOAD_TOO_LARGE'; END IF;
  IF (SELECT count(*) FROM bake_again_private.personal_receipts WHERE account_id=owner_id AND created_at>now()-interval '1 hour')>=600 THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
  target_kind := item->>'kind'; target_key := item->>'key'; payload := item->'payload';
  IF target_kind NOT IN ('saved-recipe','shopping-item','recipe-note','bake-record','collection') OR target_kind IS NULL
    OR target_key IS NULL OR length(target_key) NOT BETWEEN 1 AND 1024 THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  IF item->>'action'='put' THEN
   IF item - ARRAY['schemaVersion','operationId','expectedRevision','action','kind','key','payload'] <> '{}'::jsonb
    OR NOT bake_again_private.valid_personal_payload(target_kind,target_key,payload) THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  ELSIF item->>'action'='delete' THEN
   IF item - ARRAY['schemaVersion','operationId','expectedRevision','action','kind','key'] <> '{}'::jsonb THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
   payload := NULL;
  ELSE RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  IF action='import' AND (expected<>0 OR item->>'action'<>'put') THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
  SELECT * INTO existing FROM public.personal_records WHERE account_id=owner_id AND kind=target_kind AND record_key=target_key;
  IF action='import' AND FOUND THEN CONTINUE; END IF; -- preserve cloud values, including tombstones
  IF (NOT FOUND AND expected<>0) OR (FOUND AND existing.revision<>expected) THEN RAISE EXCEPTION 'REVISION_CONFLICT'; END IF;
  next_revision := expected+1;
  INSERT INTO public.personal_records(account_id,kind,record_key,schema_version,revision,payload_json,updated_at,deleted_at)
  VALUES(owner_id,target_kind,target_key,1,next_revision,CASE WHEN payload IS NULL THEN NULL ELSE payload::text END,milliseconds,CASE WHEN payload IS NULL THEN milliseconds ELSE NULL END)
  ON CONFLICT(account_id,kind,record_key) DO UPDATE SET revision=EXCLUDED.revision,payload_json=EXCLUDED.payload_json,updated_at=EXCLUDED.updated_at,deleted_at=EXCLUDED.deleted_at;
  SELECT count(*),COALESCE(sum(octet_length(payload_json)),0) INTO n,bytes FROM public.personal_records WHERE account_id=owner_id;
  IF n>1000 OR bytes>2097152 THEN RAISE EXCEPTION 'PAYLOAD_TOO_LARGE'; END IF;
  result := jsonb_build_object('operationId',op,'kind',target_kind,'key',target_key,'revision',next_revision);
  INSERT INTO bake_again_private.personal_receipts(account_id,operation_id,request_hash,result) VALUES(owner_id,op,fingerprint,result);
  acknowledgements := acknowledgements || jsonb_build_array(result);
 END LOOP;
 IF action='import' THEN INSERT INTO bake_again_private.personal_imports(account_id) VALUES(owner_id); END IF;
 RETURN jsonb_build_object('acknowledgements',acknowledgements,'imported',action='import');
END;
$$;
REVOKE ALL ON FUNCTION public.personal_sync(text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.personal_sync(text,jsonb) TO authenticated;
COMMIT;
