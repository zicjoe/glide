;; glide-yield.clar

(define-constant ERR_UNAUTHORIZED (err u500))
(define-constant ERR_NOT_YIELD_EXECUTOR (err u501))
(define-constant ERR_QUEUE_NOT_FOUND (err u502))
(define-constant ERR_POSITION_NOT_FOUND (err u503))
(define-constant ERR_INVALID_STATUS (err u504))
(define-constant ERR_INVALID_AMOUNT (err u505))
(define-constant ERR_INVALID_STRATEGY (err u506))
(define-constant ERR_BUCKET_NOT_FOUND (err u507))
(define-constant ERR_BUCKET_NOT_EARN_MODE (err u508))
(define-constant ERR_BUCKET_DISABLED (err u509))
(define-constant ERR_ASSET_MISMATCH (err u510))
(define-constant ERR_STRATEGY_NOT_ACTIVE (err u511))
(define-constant ERR_STRATEGY_ASSET_MISMATCH (err u512))
(define-constant ERR_STRATEGY_NOT_FOUND (err u513))

(define-constant ASSET_SBTC u0)
(define-constant ASSET_USDCX u1)

(define-constant IDLE_MODE_HOLD u0)
(define-constant IDLE_MODE_EARN u1)

(define-constant YIELD_QUEUED u0)
(define-constant YIELD_DEPLOYED u1)
(define-constant YIELD_WITHDRAWN u2)
(define-constant YIELD_PAUSED u3)
(define-constant YIELD_FAILED u4)

(define-data-var queue-nonce uint u0)
(define-data-var position-nonce uint u0)

(define-map yield-queue
  { queue-id: uint }
  {
    merchant-id: uint,
    bucket-id: uint,
    asset: uint,
    amount: uint,
    strategy-id: uint,
    status: uint,
    created-at: uint,
    executor: principal
  }
)

