# Glide

Glide is a Canton based business workflow app for invoices, payment confirmation, settlement, fulfillment, and audit records using CC and USDCx as supported settlement assets.

## Current status

This repository currently contains the frontend shell generated from Figma Make, cleaned up for local development and future backend integration.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn style UI components

## Run locally

Run these commands in the project root terminal.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
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

## Backend integration plan

Components should call `src/lib/api.ts`, not mock data directly. The mock data in `src/lib/mockData.ts` is a temporary adapter until the backend is connected.

Future backend routes:

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

## Important claims

Do not claim live fiat payout, full compliance automation, or production mainnet settlement yet. The current product claim is a Canton-ready workflow model for invoice, settlement, fulfillment, and audit using CC and USDCx.
