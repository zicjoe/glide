# Glide Contract Map

## merchant-registry
Responsible for merchant identity and merchant-level defaults.

### Responsibilities
- Create merchant profiles
- Update merchant metadata
- Store default settlement asset
- Verify merchant ownership

## treasury-policy
Responsible for treasury rules and payout structure.

### Responsibilities
- Create and update treasury policies
- Manage treasury buckets
- Manage payout destinations
- Validate split percentages
- Store idle balance modes and thresholds

## invoice-manager
Responsible for invoice lifecycle.

### Responsibilities
- Create invoices
- Cancel invoices
- Expire invoices
- Fetch invoice records by merchant

## routing-orchestrator
Responsible for payment routing and quote logic.

### Responsibilities
- Create quotes
- Validate candidate routes
- Perform liquidity checks
- Select route plans
- Track quote expiry

## settlement-engine
Responsible for settlement and post-settlement allocation.

### Responsibilities
- Confirm payments
- Record settlement attempts
- Process finalized settlement
- Allocate net settled amount across treasury buckets
- Create allocation records

## yield-controller
Responsible for deployment eligibility and yield tracking.

### Responsibilities
- Queue balances for deployment
- Track deployed positions
- Close positions
- Report active yield status

## ops-manager
Responsible for operational workflows.

### Responsibilities
- Create refund requests
- Approve and execute refunds
- Create reconciliation records
- Flag mismatches
- Emit merchant activity events
- Store fee policy configuration