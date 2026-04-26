Build a production ready web app called Glide.

Glide is a Canton based business workflow app for invoices, payment confirmation, settlement, fulfillment, and audit records. The app helps businesses manage payment workflows using CC and USDCx as supported settlement assets.

This is not a wallet.
This is not an exchange.
This is not a DeFi trading dashboard.
This is not a meme app.

Glide is a serious business operations product for payment workflows.

Core product flow:
1. Business creates an invoice
2. Payer views the invoice
3. Payment is confirmed using CC or USDCx
4. Settlement is routed
5. Fulfillment is marked complete
6. Audit trail shows every state change

Build the frontend in Next.js, React, TypeScript, and Tailwind CSS.

Important backend integration instruction:
Do not hardcode business data directly inside components.
Create a clean API layer that can later be wired to a real backend.
All data must come through typed API functions, even if the current version uses mock responses.

Create these folders and files:
app
components
components/layout
components/dashboard
components/invoices
components/settlements
components/audit
components/settings
lib
lib/api.ts
lib/types.ts
lib/mockData.ts
lib/format.ts

Create TypeScript types in lib/types.ts for:
AssetType: CC or USDCx
InvoiceStatus: DRAFT, ISSUED, PAYMENT_PENDING, PAYMENT_CONFIRMED, SETTLEMENT_PENDING, SETTLED, FULFILLED, CANCELLED, DISPUTED
UserRole: BUSINESS, PAYER, SETTLEMENT_OPERATOR, OBSERVER
Invoice
SettlementInstruction
AuditEvent
DashboardMetrics
SystemStatus

Create API functions in lib/api.ts:
getSystemStatus()
getDashboardMetrics()
getInvoices()
getInvoiceById(id)
createInvoice(payload)
confirmPayment(invoiceId)
routeSettlement(invoiceId)
markSettled(invoiceId)
markFulfilled(invoiceId)
cancelInvoice(invoiceId)
disputeInvoice(invoiceId)
getAuditEvents(invoiceId)

Use mockData.ts only as a temporary adapter behind these API functions.
Components must call api.ts only.
Components must never import mockData.ts directly.

Use this future backend route structure:
GET /api/health
GET /api/system/status
GET /api/dashboard/metrics
GET /api/invoices
POST /api/invoices
GET /api/invoices/:id
POST /api/invoices/:id/confirm-payment
POST /api/invoices/:id/route-settlement
POST /api/invoices/:id/mark-settled
POST /api/invoices/:id/mark-fulfilled
POST /api/invoices/:id/cancel
POST /api/invoices/:id/dispute
GET /api/invoices/:id/audit

The UI must show backend readiness:
API status
Canton status
Environment: DevNet
Supported assets: CC and USDCx
Workflow mode: Invoice to settlement to audit

Brand identity:
Use the attached Glide logo as the primary brand mark.
The logo has black and blue wave marks with the word Glide in black.
The whole UI should visually match this logo.

Visual direction:
Clean
Modern
Fintech
Calm
Professional
Enterprise ready
Trustworthy
Smooth
Minimal

Color palette:
Primary dark: #111820 or near black charcoal
Primary blue: #2F9DDB or similar Glide blue from the logo
Secondary blue: #6EC6F1 or soft sky blue
Background dark: #071018 or deep navy charcoal
Card background: #101A23
Card border: #1F2D38
Text primary: #F8FAFC
Text secondary: #9CA3AF
Muted background: #16212B
White background sections may be used on landing only, but the dashboard should primarily be dark mode.
Use blue gradients inspired by the logo wave mark.
Do not use purple as the main brand color.
Do not use random crypto neon colors.
Do not use loud green everywhere.
Do not make it look like a trading terminal.

Logo usage:
Place the Glide logo in the sidebar header.
Place the Glide logo in the landing page hero.
Use a favicon placeholder tied to the logo.
If the logo is available in the public folder, reference it as /logo.png.
Keep the logo easy to replace.

Design system:
Use a fixed left sidebar on desktop.
Use a top bar with role selector, environment badge, and system status.
Use rounded cards, subtle borders, clear spacing, and soft shadows.
Use blue as the primary action color.
Use subtle wave line accents inspired by the logo.
Use status timelines that feel like money moving smoothly through a controlled workflow.
Avoid clutter.
Avoid too many gradients.
Avoid oversized cartoon illustrations.
Use real dashboard layout patterns.