(define-map yield-positions
  { position-id: uint }
  {
    merchant-id: uint,
    bucket-id: uint,
    asset: uint,
    amount: uint,
    strategy-id: uint,
    status: uint,
    queued-id: uint,
    deployed-at: uint,
    withdrawn-at: uint,
    executor: principal
  }
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

(define-private (assert-strategy-valid (strategy-id uint) (asset uint))
  (begin
    (asserts! (> strategy-id u0) ERR_INVALID_STRATEGY)

    (match (unwrap-panic (contract-call? .glide-strategy-registry get-strategy strategy-id))
      strategy
        (begin
          (asserts! (get active strategy) ERR_STRATEGY_NOT_ACTIVE)
          (asserts! (is-eq (get asset strategy) asset) ERR_STRATEGY_ASSET_MISMATCH)
          (ok true)
        )
      ERR_STRATEGY_NOT_FOUND
    )
  )
)

(define-private (assert-bucket-earn-mode (merchant-id uint) (bucket-id uint) (asset uint))
  (let
    (
      (bucket-opt (unwrap-panic (contract-call? .glide-treasury get-bucket merchant-id bucket-id)))
    )
    (match bucket-opt
      bucket
        (begin
          (asserts! (get enabled bucket) ERR_BUCKET_DISABLED)
          (asserts! (is-eq (get idle-mode bucket) IDLE_MODE_EARN) ERR_BUCKET_NOT_EARN_MODE)
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

(define-read-only (get-queue-item (queue-id uint))
  (ok (map-get? yield-queue { queue-id: queue-id }))
)

(define-read-only (get-position (position-id uint))
  (ok (map-get? yield-positions { position-id: position-id }))
)

(define-public
  (queue-deployment
    (merchant-id uint)
    (bucket-id uint)
    (asset uint)
    (amount uint)
    (strategy-id uint)
  )
  (begin
    (try! (assert-yield-executor))
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (try! (assert-bucket-earn-mode merchant-id bucket-id asset))
    (try! (assert-strategy-valid strategy-id asset))
    (let
      (
        (next-id (+ (var-get queue-nonce) u1))
      )
      (map-set yield-queue
        { queue-id: next-id }
        {
          merchant-id: merchant-id,
          bucket-id: bucket-id,
          asset: asset,
          amount: amount,
          strategy-id: strategy-id,
          status: YIELD_QUEUED,
          created-at: stacks-block-height,
          executor: tx-sender
        }
      )
      (var-set queue-nonce next-id)
      (ok next-id)
    )
  )
)

(define-public (mark-deployed (queue-id uint))
  (begin
    (try! (assert-yield-executor))
    (match (map-get? yield-queue { queue-id: queue-id })
      queue-item
        (begin
          (asserts! (is-eq (get status queue-item) YIELD_QUEUED) ERR_INVALID_STATUS)
          (try! (assert-strategy-valid (get strategy-id queue-item) (get asset queue-item)))
          (let
            (
              (next-position-id (+ (var-get position-nonce) u1))
            )
            (map-set yield-queue
              { queue-id: queue-id }
              {
                merchant-id: (get merchant-id queue-item),
                bucket-id: (get bucket-id queue-item),
                asset: (get asset queue-item),
                amount: (get amount queue-item),
                strategy-id: (get strategy-id queue-item),
                status: YIELD_DEPLOYED,
                created-at: (get created-at queue-item),
                executor: (get executor queue-item)
              }
            )
            (map-set yield-positions
              { position-id: next-position-id }
              {
                merchant-id: (get merchant-id queue-item),
                bucket-id: (get bucket-id queue-item),
                asset: (get asset queue-item),
                amount: (get amount queue-item),
                strategy-id: (get strategy-id queue-item),
                status: YIELD_DEPLOYED,
                queued-id: queue-id,
                deployed-at: stacks-block-height,
                withdrawn-at: u0,
                executor: tx-sender
              }
            )
            (var-set position-nonce next-position-id)
            (ok next-position-id)
          )
        )
      ERR_QUEUE_NOT_FOUND
    )
  )
)

(define-public (withdraw-position (position-id uint))
  (begin
    (try! (assert-yield-executor))
    (match (map-get? yield-positions { position-id: position-id })
      position
        (begin
          (asserts! (is-eq (get status position) YIELD_DEPLOYED) ERR_INVALID_STATUS)
          (map-set yield-positions
            { position-id: position-id }
            {
              merchant-id: (get merchant-id position),
              bucket-id: (get bucket-id position),
              asset: (get asset position),
              amount: (get amount position),
              strategy-id: (get strategy-id position),
              status: YIELD_WITHDRAWN,
              queued-id: (get queued-id position),
              deployed-at: (get deployed-at position),
              withdrawn-at: stacks-block-height,
              executor: (get executor position)
            }
          )
          (ok true)
        )
      ERR_POSITION_NOT_FOUND
    )
  )
)

(define-public (pause-position (position-id uint))
  (begin
    (try! (assert-yield-executor))
    (match (map-get? yield-positions { position-id: position-id })
      position
        (begin
          (asserts! (is-eq (get status position) YIELD_DEPLOYED) ERR_INVALID_STATUS)
          (map-set yield-positions
            { position-id: position-id }
            {
              merchant-id: (get merchant-id position),
              bucket-id: (get bucket-id position),
              asset: (get asset position),
              amount: (get amount position),
              strategy-id: (get strategy-id position),
              status: YIELD_PAUSED,
              queued-id: (get queued-id position),
              deployed-at: (get deployed-at position),
              withdrawn-at: (get withdrawn-at position),
              executor: (get executor position)
            }
          )
          (ok true)
        )
      ERR_POSITION_NOT_FOUND
    )
  )
)

(define-public (fail-queue-item (queue-id uint))
  (begin
    (try! (assert-yield-executor))
    (match (map-get? yield-queue { queue-id: queue-id })
      queue-item
        (begin
          (asserts!
            (or
              (is-eq (get status queue-item) YIELD_QUEUED)
              (is-eq (get status queue-item) YIELD_DEPLOYED)
            )
            ERR_INVALID_STATUS
          )
          (map-set yield-queue
            { queue-id: queue-id }
            {
              merchant-id: (get merchant-id queue-item),
              bucket-id: (get bucket-id queue-item),
              asset: (get asset queue-item),
              amount: (get amount queue-item),
              strategy-id: (get strategy-id queue-item),
              status: YIELD_FAILED,
              created-at: (get created-at queue-item),
              executor: (get executor queue-item)
            }
          )
          (ok true)
        )
      ERR_QUEUE_NOT_FOUND
    )
  )
)