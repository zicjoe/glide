# Glide Product Spec

## Overview

Glide is a Stacks-native merchant settlement and treasury automation app.

It allows merchants to accept payments, settle in sBTC or USDCx, split settled funds by treasury rules, and optionally deploy eligible idle balances into yield strategies.

## Core goals

- Let merchants create invoices and payment links
- Settle merchant payments in a chosen asset
- Apply configurable treasury split rules after settlement
- Support optional autonomous deployment of idle balances
- Provide operational visibility through refunds, reconciliation, and activity history

## Primary users

- Crypto-native merchants
- Digital businesses
- Freelancers and agencies
- Online sellers managing treasury across multiple wallets

## Core entities

- Merchant
- TreasuryPolicy
- TreasuryBucket
- PayoutDestination
- Invoice
- Quote
- RoutePlan
- LiquidityCheck
- Payment
- SettlementAttempt
- SettlementRecord
- BucketAllocation
- YieldPosition
- RefundRequest
- ReconciliationRecord
- FeePolicy
- NotificationEvent

## Core flows

### Merchant setup
1. Connect wallet
2. Create merchant profile
3. Choose default settlement asset
4. Add payout destinations
5. Create treasury buckets
6. Set split percentages
7. Configure idle balance policy
8. Save treasury policy

### Invoice flow
1. Merchant creates invoice
2. Customer opens checkout link
3. Customer confirms payment
4. Glide processes settlement
5. Net settled amount is split by treasury policy

### Yield flow
1. Bucket is marked as EARN
2. Balance is checked against threshold
3. Eligible balance is queued for deployment
4. Dashboard reflects liquid and deployed balances

### Ops flow
1. Failed execution attempts are recorded
2. Refunds can be requested against a payment
3. Reconciliation compares expected and actual settlement
4. Activity events are logged for merchant visibility

## Product rules

- Split percentages must total 100%
- Split rules apply to net settled amount
- Invoice settlement asset can override merchant default
- Quotes must expire
- Expired invoices cannot be paid
- Yield is optional per bucket
- Yield deployment only occurs after finalized settlement
- Disabled payout destinations cannot receive new allocations
- Every failed execution attempt must be recorded
- Refunds must reference the original payment