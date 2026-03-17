;; glide-treasury.clar

(define-constant ERR_UNAUTHORIZED (err u200))
(define-constant ERR_MERCHANT_NOT_FOUND (err u201))
(define-constant ERR_DESTINATION_NOT_FOUND (err u202))
(define-constant ERR_BUCKET_NOT_FOUND (err u203))
(define-constant ERR_TOO_MANY_BUCKETS (err u204))
(define-constant ERR_TOO_MANY_DESTINATIONS (err u205))
(define-constant ERR_INVALID_ALLOCATION (err u206))
(define-constant ERR_INVALID_DESTINATION_TYPE (err u207))
(define-constant ERR_INVALID_IDLE_MODE (err u208))

(define-constant ASSET_SBTC u0)
(define-constant ASSET_USDCX u1)

(define-constant DESTINATION_HOT_WALLET u0)
(define-constant DESTINATION_MULTI_SIG u1)
(define-constant DESTINATION_DEFI_CONTRACT u2)

(define-constant IDLE_MODE_HOLD u0)
(define-constant IDLE_MODE_EARN u1)

(define-constant MAX_BUCKETS u10)
(define-constant MAX_DESTINATIONS u20)
(define-constant BPS_TOTAL u10000)

(define-map merchant-policy
  { merchant-id: uint }
  {
    settlement-asset: uint,
    auto-split: bool,
    idle-yield: bool,
    yield-threshold: uint,
    updated-at: uint
  }
)

(define-map merchant-destination-count
  { merchant-id: uint }
  { count: uint }
)

(define-map merchant-bucket-count
  { merchant-id: uint }
  { count: uint }
)

(define-map payout-destinations
  { merchant-id: uint, destination-id: uint }
  {
    label: (string-ascii 64),
    asset: uint,
    destination: principal,
    destination-type: uint,
    enabled: bool,
    created-at: uint
  }
)

(define-map treasury-buckets
  { merchant-id: uint, bucket-id: uint }
  {
    name: (string-ascii 32),
    allocation-bps: uint,
    destination-id: uint,
    idle-mode: uint,
    enabled: bool,
    created-at: uint
  }
)

(define-read-only (is-merchant-owner (merchant-id uint) (who principal))
  (let
    (
      (merchant-opt (unwrap-panic (contract-call? .glide-core get-merchant merchant-id)))
    )
    (match merchant-opt
      merchant
        (ok (is-eq who (get owner merchant)))
      (ok false)
    )
  )
)

