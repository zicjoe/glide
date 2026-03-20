;; glide-core.clar

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_ALREADY_REGISTERED (err u101))
(define-constant ERR_MERCHANT_NOT_FOUND (err u102))
(define-constant ERR_EXECUTOR_ALREADY_SET (err u103))
(define-constant ERR_EXECUTOR_NOT_FOUND (err u104))

(define-data-var contract-owner principal tx-sender)
(define-data-var merchant-nonce uint u0)

(define-map merchants
  { merchant-id: uint }
  {
    owner: principal,
    active: bool,
    created-at: uint
  }
)

(define-map merchant-id-by-owner
  { owner: principal }
  { merchant-id: uint }
)

(define-map settlement-executors
  { executor: principal }
  { enabled: bool }
)

(define-map yield-executors
  { executor: principal }
  { enabled: bool }
)

(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

(define-read-only (get-merchant (merchant-id uint))
  (ok (map-get? merchants { merchant-id: merchant-id }))
)

(define-read-only (get-merchant-id-by-owner (owner principal))
  (ok (map-get? merchant-id-by-owner { owner: owner }))
)

(define-read-only (is-merchant-owner (merchant-id uint) (who principal))
  (match (map-get? merchants { merchant-id: merchant-id })
    merchant (ok (is-eq who (get owner merchant)))
    (ok false)
  )
)

(define-read-only (is-settlement-executor (who principal))
  (match (map-get? settlement-executors { executor: who })
    executor-row (ok (get enabled executor-row))
    (ok false)
  )
)

(define-read-only (is-yield-executor (who principal))
  (match (map-get? yield-executors { executor: who })
    executor-row (ok (get enabled executor-row))
    (ok false)
  )
)

(define-public (register-merchant)
  (begin
    (asserts! (is-none (map-get? merchant-id-by-owner { owner: tx-sender })) ERR_ALREADY_REGISTERED)
    (let ((next-id (+ (var-get merchant-nonce) u1)))
      (map-set merchants
        { merchant-id: next-id }
        {
          owner: tx-sender,
          active: true,
          created-at: stacks-block-height
        }
      )
      (map-set merchant-id-by-owner
        { owner: tx-sender }
        { merchant-id: next-id }
      )
      (var-set merchant-nonce next-id)
      (ok next-id)
    )
  )
)

(define-public (set-merchant-active (merchant-id uint) (active bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (match (map-get? merchants { merchant-id: merchant-id })
      merchant
        (begin
          (map-set merchants
            { merchant-id: merchant-id }
            {
              owner: (get owner merchant),
              active: active,
              created-at: (get created-at merchant)
            }
          )
          (ok true)
        )
      ERR_MERCHANT_NOT_FOUND
    )
  )
)

(define-public (set-settlement-executor (executor principal) (enabled bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (map-set settlement-executors
      { executor: executor }
      { enabled: enabled }
    )
    (ok true)
  )
)

(define-public (set-yield-executor (executor principal) (enabled bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
    (map-set yield-executors
      { executor: executor }
      { enabled: enabled }
    )
    (ok true)
  )
)