Main navigation:
Dashboard
Invoices
Create Invoice
Settlement Queue
Audit Reports
Settings

Screen 1: Landing page
Create a polished landing page with:
Glide logo
Headline: Business payment workflows on Canton
Subheadline: Create invoices, confirm CC or USDCx payments, route settlement, record fulfillment, and keep a clear audit trail.
Primary CTA: Open Dashboard
Secondary CTA: Create Invoice
Section explaining the workflow:
Create invoice
Confirm payment
Route settlement
Record fulfillment
Generate audit trail
Section showing supported assets: CC and USDCx
Section showing roles: Business, Payer, Settlement Operator, Observer
Do not claim mainnet production payments.
Do not claim fiat payout.
Do not claim compliance automation.

Screen 2: Dashboard
Show:
Total invoices
Awaiting payment
Payment confirmed
Settlement pending
Settled
Fulfilled
Disputed
Total value in CC
Total value in USDCx
Recent invoices
Recent workflow activity
System status card showing API, Canton, DevNet, CC, USDCx

Screen 3: Create Invoice
Form fields:
Invoice title
Customer or payer name
Payer party ID
Observer party ID
Amount
Asset selector: CC or USDCx
Settlement destination
Due date
Description

The form should feel like a professional finance form, not a simple demo form.
After creating, route to invoice detail page.

Screen 4: Invoice List
Table with:
Invoice ID
Title
Payer
Amount
Asset
Status
Created date
Next action

Add filters:
Asset
Status
Role
Search

Make the table clean, responsive, and business friendly.

Screen 5: Invoice Detail
This is the most important screen.

Show:
Invoice summary
Amount and asset
Current status
Payer information
Settlement destination
Canton workflow reference
Timeline of state changes
Audit trail preview
Role based action panel

Action buttons based on status:
Confirm Payment
Route Settlement
Mark Settled
Mark Fulfilled
Cancel
Dispute

Show role aware panels:
Business view
Payer view
Settlement operator view
Observer view

The timeline should show:
Created
Issued
Payment pending
Payment confirmed
Settlement pending
Settled
Fulfilled

Screen 6: Settlement Queue
Show invoices that are PAYMENT_CONFIRMED or SETTLEMENT_PENDING.
Each row should show:
Invoice ID
Business
Payer
Amount
Asset
Destination
Current status
Action needed

Add action buttons:
Route Settlement
Mark Settled
View Audit

Screen 7: Audit Reports
Show audit trail for invoice workflows.
Each audit item should include:
Action
Actor role
Timestamp
Previous status
New status
Asset
Amount
Reference ID

Add filters:
Invoice ID
Asset
Status
Actor role
Date range

Add export button UI for audit report, but do not implement real export yet.

Screen 8: Settings
Show:
Supported assets: CC and USDCx
Canton environment: DevNet
Backend API base URL field placeholder
Role selector for demo mode
System status cards
Workflow configuration
Settlement policy preview

Status badge colors:
DRAFT: neutral gray
ISSUED: blue
PAYMENT_PENDING: amber
PAYMENT_CONFIRMED: blue
SETTLEMENT_PENDING: orange
SETTLED: green
FULFILLED: emerald
CANCELLED: gray
DISPUTED: red

Important UI behavior:
Include loading states.
Include empty states.
Include error states.
Use reusable components.
Use clean component names.
Make everything responsive for desktop and mobile.
Use accessible contrast.
Use readable font sizes.
Do not place important actions too close together.
Use confirmation style UI for destructive actions like Cancel or Dispute.

Product copy rules:
Use clear operational language.
Do not use hype.
Do not use vague crypto buzzwords.
Do not claim live mainnet settlement.
Do not claim fiat payout.
Do not claim full compliance automation.
Say: Glide currently supports CC and USDCx workflow modeling for Canton based invoice, settlement, fulfillment, and audit flows.

Technical expectations:
The final output should be a polished frontend that can be exported as a zip.

It must be easy to wire to a real Node.js backend, Prisma database, and Canton smart contract workflow later.
Use typed data models.
Keep API calls centralized.
Keep business logic out of visual components.
Make the app feel production ready from the first screen.