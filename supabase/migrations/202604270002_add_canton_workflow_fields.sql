-- Adds Canton workflow tracking fields to the Supabase read model.
-- Supabase stores indexing/read data. Canton remains the intended workflow source of truth.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'canton_sync_status') then
    create type public.canton_sync_status as enum ('PENDING', 'READY', 'SUBMITTED', 'ACCEPTED', 'FINALIZED', 'FAILED');
  end if;
end $$;

alter table public.invoices
  add column if not exists canton_workflow_id text,
  add column if not exists canton_sync_status public.canton_sync_status not null default 'PENDING',
  add column if not exists canton_last_error text;

create index if not exists invoices_canton_sync_status_idx on public.invoices(canton_sync_status);

comment on column public.invoices.canton_reference is 'Human-readable Glide workflow reference for UI and audit correlation.';
comment on column public.invoices.canton_workflow_id is 'Future Canton contract id or ledger workflow id after submit/finality.';
comment on column public.invoices.canton_sync_status is 'Offchain sync status for Canton workflow submission and finality tracking.';
comment on column public.invoices.canton_last_error is 'Last Canton integration error, if a submit or sync attempt fails.';
