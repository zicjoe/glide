# Glide API Shell

This is the first backend shell for Glide. It mirrors the frontend workflow API without adding external server dependencies yet.

## What it supports

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

## Current persistence

The API writes demo workflow state to `.glide-data/workflow-state.json`.

This is intentionally temporary. The next production step is replacing this file store with PostgreSQL and Prisma while keeping the route contract stable.

## Canton boundary

The current server models CC and USDCx workflow state only. It does not submit Daml commands yet. The next Canton step is adding an adapter that maps these API actions to Daml contract choices.
