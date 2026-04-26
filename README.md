# Glide

Glide is a Canton based business workflow app for invoices, payment confirmation, settlement, fulfillment, and audit records using CC and USDCx as supported settlement assets.

## Current status

This repository contains a production styled frontend and the first backend API shell. The frontend can run in local browser state mode or call the backend API over HTTP.

## Stack

Frontend:

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn style UI components

Backend shell:

- Node.js built in HTTP server
- File backed workflow state for local development
- Route contract that can later move to Prisma, PostgreSQL, and Canton Daml commands

## Run frontend only

Run these commands in Windows PowerShell inside the project root.

```powershell
npm install
npm run dev
```

This uses browser local storage for the workflow state.

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

## API routes

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

The backend shell writes local workflow state to:

```txt
.glide-data/workflow-state.json
```

This folder is ignored by git. It is only for local development.

## Backend integration plan

Components call `src/lib/api.ts`, not mock data directly. The frontend can switch between local browser state and HTTP API mode using environment variables.

Current mode options:

```txt
VITE_GLIDE_API_MODE=local
VITE_GLIDE_API_MODE=http
```

The next production backend step is replacing the file store with Prisma and PostgreSQL while keeping the API route contract stable.

The next Canton step is adding a Daml adapter so invoice actions map to Canton contract choices.

## Important claims

Do not claim live fiat payout, full compliance automation, or production mainnet settlement yet. The current product claim is a Canton ready workflow model for invoice, settlement, fulfillment, and audit using CC and USDCx.
