-- Glide Supabase schema
-- Purpose: offchain app database for dashboard reads, user-facing records, and audit indexing.
-- Canton remains the intended source of truth for workflow and settlement execution.

create type public.asset_type as enum ('CC', 'USDCx');
create type public.invoice_status as enum (
  'DRAFT',
  'ISSUED',
  'PAYMENT_PENDING',
  'PAYMENT_CONFIRMED',
  'SETTLEMENT_PENDING',
  'SETTLED',
  'FULFILLED',
  'CANCELLED',
  'DISPUTED'
);
create type public.user_role as enum ('BUSINESS', 'PAYER', 'SETTLEMENT_OPERATOR', 'OBSERVER');

create table public.businesses (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.invoices (
  id text primary key,
  title text not null,
  customer_name text not null,
  payer_party_id text not null,
  observer_party_id text not null,
  amount numeric(20, 6) not null check (amount > 0),
  asset public.asset_type not null,
  settlement_destination text not null,
  due_date date not null,
  description text not null default '',
  status public.invoice_status not null default 'PAYMENT_PENDING',
  business_id text not null references public.businesses(id) on delete cascade,
  canton_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_events (
  id text primary key,
  invoice_id text not null references public.invoices(id) on delete cascade,
  action text not null,
  actor_role public.user_role not null,
  event_timestamp timestamptz not null default now(),
  previous_status public.invoice_status,
  new_status public.invoice_status not null,
  asset public.asset_type not null,
  amount numeric(20, 6) not null check (amount > 0),
  reference_id text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

create index invoices_status_idx on public.invoices(status);
create index invoices_asset_idx on public.invoices(asset);
create index invoices_created_at_idx on public.invoices(created_at desc);
create index audit_events_invoice_id_idx on public.audit_events(invoice_id);
create index audit_events_event_timestamp_idx on public.audit_events(event_timestamp asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger invoices_set_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

alter table public.businesses enable row level security;
alter table public.invoices enable row level security;
alter table public.audit_events enable row level security;

-- DevNet demo policies.
-- These keep the hackathon build easy to run with the public anon key.
-- Replace with auth.uid()-scoped policies before a real production launch.
create policy "devnet demo read businesses"
on public.businesses for select
to anon, authenticated
using (true);

create policy "devnet demo write businesses"
on public.businesses for insert
to anon, authenticated
with check (true);

create policy "devnet demo update businesses"
on public.businesses for update
to anon, authenticated
using (true)
with check (true);

create policy "devnet demo read invoices"
on public.invoices for select
to anon, authenticated
using (true);

create policy "devnet demo write invoices"
on public.invoices for insert
to anon, authenticated
with check (true);

create policy "devnet demo update invoices"
on public.invoices for update
to anon, authenticated
using (true)
with check (true);

create policy "devnet demo delete invoices"
on public.invoices for delete
to anon, authenticated
using (true);

create policy "devnet demo read audit events"
on public.audit_events for select
to anon, authenticated
using (true);

create policy "devnet demo write audit events"
on public.audit_events for insert
to anon, authenticated
with check (true);

create policy "devnet demo delete audit events"
on public.audit_events for delete
to anon, authenticated
using (true);
