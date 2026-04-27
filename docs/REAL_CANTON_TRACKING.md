# Real Canton Tracking

Glide must not show fake Canton finality.

This implementation only writes Canton contract, command, update, and offset fields when the backend receives a successful response from the configured Canton JSON Ledger API.

## Backend flow

```txt
Frontend → Glide backend → Canton JSON Ledger API → Supabase read model
```

The browser never talks directly to Canton with secrets.

## Required backend env

Copy `.env.server.example` to `.env.server` or set equivalent environment variables in your terminal before running the API server.

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
CANTON_JSON_API_URL
CANTON_BUSINESS_PARTY
CANTON_SETTLEMENT_OPERATOR_PARTY
CANTON_INVOICE_TEMPLATE_ID
```

## Real ledger fields

```txt
canton_contract_id
canton_workflow_id
canton_command_id
canton_update_id
canton_completion_offset
canton_template_id
canton_submitted_at
canton_confirmed_at
canton_last_error
```

## Test order

1. Run Supabase migrations through `202604270003_add_real_canton_ledger_references.sql`.
2. Build the Daml package in `canton/`.
3. Deploy the DAR to the Canton participant / LocalNet JSON API environment.
4. Set the backend `.env.server` values.
5. Run `npm run api:dev`.
6. Run frontend with `VITE_GLIDE_API_BASE_URL=http://localhost:8787`.
7. Open an invoice and click `Submit Workflow to Canton`.
8. Confirm a real `canton_contract_id` and `canton_update_id` appear.

## Turning on real Canton actions

By default, normal UI actions can still use Supabase for faster product testing.

To make workflow buttons exercise Canton choices, set:

```env
VITE_GLIDE_CANTON_ACTIONS=true
```

Then the workflow buttons call backend Canton routes instead of directly updating Supabase.
