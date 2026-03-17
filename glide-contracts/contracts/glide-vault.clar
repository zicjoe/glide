;; glide-vault.clar

(define-constant ERR_UNAUTHORIZED (err u700))
(define-constant ERR_NOT_SETTLEMENT_EXECUTOR (err u701))
(define-constant ERR_NOT_YIELD_EXECUTOR (err u702))
(define-constant ERR_INVALID_AMOUNT (err u703))
(define-constant ERR_BUCKET_NOT_FOUND (err u704))
(define-constant ERR_BUCKET_DISABLED (err u705))
(define-constant ERR_INSUFFICIENT_AVAILABLE (err u706))
(define-constant ERR_INSUFFICIENT_QUEUED (err u707))
(define-constant ERR_INSUFFICIENT_DEPLOYED (err u708))
(define-constant ERR_INVALID_IDLE_MODE (err u709))
(define-constant ERR_ASSET_MISMATCH (err u710))

(define-constant ASSET_SBTC u0)
(define-constant ASSET_USDCX u1)

(define-constant IDLE_MODE_HOLD u0)
(define-constant IDLE_MODE_EARN u1)

(define-map vault-balances
  { merchant-id: uint, bucket-id: uint, asset: uint }
  {
    available: uint,
    queued: uint,
    deployed: uint,
    updated-at: uint
  }
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

(define-private (assert-yield-executor)
  (let
    (
      (is-executor (unwrap-panic (contract-call? .glide-core is-yield-executor tx-sender)))
    )
    (begin
      (asserts! is-executor ERR_NOT_YIELD_EXECUTOR)
      (ok true)
    )
  )
)

(define-private (assert-bucket-valid (merchant-id uint) (bucket-id uint) (asset uint))
  (let
    (
      (bucket-opt (unwrap-panic (contract-call? .glide-treasury get-bucket merchant-id bucket-id)))
    )
    (match bucket-opt
      bucket
        (begin
          (asserts! (get enabled bucket) ERR_BUCKET_DISABLED)
          (let
            (
              (destination-opt (unwrap-panic (contract-call? .glide-treasury get-destination merchant-id (get destination-id bucket))))
            )
            (match destination-opt
              destination
                (begin
                  (asserts! (is-eq (get asset destination) asset) ERR_ASSET_MISMATCH)
                  (ok true)
                )
              ERR_BUCKET_NOT_FOUND
            )
          )
        )
      ERR_BUCKET_NOT_FOUND
    )
  )
)

(define-private (assert-bucket-earn-mode (merchant-id uint) (bucket-id uint))
  (let
    (
      (bucket-opt (unwrap-panic (contract-call? .glide-treasury get-bucket merchant-id bucket-id)))
    )
    (match bucket-opt
      bucket
        (begin
          (asserts! (is-eq (get idle-mode bucket) IDLE_MODE_EARN) ERR_INVALID_IDLE_MODE)
          (ok true)
        )
      ERR_BUCKET_NOT_FOUND
    )
  )
)

(define-private (get-balance-row (merchant-id uint) (bucket-id uint) (asset uint))
  (default-to
    {
      available: u0,
      queued: u0,
      deployed: u0,
      updated-at: stacks-block-height
    }
    (map-get? vault-balances { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset })
  )
)

(define-read-only (get-balance (merchant-id uint) (bucket-id uint) (asset uint))
  (ok (map-get? vault-balances { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset }))
)

(define-read-only (get-available-balance (merchant-id uint) (bucket-id uint) (asset uint))
  (let
    (
      (row (default-to
        {
          available: u0,
          queued: u0,
          deployed: u0,
          updated-at: u0
        }
        (map-get? vault-balances { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset })
      ))
    )
    (ok (get available row))
  )
)

(define-read-only (get-queued-balance (merchant-id uint) (bucket-id uint) (asset uint))
  (let
    (
      (row (default-to
        {
          available: u0,
          queued: u0,
          deployed: u0,
          updated-at: u0
        }
        (map-get? vault-balances { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset })
      ))
    )
    (ok (get queued row))
  )
)

(define-read-only (get-deployed-balance (merchant-id uint) (bucket-id uint) (asset uint))
  (let
    (
      (row (default-to
        {
          available: u0,
          queued: u0,
          deployed: u0,
          updated-at: u0
        }
        (map-get? vault-balances { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset })
      ))
    )
    (ok (get deployed row))
  )
)

(define-public
  (credit-settlement-allocation
    (merchant-id uint)
    (bucket-id uint)
    (asset uint)
    (amount uint)
  )
  (begin
    (try! (assert-settlement-executor))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (try! (assert-bucket-valid merchant-id bucket-id asset))
    (let
      (
        (row (get-balance-row merchant-id bucket-id asset))
        (new-available (+ (get available row) amount))
      )
      (map-set vault-balances
        { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset }
        {
          available: new-available,
          queued: (get queued row),
          deployed: (get deployed row),
          updated-at: stacks-block-height
        }
      )
      (ok true)
    )
  )
)

(define-public
  (queue-balance-for-yield
    (merchant-id uint)
    (bucket-id uint)
    (asset uint)
    (amount uint)
  )
  (begin
    (try! (assert-yield-executor))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (try! (assert-bucket-valid merchant-id bucket-id asset))
    (try! (assert-bucket-earn-mode merchant-id bucket-id))
    (let
      (
        (row (get-balance-row merchant-id bucket-id asset))
      )
      (asserts! (>= (get available row) amount) ERR_INSUFFICIENT_AVAILABLE)
      (map-set vault-balances
        { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset }
        {
          available: (- (get available row) amount),
          queued: (+ (get queued row) amount),
          deployed: (get deployed row),
          updated-at: stacks-block-height
        }
      )
      (ok true)
    )
  )
)

(define-public
  (mark-queued-as-deployed
    (merchant-id uint)
    (bucket-id uint)
    (asset uint)
    (amount uint)
  )
  (begin
    (try! (assert-yield-executor))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (let
      (
        (row (get-balance-row merchant-id bucket-id asset))
      )
      (asserts! (>= (get queued row) amount) ERR_INSUFFICIENT_QUEUED)
      (map-set vault-balances
        { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset }
        {
          available: (get available row),
          queued: (- (get queued row) amount),
          deployed: (+ (get deployed row) amount),
          updated-at: stacks-block-height
        }
      )
      (ok true)
    )
  )
)

(define-public
  (return-queued-to-available
    (merchant-id uint)
    (bucket-id uint)
    (asset uint)
    (amount uint)
  )
  (begin
    (try! (assert-yield-executor))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (let
      (
        (row (get-balance-row merchant-id bucket-id asset))
      )
      (asserts! (>= (get queued row) amount) ERR_INSUFFICIENT_QUEUED)
      (map-set vault-balances
        { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset }
        {
          available: (+ (get available row) amount),
          queued: (- (get queued row) amount),
          deployed: (get deployed row),
          updated-at: stacks-block-height
        }
      )
      (ok true)
    )
  )
)

(define-public
  (withdraw-deployed-to-available
    (merchant-id uint)
    (bucket-id uint)
    (asset uint)
    (amount uint)
  )
  (begin
    (try! (assert-yield-executor))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (let
      (
        (row (get-balance-row merchant-id bucket-id asset))
      )
      (asserts! (>= (get deployed row) amount) ERR_INSUFFICIENT_DEPLOYED)
      (map-set vault-balances
        { merchant-id: merchant-id, bucket-id: bucket-id, asset: asset }
        {
          available: (+ (get available row) amount),
          queued: (get queued row),
          deployed: (- (get deployed row) amount),
          updated-at: stacks-block-height
        }
      )
      (ok true)
    )
  )
)