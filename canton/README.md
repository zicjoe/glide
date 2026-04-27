# Glide Canton Workflow Package

This folder contains Glide's first Canton/Daml workflow model.

It is intentionally focused on the business workflow first:

```txt
Create invoice → issue payment request → confirm payment → route settlement → mark settled → mark fulfilled → audit trail
```

## Current scope

The Daml contract records:

- invoice state
- roles
- supported settlement asset type: `CC` or `USDCx`
- status transitions
- audit events

It does not yet move live CC or USDCx balances. Token movement should be wired next through the Canton token interfaces/adapters available in the hackathon environment.

## Files

```txt
canton/daml.yaml
canton/daml/Glide/Workflow/InvoiceWorkflow.daml
```

## Run locally

Run these commands in **WSL/Ubuntu terminal from the project root** after installing the Digital Asset tooling shown in the hackathon onboarding slide.

```bash
cd canton
daml build
```

If your hackathon environment uses `dpm` instead of `daml`, run this in **WSL/Ubuntu terminal from the project root**:

```bash
cd canton
dpm build
```

## Integration plan

1. Compile this Daml package.
2. Deploy it to the Canton quickstart or DevNet participant.
3. Store the created contract id in Supabase as `canton_workflow_id`.
4. Mirror final ledger state back into Supabase for fast dashboard reads.
5. Keep Canton as the workflow source of truth and Supabase as the read model.
