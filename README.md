# Glide

Glide is a Canton based business workflow app for invoices, payment confirmation, settlement, fulfillment, and audit records using CC and USDCx as supported settlement assets.

## Current status

This repository contains a production styled frontend with three data modes:

- `local`: browser local storage for fast UI testing
- `supabase`: Supabase Postgres as the offchain app backend
- `http`: local Node API shell for route-contract testing

Canton remains the intended source of truth for workflow and settlement execution. Supabase is the app read model for dashboard speed, invoice records, and audit indexing.

## Stack

Frontend:

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn style UI components

App backend:

- Supabase Postgres
- Supabase JavaScript client
- SQL migrations and seed data committed under `supabase/`

Backend shell:

- Node.js built in HTTP server
- File backed workflow state for local development
- Route contract that can later call Canton Daml commands

## Run frontend only

Run these commands in Windows PowerShell inside the project root.

```powershell
npm install
npm run dev
```

This uses browser local storage for the workflow state.

## Run with Supabase

Create a Supabase project first. Then run the SQL files in this order from the Supabase Dashboard SQL Editor:

```txt
supabase/migrations/202604260001_glide_workflow_schema.sql
supabase/migrations/202604270001_harden_invoice_status_transitions.sql
supabase/migrations/202604270002_add_canton_workflow_fields.sql
supabase/seed.sql
```

Create `.env.local` in the project root:

```env
VITE_GLIDE_API_MODE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then run this in Windows PowerShell inside the project root:

```powershell
npm install
npm run dev:supabase
```

## Run backend API shell

Open a second Windows PowerShell terminal inside the project root.

```powershell
npm run api:dev
```

The API runs on:

```txt
http://localhost:8787
```

Check it in your browser:

```txt
http://localhost:8787/api/health
```

## Run frontend against backend API

Keep the backend running in one Windows PowerShell terminal.

Then open another Windows PowerShell terminal inside the project root and run:

```powershell
npm run dev:http
```

This uses `.env.http` and makes the frontend call the backend API shell instead of browser local storage.

## Build

Run this in Windows PowerShell inside the project root.

```powershell
npm run build
```

## Product workflow

Glide focuses on one end to end business flow:

1. Create invoice
2. Confirm payment in CC or USDCx
3. Route settlement
4. Mark settlement complete
5. Record fulfillment
6. View audit trail

## Supabase tables

- `businesses`
- `invoices`
- `audit_events`

## Frontend data modes

```txt
VITE_GLIDE_API_MODE=local
VITE_GLIDE_API_MODE=supabase
VITE_GLIDE_API_MODE=http
```

Components call `src/lib/api.ts`, not mock data directly. That keeps the UI stable while the data source changes.

## API routes for HTTP mode

- `GET /api/health`
- `GET /api/system/status`
- `GET /api/dashboard/metrics`
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/invoices/:id`
- `POST /api/invoices/:id/confirm-payment`
- `POST /api/invoices/:id/route-settlement`
- `POST /api/invoices/:id/mark-settled`
- `POST /api/invoices/:id/mark-fulfilled`
- `POST /api/invoices/:id/cancel`
- `POST /api/invoices/:id/dispute`
- `GET /api/invoices/:id/audit`
- `POST /api/demo/reset`

## Persistence

Local HTTP mode writes workflow state to:

```txt
.glide-data/workflow-state.json
```

This folder is ignored by git. It is only for local development.

Supabase mode writes workflow state to your Supabase Postgres database.

## Security note

The current Supabase migration uses permissive DevNet demo RLS policies so judges can test the workflow without auth setup friction.
Before real production launch, replace those policies with auth-based business membership policies.

## Canton contract layer

The first Daml workflow model is included under:

```txt
canton/daml/Glide/Workflow/InvoiceWorkflow.daml
```

The backend mapping boundary is included under:

```txt
server/canton/contractPayloads.mjs
```

Run this in WSL/Ubuntu terminal from the project root after installing the Digital Asset tools:

```bash
cd canton
daml build
```

If your hackathon setup uses DPM, run this in WSL/Ubuntu terminal from the project root instead:

```bash
cd canton
dpm build
```

The contract currently models workflow state and audit events for CC and USDCx invoices. Live token movement and ledger submission are the next adapter step.

## Backend integration plan

Supabase is the offchain app backend. Canton is the intended workflow source of truth. The next backend step is adding a ledger adapter so invoice actions map to Canton contract choices, then mirroring contract ids and finality state back into Supabase.

## Important claims

Do not claim live fiat payout, full compliance automation, or production mainnet settlement yet. The current product claim is a Canton ready workflow model for invoice, settlement, fulfillment, and audit using CC and USDCx.

## Canton sync for the demo

Glide now includes a Canton sync panel on the invoice detail page. In hackathon demo mode, it runs with:

```env
VITE_CANTON_SYNC_MODE=mock
```

This lets you click **Sync Canton Workflow** after creating or progressing an invoice. The app records a Canton-style workflow id, moves the sync state to `FINALIZED`, and adds an audit event. It does not claim a live Canton ledger transaction yet.

For live wiring, use the backend adapter in `server/canton/ledgerAdapter.mjs` and keep ledger credentials out of the frontend.
