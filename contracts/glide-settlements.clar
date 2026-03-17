;; glide-settlements.clar

(define-constant ERR_UNAUTHORIZED (err u400))
(define-constant ERR_MERCHANT_NOT_FOUND (err u401))
(define-constant ERR_INVOICE_NOT_FOUND (err u402))
(define-constant ERR_SETTLEMENT_NOT_FOUND (err u403))
(define-constant ERR_POLICY_INVALID (err u404))
(define-constant ERR_INVALID_STATUS (err u405))
(define-constant ERR_NOT_INVOICE_OWNER (err u406))
(define-constant ERR_NOT_OPEN_INVOICE (err u407))
(define-constant ERR_NOT_SETTLEMENT_EXECUTOR (err u408))
(define-constant ERR_INVALID_AMOUNT (err u409))
(define-constant ERR_INVALID_FEE (err u410))

(define-constant SETTLEMENT_PENDING u0)
(define-constant SETTLEMENT_PROCESSING u1)
(define-constant SETTLEMENT_COMPLETED u2)
(define-constant SETTLEMENT_FAILED u3)

(define-data-var settlement-nonce uint u0)

(define-map settlements
  { settlement-id: uint }
  {
    merchant-id: uint,
    invoice-id: uint,
    asset: uint,
    gross-amount: uint,
    fee-amount: uint,
    net-amount: uint,
    status: uint,
    created-at: uint,
    completed-at: uint,
    executor: principal
  }
)

(define-map settlement-bucket-allocations
  { settlement-id: uint, bucket-id: uint }
  {
    allocation-bps: uint,
    amount: uint,
    destination-id: uint
  }
)

(define-private (assert-settlement-executor)
  (let
    (
      (executor-response (contract-call? .glide-core is-settlement-executor tx-sender))
    )
    (match executor-response
      is-executor
        (asserts! is-executor ERR_NOT_SETTLEMENT_EXECUTOR)
      err-code
        (unwrap! none err-code)
    )
  )
)

(define-private (mul-bps (amount uint) (bps uint))
  (/ (* amount bps) u10000)
)

(define-private (store-allocation-if-enabled (merchant-id uint) (settlement-id uint) (bucket-id uint) (net-amount uint))
  (match (unwrap-panic (contract-call? .glide-treasury get-bucket merchant-id bucket-id))
    bucket
      (if (get enabled bucket)
        (let
          (
            (allocation-bps (get allocation-bps bucket))
            (destination-id (get destination-id bucket))
            (amount (mul-bps net-amount allocation-bps))
          )
          (begin
            (map-set settlement-bucket-allocations
              { settlement-id: settlement-id, bucket-id: bucket-id }
              {
                allocation-bps: allocation-bps,
                amount: amount,
                destination-id: destination-id
              }
            )
            true
          )
        )
        false
      )
    none false
  )
)

(define-read-only (get-settlement (settlement-id uint))
  (ok (map-get? settlements { settlement-id: settlement-id }))
)

(define-read-only (get-settlement-allocation (settlement-id uint) (bucket-id uint))
  (ok (map-get? settlement-bucket-allocations { settlement-id: settlement-id, bucket-id: bucket-id }))
)

