-- Adds real Canton ledger tracking fields.
-- These columns are only filled after the backend receives a real response from the Canton JSON Ledger API.

alter type public.canton_sync_status add value if not exists 'NOT_SUBMITTED';
alter type public.canton_sync_status add value if not exists 'CONFIRMED';

alter table public.invoices
  add column if not exists canton_contract_id text,
  add column if not exists canton_command_id text,
  add column if not exists canton_update_id text,
  add column if not exists canton_completion_offset text,
  add column if not exists canton_template_id text,
  add column if not exists canton_submitted_at timestamptz,
  add column if not exists canton_confirmed_at timestamptz;

create index if not exists invoices_canton_contract_id_idx on public.invoices(canton_contract_id);
create index if not exists invoices_canton_update_id_idx on public.invoices(canton_update_id);
create index if not exists invoices_canton_command_id_idx on public.invoices(canton_command_id);

comment on column public.invoices.canton_contract_id is 'Real Canton contract id returned by a successful ledger command.';
comment on column public.invoices.canton_command_id is 'Command id submitted to the Canton JSON Ledger API.';
comment on column public.invoices.canton_update_id is 'Update/transaction id returned by Canton after command completion.';
comment on column public.invoices.canton_completion_offset is 'Ledger completion offset returned by Canton for the command.';
comment on column public.invoices.canton_template_id is 'Daml template id used when the workflow contract was created or exercised.';
comment on column public.invoices.canton_submitted_at is 'Timestamp when the backend submitted the Canton command.';
comment on column public.invoices.canton_confirmed_at is 'Timestamp when the backend received successful Canton command completion.';
