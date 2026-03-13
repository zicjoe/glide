import type { TreasuryBucket, PayoutDestination, TreasuryPolicy } from "@/types/treasury";

export function getAllocationTotal(buckets: TreasuryBucket[]): number {
  return buckets
    .filter((bucket) => bucket.enabled)
    .reduce((sum, bucket) => sum + bucket.allocationBps, 0);
}

export function isValidAllocationTotal(buckets: TreasuryBucket[]): boolean {
  return getAllocationTotal(buckets) === 10000;
}

export function validateTreasuryPolicy(
  policy: TreasuryPolicy,
  buckets: TreasuryBucket[],
  destinations: PayoutDestination[],
): string[] {
  const errors: string[] = [];

  if (!policy.settlementAsset) {
    errors.push("Choose a default settlement asset.");
  }

  if (policy.yieldEnabled) {
    const threshold = Number(policy.yieldThreshold);

    if (!Number.isFinite(threshold) || threshold < 0) {
      errors.push("Yield threshold must be a valid non-negative number.");
    }
  }

  if (destinations.length === 0) {
    errors.push("Add at least one payout destination.");
  }

  if (buckets.length === 0) {
    errors.push("Add at least one treasury bucket.");
  }

  const total = getAllocationTotal(buckets);

  if (total !== 10000) {
    errors.push("Bucket allocations must total exactly 100%.");
  }

  for (const bucket of buckets) {
    const destinationExists = destinations.some(
      (destination) =>
        destination.destinationId === bucket.destinationId && destination.enabled,
    );

    if (!destinationExists) {
      errors.push(`Bucket "${bucket.name}" must reference an active destination.`);
    }
  }

  return Array.from(new Set(errors));
}