# Glide

Glide is a Stacks-native merchant settlement and treasury automation app.

It allows merchants to accept payments, settle in sBTC or USDCx, apply configurable treasury split rules, and optionally deploy idle balances into yield strategies.

## Core capabilities

- Merchant invoice creation
- Settlement in sBTC or USDCx
- Treasury bucket allocation rules
- Optional idle-balance yield deployment
- Refund and reconciliation support

## Repository structure

- `apps/web` — merchant dashboard and checkout experience
- `contracts` — Clarity contracts for merchant, treasury, invoice, routing, settlement, yield, and ops flows
- `docs` — product, contract, and MVP specifications