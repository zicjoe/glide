;; glide-strategy-registry.clar

(define-constant ERR_UNAUTHORIZED (err u600))
(define-constant ERR_STRATEGY_NOT_FOUND (err u601))
(define-constant ERR_INVALID_ASSET (err u602))
(define-constant ERR_INVALID_RISK_LEVEL (err u603))
(define-constant ERR_INVALID_STATUS (err u604))

(define-constant ASSET_SBTC u0)
(define-constant ASSET_USDCX u1)

(define-constant RISK_LOW u0)
(define-constant RISK_MEDIUM u1)
(define-constant RISK_HIGH u2)

(define-data-var strategy-nonce uint u0)

(define-map strategies
  { strategy-id: uint }
  {
    name: (string-ascii 64),
    asset: uint,
    risk-level: uint,
    active: bool,
    created-at: uint,
    updated-at: uint
  }
)

(define-read-only (get-strategy (strategy-id uint))
  (ok (map-get? strategies { strategy-id: strategy-id }))
)

(define-read-only (is-strategy-active (strategy-id uint))
  (match (map-get? strategies { strategy-id: strategy-id })
    strategy
      (ok (get active strategy))
      (ok false))
)

(define-read-only (supports-asset (strategy-id uint) (asset uint))
  (match (map-get? strategies { strategy-id: strategy-id })
    strategy
      (ok (is-eq (get asset strategy) asset))
      (ok false))
)

(define-private (assert-admin)
  (let
    (
      (owner (unwrap-panic (contract-call? .glide-core get-contract-owner)))
    )
    (begin
      (asserts! (is-eq tx-sender owner) ERR_UNAUTHORIZED)
      (ok true)
    )
  )
)

(define-private (assert-valid-asset (asset uint))
  (begin
    (asserts!
      (or
        (is-eq asset ASSET_SBTC)
        (is-eq asset ASSET_USDCX)
      )
      ERR_INVALID_ASSET
    )
    (ok true)
  )
)

(define-private (assert-valid-risk-level (risk-level uint))
  (begin
    (asserts!
      (or
        (is-eq risk-level RISK_LOW)
        (is-eq risk-level RISK_MEDIUM)
        (is-eq risk-level RISK_HIGH)
      )
      ERR_INVALID_RISK_LEVEL
    )
    (ok true)
  )
)

(define-public
  (add-strategy
    (name (string-ascii 64))
    (asset uint)
    (risk-level uint)
  )
  (begin
    (try! (assert-admin))
    (try! (assert-valid-asset asset))
    (try! (assert-valid-risk-level risk-level))
    (let
      (
        (next-id (+ (var-get strategy-nonce) u1))
      )
      (map-set strategies
        { strategy-id: next-id }
        {
          name: name,
          asset: asset,
          risk-level: risk-level,
          active: true,
          created-at: stacks-block-height,
          updated-at: stacks-block-height
        }
      )
      (var-set strategy-nonce next-id)
      (ok next-id)
    )
  )
)

(define-public (set-strategy-active (strategy-id uint) (active bool))
  (begin
    (try! (assert-admin))
    (match (map-get? strategies { strategy-id: strategy-id })
      strategy
        (begin
          (map-set strategies
            { strategy-id: strategy-id }
            {
              name: (get name strategy),
              asset: (get asset strategy),
              risk-level: (get risk-level strategy),
              active: active,
              created-at: (get created-at strategy),
              updated-at: stacks-block-height
            }
          )
          (ok true)
        )
      ERR_STRATEGY_NOT_FOUND
    )
  )
)

(define-public (update-strategy-risk (strategy-id uint) (risk-level uint))
  (begin
    (try! (assert-admin))
    (try! (assert-valid-risk-level risk-level))
    (match (map-get? strategies { strategy-id: strategy-id })
      strategy
        (begin
          (map-set strategies
            { strategy-id: strategy-id }
            {
              name: (get name strategy),
              asset: (get asset strategy),
              risk-level: risk-level,
              active: (get active strategy),
              created-at: (get created-at strategy),
              updated-at: stacks-block-height
            }
          )
          (ok true)
        )
      ERR_STRATEGY_NOT_FOUND
    )
  )
)