# Glide Supabase backend

Supabase is the offchain app backend for Glide.

Canton should remain the workflow and settlement source of truth. Supabase stores the app read model: invoices, dashboard data, and indexed audit events for fast UI access.

## Tables

- `businesses`
- `invoices`
- `audit_events`

## How to set up quickly with hosted Supabase

1. Create a Supabase project.
2. Open Supabase Dashboard → SQL Editor.
3. Run `supabase/migrations/202604260001_glide_workflow_schema.sql`.
4. Run `supabase/migrations/202604270001_harden_invoice_status_transitions.sql`.
5. Run `supabase/migrations/202604270002_add_canton_workflow_fields.sql`.
6. Run `supabase/seed.sql`.
7. Copy your Project URL and anon key into `.env.local`.
8. Run the app with Supabase mode.

```powershell
npm install
npm run dev:supabase
```

## Environment

```env
VITE_GLIDE_API_MODE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Workflow hardening

The second migration adds a Postgres trigger that rejects invalid invoice status jumps. This prevents accidental updates like `PAYMENT_PENDING → SETTLED` from being written directly to Supabase.

## Security note

The current migration uses permissive DevNet demo RLS policies so judges can test the workflow without auth setup friction.
Before real production launch, replace those policies with auth-based business membership policies.


## Canton fields

The Canton migration adds these fields to the `invoices` read model:

- `canton_workflow_id`
- `canton_sync_status`
- `canton_last_error`

These fields are for mirroring Canton ledger submission/finality status back into Supabase. They are not a replacement for Canton as the workflow source of truth.
