-- A deliberately data-free database query for the Free plan activity check.
-- The publishable key can call this function as anon; it cannot read personal data.
BEGIN;

CREATE FUNCTION public.project_keepalive() RETURNS boolean
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $function$
  SELECT true
$function$;

REVOKE ALL ON FUNCTION public.project_keepalive() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.project_keepalive() TO anon;

COMMIT;