(define-private (assert-owner (merchant-id uint))
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

(define-private (get-destination-count-value (merchant-id uint))
  (default-to u0 (get count (map-get? merchant-destination-count { merchant-id: merchant-id })))
)

(define-private (get-bucket-count-value (merchant-id uint))
  (default-to u0 (get count (map-get? merchant-bucket-count { merchant-id: merchant-id })))
)

(define-private (bucket-enabled-bps (merchant-id uint) (bucket-id uint))
  (match (map-get? treasury-buckets { merchant-id: merchant-id, bucket-id: bucket-id })
    bucket
      (if (get enabled bucket) (get allocation-bps bucket) u0)
      u0
  )
)

(define-read-only (get-enabled-bucket-total (merchant-id uint))
  (ok (+ 
    (bucket-enabled-bps merchant-id u1)
    (bucket-enabled-bps merchant-id u2)
    (bucket-enabled-bps merchant-id u3)
    (bucket-enabled-bps merchant-id u4)
    (bucket-enabled-bps merchant-id u5)
    (bucket-enabled-bps merchant-id u6)
    (bucket-enabled-bps merchant-id u7)
    (bucket-enabled-bps merchant-id u8)
    (bucket-enabled-bps merchant-id u9)
    (bucket-enabled-bps merchant-id u10)
  ))
)

(define-read-only (is-policy-valid (merchant-id uint))
  (let
    (
      (enabled-total (+ 
        (bucket-enabled-bps merchant-id u1)
        (bucket-enabled-bps merchant-id u2)
        (bucket-enabled-bps merchant-id u3)
        (bucket-enabled-bps merchant-id u4)
        (bucket-enabled-bps merchant-id u5)
        (bucket-enabled-bps merchant-id u6)
        (bucket-enabled-bps merchant-id u7)
        (bucket-enabled-bps merchant-id u8)
        (bucket-enabled-bps merchant-id u9)
        (bucket-enabled-bps merchant-id u10)
      ))
    )
    (ok (is-eq enabled-total BPS_TOTAL))
  )
)

(define-read-only (get-policy (merchant-id uint))
  (ok (map-get? merchant-policy { merchant-id: merchant-id }))
)

(define-read-only (get-destination (merchant-id uint) (destination-id uint))
  (ok (map-get? payout-destinations { merchant-id: merchant-id, destination-id: destination-id }))
)

(define-read-only (get-bucket (merchant-id uint) (bucket-id uint))
  (ok (map-get? treasury-buckets { merchant-id: merchant-id, bucket-id: bucket-id }))
)

(define-public
  (set-policy
    (merchant-id uint)
    (settlement-asset uint)
    (auto-split bool)
    (idle-yield bool)
    (yield-threshold uint)
  )
  (begin
    (try! (assert-owner merchant-id))
    (map-set merchant-policy
      { merchant-id: merchant-id }
      {
        settlement-asset: settlement-asset,
        auto-split: auto-split,
        idle-yield: idle-yield,
        yield-threshold: yield-threshold,
        updated-at: stacks-block-height
      }
    )
    (ok true)
  )
)

(define-public
  (add-destination
    (merchant-id uint)
    (label (string-ascii 64))
    (asset uint)
    (destination principal)
    (destination-type uint)
  )
  (begin
    (try! (assert-owner merchant-id))
    (asserts!
      (or
        (is-eq destination-type DESTINATION_HOT_WALLET)
        (is-eq destination-type DESTINATION_MULTI_SIG)
        (is-eq destination-type DESTINATION_DEFI_CONTRACT)
      )
      ERR_INVALID_DESTINATION_TYPE
    )
    (let
      (
        (current-count (get-destination-count-value merchant-id))
        (next-id (+ current-count u1))
      )
      (asserts! (<= next-id MAX_DESTINATIONS) ERR_TOO_MANY_DESTINATIONS)
      (map-set payout-destinations
        { merchant-id: merchant-id, destination-id: next-id }
        {
          label: label,
          asset: asset,
          destination: destination,
          destination-type: destination-type,
          enabled: true,
          created-at: stacks-block-height
        }
      )
      (map-set merchant-destination-count
        { merchant-id: merchant-id }
        { count: next-id }
      )
      (ok next-id)
    )
  )
)

(define-public (set-destination-enabled (merchant-id uint) (destination-id uint) (enabled bool))
  (begin
    (try! (assert-owner merchant-id))
    (match (map-get? payout-destinations { merchant-id: merchant-id, destination-id: destination-id })
      dest
        (begin
          (map-set payout-destinations
            { merchant-id: merchant-id, destination-id: destination-id }
            {
              label: (get label dest),
              asset: (get asset dest),
              destination: (get destination dest),
              destination-type: (get destination-type dest),
              enabled: enabled,
              created-at: (get created-at dest)
            }
          )
          (ok true)
        )
      ERR_DESTINATION_NOT_FOUND
    )
  )
)

(define-public
  (add-bucket
    (merchant-id uint)
    (name (string-ascii 32))
    (allocation-bps uint)
    (destination-id uint)
    (idle-mode uint)
  )
  (begin
    (try! (assert-owner merchant-id))
    (asserts! (<= allocation-bps BPS_TOTAL) ERR_INVALID_ALLOCATION)
    (asserts!
      (or
        (is-eq idle-mode IDLE_MODE_HOLD)
        (is-eq idle-mode IDLE_MODE_EARN)
      )
      ERR_INVALID_IDLE_MODE
    )
    (asserts!
      (is-some (map-get? payout-destinations { merchant-id: merchant-id, destination-id: destination-id }))
      ERR_DESTINATION_NOT_FOUND
    )
    (let
      (
        (current-count (get-bucket-count-value merchant-id))
        (next-id (+ current-count u1))
      )
      (asserts! (<= next-id MAX_BUCKETS) ERR_TOO_MANY_BUCKETS)
      (map-set treasury-buckets
        { merchant-id: merchant-id, bucket-id: next-id }
        {
          name: name,
          allocation-bps: allocation-bps,
          destination-id: destination-id,
          idle-mode: idle-mode,
          enabled: true,
          created-at: stacks-block-height
        }
      )
      (map-set merchant-bucket-count
        { merchant-id: merchant-id }
        { count: next-id }
      )
      (ok next-id)
    )
  )
)

(define-public
  (update-bucket
    (merchant-id uint)
    (bucket-id uint)
    (allocation-bps uint)
    (destination-id uint)
    (idle-mode uint)
  )
  (begin
    (try! (assert-owner merchant-id))
    (asserts! (<= allocation-bps BPS_TOTAL) ERR_INVALID_ALLOCATION)
    (asserts!
      (or
        (is-eq idle-mode IDLE_MODE_HOLD)
        (is-eq idle-mode IDLE_MODE_EARN)
      )
      ERR_INVALID_IDLE_MODE
    )
    (asserts!
      (is-some (map-get? payout-destinations { merchant-id: merchant-id, destination-id: destination-id }))
      ERR_DESTINATION_NOT_FOUND
    )
    (match (map-get? treasury-buckets { merchant-id: merchant-id, bucket-id: bucket-id })
      bucket
        (begin
          (map-set treasury-buckets
            { merchant-id: merchant-id, bucket-id: bucket-id }
            {
              name: (get name bucket),
              allocation-bps: allocation-bps,
              destination-id: destination-id,
              idle-mode: idle-mode,
              enabled: (get enabled bucket),
              created-at: (get created-at bucket)
            }
          )
          (ok true)
        )
      ERR_BUCKET_NOT_FOUND
    )
  )
)

(define-public (set-bucket-enabled (merchant-id uint) (bucket-id uint) (enabled bool))
  (begin
    (try! (assert-owner merchant-id))
    (match (map-get? treasury-buckets { merchant-id: merchant-id, bucket-id: bucket-id })
      bucket
        (begin
          (map-set treasury-buckets
            { merchant-id: merchant-id, bucket-id: bucket-id }
            {
              name: (get name bucket),
              allocation-bps: (get allocation-bps bucket),
              destination-id: (get destination-id bucket),
              idle-mode: (get idle-mode bucket),
              enabled: enabled,
              created-at: (get created-at bucket)
            }
          )
          (ok true)
        )
      ERR_BUCKET_NOT_FOUND
    )
  )
)