(define-public
  (create-settlement
    (merchant-id uint)
    (invoice-id uint)
    (gross-amount uint)
    (fee-amount uint)
  )
  (begin
    (try! (assert-settlement-executor))
    (asserts! (> gross-amount u0) ERR_INVALID_AMOUNT)
    (asserts! (<= fee-amount gross-amount) ERR_INVALID_FEE)
    (asserts!
      (unwrap-panic (contract-call? .glide-treasury is-policy-valid merchant-id))
      ERR_POLICY_INVALID
    )
    (match (unwrap-panic (contract-call? .glide-invoices get-invoice invoice-id))
      invoice
        (begin
          (asserts! (is-eq merchant-id (get merchant-id invoice)) ERR_NOT_INVOICE_OWNER)
          (asserts! (is-eq (get status invoice) u0) ERR_NOT_OPEN_INVOICE)
          (let
            (
              (next-id (+ (var-get settlement-nonce) u1))
              (asset (get asset invoice))
              (net-amount (- gross-amount fee-amount))
            )
            (map-set settlements
              { settlement-id: next-id }
              {
                merchant-id: merchant-id,
                invoice-id: invoice-id,
                asset: asset,
                gross-amount: gross-amount,
                fee-amount: fee-amount,
                net-amount: net-amount,
                status: SETTLEMENT_PROCESSING,
                created-at: stacks-block-height,
                completed-at: u0,
                executor: tx-sender
              }
            )

            (store-allocation-if-enabled merchant-id next-id u1 net-amount)
            (store-allocation-if-enabled merchant-id next-id u2 net-amount)
            (store-allocation-if-enabled merchant-id next-id u3 net-amount)
            (store-allocation-if-enabled merchant-id next-id u4 net-amount)
            (store-allocation-if-enabled merchant-id next-id u5 net-amount)
            (store-allocation-if-enabled merchant-id next-id u6 net-amount)
            (store-allocation-if-enabled merchant-id next-id u7 net-amount)
            (store-allocation-if-enabled merchant-id next-id u8 net-amount)
            (store-allocation-if-enabled merchant-id next-id u9 net-amount)
            (store-allocation-if-enabled merchant-id next-id u10 net-amount)

            (var-set settlement-nonce next-id)
            (try! (contract-call? .glide-invoices mark-invoice-paid invoice-id))
            (try! (contract-call? .glide-invoices link-settlement invoice-id next-id))
            (ok next-id)
          )
        )
      none ERR_INVOICE_NOT_FOUND
    )
  )
)

(define-public (complete-settlement (settlement-id uint))
  (begin
    (try! (assert-settlement-executor))
    (match (map-get? settlements { settlement-id: settlement-id })
      settlement
        (begin
          (asserts!
            (or
              (is-eq (get status settlement) SETTLEMENT_PENDING)
              (is-eq (get status settlement) SETTLEMENT_PROCESSING)
            )
            ERR_INVALID_STATUS
          )
          (map-set settlements
            { settlement-id: settlement-id }
            {
              merchant-id: (get merchant-id settlement),
              invoice-id: (get invoice-id settlement),
              asset: (get asset settlement),
              gross-amount: (get gross-amount settlement),
              fee-amount: (get fee-amount settlement),
              net-amount: (get net-amount settlement),
              status: SETTLEMENT_COMPLETED,
              created-at: (get created-at settlement),
              completed-at: stacks-block-height,
              executor: (get executor settlement)
            }
          )
          (ok true)
        )
      ERR_SETTLEMENT_NOT_FOUND
    )
  )
)

(define-public (fail-settlement (settlement-id uint))
  (begin
    (try! (assert-settlement-executor))
    (match (map-get? settlements { settlement-id: settlement-id })
      settlement
        (begin
          (asserts!
            (or
              (is-eq (get status settlement) SETTLEMENT_PENDING)
              (is-eq (get status settlement) SETTLEMENT_PROCESSING)
            )
            ERR_INVALID_STATUS
          )
          (map-set settlements
            { settlement-id: settlement-id }
            {
              merchant-id: (get merchant-id settlement),
              invoice-id: (get invoice-id settlement),
              asset: (get asset settlement),
              gross-amount: (get gross-amount settlement),
              fee-amount: (get fee-amount settlement),
              net-amount: (get net-amount settlement),
              status: SETTLEMENT_FAILED,
              created-at: (get created-at settlement),
              completed-at: (get completed-at settlement),
              executor: (get executor settlement)
            }
          )
          (ok true)
        )
      ERR_SETTLEMENT_NOT_FOUND
    )
  )
)