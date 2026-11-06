create table public.lesson_checkouts (
 id uuid primary key,
 proof_hash text not null,
 entitlement_id uuid references public.lesson_entitlements(id),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now() + interval '2 hours'
);
alter table public.lesson_checkouts enable row level security;
revoke all on public.lesson_checkouts from public, anon, authenticated;
grant all on public.lesson_checkouts to service_role;
