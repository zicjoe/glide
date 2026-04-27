-- Glide workflow hardening
-- Adds a database-level guard so invalid invoice status jumps cannot be written directly.
-- This protects the Supabase read model from UI bugs and accidental manual updates.

create or replace function public.is_valid_invoice_status_transition(
  previous_status public.invoice_status,
  next_status public.invoice_status
)
returns boolean
language sql
immutable
as $$
  select case
    when previous_status = next_status then true
    when previous_status = 'DRAFT' and next_status in ('ISSUED', 'CANCELLED', 'DISPUTED') then true
    when previous_status = 'ISSUED' and next_status in ('PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'CANCELLED', 'DISPUTED') then true
    when previous_status = 'PAYMENT_PENDING' and next_status in ('PAYMENT_CONFIRMED', 'CANCELLED', 'DISPUTED') then true
    when previous_status = 'PAYMENT_CONFIRMED' and next_status in ('SETTLEMENT_PENDING', 'CANCELLED', 'DISPUTED') then true
    when previous_status = 'SETTLEMENT_PENDING' and next_status in ('SETTLED', 'DISPUTED') then true
    when previous_status = 'SETTLED' and next_status in ('FULFILLED', 'DISPUTED') then true
    else false
  end;
$$;

create or replace function public.enforce_invoice_status_transition()
returns trigger
language plpgsql
as $$
begin
  if not public.is_valid_invoice_status_transition(old.status, new.status) then
    raise exception 'Invalid invoice status transition from % to % for invoice %', old.status, new.status, old.id;
  end if;

  return new;
end;
$$;

drop trigger if exists invoices_enforce_status_transition on public.invoices;

create trigger invoices_enforce_status_transition
before update of status on public.invoices
for each row
execute function public.enforce_invoice_status_transition();
