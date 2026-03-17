;; glide-invoices.clar

(define-constant ERR_UNAUTHORIZED (err u300))
(define-constant ERR_MERCHANT_NOT_FOUND (err u301))
(define-constant ERR_INVOICE_NOT_FOUND (err u302))
(define-constant ERR_INVALID_STATUS (err u303))
(define-constant ERR_ALREADY_PAID (err u304))
(define-constant ERR_ALREADY_CANCELLED (err u305))
(define-constant ERR_ALREADY_EXPIRED (err u306))
(define-constant ERR_INVALID_EXPIRY (err u307))
(define-constant ERR_SETTLEMENT_ALREADY_LINKED (err u308))
(define-constant ERR_NOT_SETTLEMENT_EXECUTOR (err u309))
(define-constant ERR_NOT_INVOICE_OWNER (err u310))

(define-constant ASSET_SBTC u0)
(define-constant ASSET_USDCX u1)

(define-constant INVOICE_OPEN u0)
(define-constant INVOICE_PAID u1)
(define-constant INVOICE_EXPIRED u2)
(define-constant INVOICE_CANCELLED u3)

(define-data-var invoice-nonce uint u0)

(define-map invoices
  { invoice-id: uint }
  {
    merchant-id: uint,
    reference: (string-ascii 32),
    asset: uint,
    amount: uint,
    description: (string-utf8 120),
    expiry-at: uint,
    status: uint,
    created-at: uint,
    paid-at: uint,
    settlement-id: (optional uint)
  }
)

(define-private (assert-merchant-owner (merchant-id uint))
  (let
    (
      (merchant-opt (unwrap-panic (contract-call? .glide-core get-merchant merchant-id)))
    )
    (match merchant-opt
      merchant
        (begin
          (asserts! (is-eq tx-sender (get owner merchant)) ERR_UNAUTHORIZED)
          (ok true)
        )
      ERR_MERCHANT_NOT_FOUND
    )
  )
)

(define-private (assert-settlement-executor)
  (let
    (
      (is-executor (unwrap-panic (contract-call? .glide-core is-settlement-executor tx-sender)))
    )
    (begin
      (asserts! is-executor ERR_NOT_SETTLEMENT_EXECUTOR)
      (ok true)
    )
  )
)

(define-read-only (get-invoice (invoice-id uint))
  (ok (map-get? invoices { invoice-id: invoice-id }))
)

(define-read-only (get-invoice-status (invoice-id uint))
  (match (map-get? invoices { invoice-id: invoice-id })
    invoice
      (ok (some (get status invoice)))
      (ok none))
)

(define-read-only (get-invoice-settlement-id (invoice-id uint))
  (match (map-get? invoices { invoice-id: invoice-id })
    invoice
      (ok (get settlement-id invoice))
      (ok none))
)

(define-public
  (create-invoice
    (merchant-id uint)
    (reference (string-ascii 32))
    (asset uint)
    (amount uint)
    (description (string-utf8 120))
    (expiry-at uint)
  )
  (begin
    (try! (assert-merchant-owner merchant-id))
    (asserts! (> expiry-at stacks-block-height) ERR_INVALID_EXPIRY)
    (let
      (
        (next-id (+ (var-get invoice-nonce) u1))
      )
      (map-set invoices
        { invoice-id: next-id }
        {
          merchant-id: merchant-id,
          reference: reference,
          asset: asset,
          amount: amount,
          description: description,
          expiry-at: expiry-at,
          status: INVOICE_OPEN,
          created-at: stacks-block-height,
          paid-at: u0,
          settlement-id: none
        }
      )
      (var-set invoice-nonce next-id)
      (ok next-id)
    )
  )
)

(define-public (cancel-invoice (merchant-id uint) (invoice-id uint))
  (begin
    (try! (assert-merchant-owner merchant-id))
    (match (map-get? invoices { invoice-id: invoice-id })
      invoice
        (begin
          (asserts! (is-eq merchant-id (get merchant-id invoice)) ERR_NOT_INVOICE_OWNER)
          (asserts! (is-eq (get status invoice) INVOICE_OPEN) ERR_INVALID_STATUS)
          (map-set invoices
            { invoice-id: invoice-id }
            {
              merchant-id: (get merchant-id invoice),
              reference: (get reference invoice),
              asset: (get asset invoice),
              amount: (get amount invoice),
              description: (get description invoice),
              expiry-at: (get expiry-at invoice),
              status: INVOICE_CANCELLED,
              created-at: (get created-at invoice),
              paid-at: (get paid-at invoice),
              settlement-id: (get settlement-id invoice)
            }
          )
          (ok true)
        )
      ERR_INVOICE_NOT_FOUND
    )
  )
)

(define-public (expire-invoice (invoice-id uint))
  (match (map-get? invoices { invoice-id: invoice-id })
    invoice
      (begin
        (asserts! (is-eq (get status invoice) INVOICE_OPEN) ERR_INVALID_STATUS)
        (asserts! (>= stacks-block-height (get expiry-at invoice)) ERR_INVALID_EXPIRY)
        (map-set invoices
          { invoice-id: invoice-id }
          {
            merchant-id: (get merchant-id invoice),
            reference: (get reference invoice),
            asset: (get asset invoice),
            amount: (get amount invoice),
            description: (get description invoice),
            expiry-at: (get expiry-at invoice),
            status: INVOICE_EXPIRED,
            created-at: (get created-at invoice),
            paid-at: (get paid-at invoice),
            settlement-id: (get settlement-id invoice)
          }
        )
        (ok true)
      )
    ERR_INVOICE_NOT_FOUND
  )
)

(define-public (mark-invoice-paid (invoice-id uint))
  (begin
    (try! (assert-settlement-executor))
    (match (map-get? invoices { invoice-id: invoice-id })
      invoice
        (begin
          (asserts! (is-eq (get status invoice) INVOICE_OPEN) ERR_ALREADY_PAID)
          (map-set invoices
            { invoice-id: invoice-id }
            {
              merchant-id: (get merchant-id invoice),
              reference: (get reference invoice),
              asset: (get asset invoice),
              amount: (get amount invoice),
              description: (get description invoice),
              expiry-at: (get expiry-at invoice),
              status: INVOICE_PAID,
              created-at: (get created-at invoice),
              paid-at: stacks-block-height,
              settlement-id: (get settlement-id invoice)
            }
          )
          (ok true)
        )
      ERR_INVOICE_NOT_FOUND
    )
  )
)

(define-public (link-settlement (invoice-id uint) (settlement-id uint))
  (begin
    (try! (assert-settlement-executor))
    (match (map-get? invoices { invoice-id: invoice-id })
      invoice
        (begin
          (asserts! (is-none (get settlement-id invoice)) ERR_SETTLEMENT_ALREADY_LINKED)
          (map-set invoices
            { invoice-id: invoice-id }
            {
              merchant-id: (get merchant-id invoice),
              reference: (get reference invoice),
              asset: (get asset invoice),
              amount: (get amount invoice),
              description: (get description invoice),
              expiry-at: (get expiry-at invoice),
              status: (get status invoice),
              created-at: (get created-at invoice),
              paid-at: (get paid-at invoice),
              settlement-id: (some settlement-id)
            }
          )
          (ok true)
        )
      ERR_INVOICE_NOT_FOUND
    )
  )
)