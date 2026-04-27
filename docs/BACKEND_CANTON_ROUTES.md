# Backend Canton Routes

```txt
GET  /api/canton/status
POST /api/invoices/:id/canton-submit
POST /api/invoices/:id/canton-confirm-payment
POST /api/invoices/:id/canton-route-settlement
POST /api/invoices/:id/canton-mark-settled
POST /api/invoices/:id/canton-mark-fulfilled
POST /api/invoices/:id/canton-cancel
POST /api/invoices/:id/canton-dispute
```

These routes do not create fake results. If Canton is not configured or rejects a command, the route returns an error and writes `FAILED` plus `canton_last_error` to Supabase.
