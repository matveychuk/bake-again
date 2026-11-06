-- Purchase access is independent of personal-record accounts and newsletter consent.
create table public.lesson_entitlements (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null,
  email text not null check (email = lower(btrim(email))),
  payhip_transaction_id text unique,
  payhip_product_id text,
  status text not null check (status in ('active','refunded','revoked')),
  source text not null check (source in ('payhip','manual')),
  created_at timestamptz not null default now(),
  refunded_at timestamptz,
  revoked_at timestamptz,
  paid_seen boolean not null default false,
  welcome_needs_review boolean not null default false,
  welcome_attempted_at timestamptz,
  welcome_sent_at timestamptz,
  buyers_synced_at timestamptz,
  delivery_claimed_at timestamptz
);
create index lesson_reader on public.lesson_entitlements(lesson_id,email) where status = 'active';
create table public.lesson_payhip_events (
  event_key text primary key,
  transaction_id text not null,
  event_type text not null,
  amount_refunded bigint not null,
  created_at timestamptz not null default now()
);
create table public.lesson_login_limits (
  key text primary key,
  attempts integer not null,
  window_start timestamptz not null
);
alter table public.lesson_entitlements enable row level security;
alter table public.lesson_payhip_events enable row level security;
alter table public.lesson_login_limits enable row level security;
revoke all on public.lesson_entitlements, public.lesson_payhip_events, public.lesson_login_limits from anon, authenticated;
grant select on public.lesson_entitlements to authenticated;
grant all on public.lesson_entitlements, public.lesson_payhip_events, public.lesson_login_limits to service_role;
create policy lesson_own_email on public.lesson_entitlements for select to authenticated
  using (email = lower(btrim(auth.jwt()->>'email')));

-- Serialized per transaction; refunded/revoked rows can never be reactivated by a late paid retry.
create function public.lesson_payhip_apply(input jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare row_id uuid; event_id text; current_status text;
begin
  perform pg_advisory_xact_lock(hashtextextended(input->>'transactionId',0));
  event_id := input->>'eventKey';
  insert into public.lesson_payhip_events(event_key,transaction_id,event_type,amount_refunded)
    values(event_id,input->>'transactionId',input->>'type',(input->>'refunded')::bigint)
    on conflict do nothing;
  if not found then
    select id into row_id from public.lesson_entitlements where payhip_transaction_id = input->>'transactionId';
    return row_id;
  end if;
  current_status := case when input->>'type' = 'refunded' and (input->>'refunded')::bigint >= (input->>'price')::bigint then 'refunded' else 'active' end;
  insert into public.lesson_entitlements(lesson_id,email,payhip_transaction_id,payhip_product_id,status,source,paid_seen,refunded_at)
    values ('napoleon-video',input->>'email',input->>'transactionId',input->>'productId',current_status,'payhip',input->>'type' = 'paid',
      case when current_status='refunded' then (input->>'refundedAt')::timestamptz end)
    on conflict(payhip_transaction_id) do update set
      paid_seen = public.lesson_entitlements.paid_seen or excluded.paid_seen,
      status = case when public.lesson_entitlements.status in ('refunded','revoked') then public.lesson_entitlements.status else excluded.status end,
      refunded_at = coalesce(public.lesson_entitlements.refunded_at,excluded.refunded_at)
    returning id into row_id;
  return row_id;
end $$;
revoke all on function public.lesson_payhip_apply(jsonb) from public, anon, authenticated;
grant execute on function public.lesson_payhip_apply(jsonb) to service_role;

-- Both dimensions in the same transaction. Never store raw IP or email in limits.
create function public.lesson_login_consume(keys text[]) returns boolean
language plpgsql security definer set search_path = '' as $$
declare k text; count_now integer; allowed boolean := true;
begin
  delete from public.lesson_login_limits where window_start < now() - interval '1 day';
  foreach k in array keys loop
    insert into public.lesson_login_limits as limits(key,attempts,window_start) values(k,1,now())
      on conflict(key) do update set
        attempts = case when limits.window_start <= now()-interval '15 minutes' then 1 else limits.attempts+1 end,
        window_start = case when limits.window_start <= now()-interval '15 minutes' then now() else limits.window_start end
      returning attempts into count_now;
    if count_now > 5 then allowed := false; end if;
  end loop;
  return allowed;
end $$;
revoke all on function public.lesson_login_consume(text[]) from public, anon, authenticated;
grant execute on function public.lesson_login_consume(text[]) to service_role;
