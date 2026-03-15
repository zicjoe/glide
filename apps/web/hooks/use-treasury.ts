"use client";

import { useEffect, useMemo, useState } from "react";
import { glideReadClient } from "@/lib/stacks/client";
import {
  readTreasuryBucket,
  readTreasuryDestination,
  readTreasuryPolicy,
  readTreasuryPolicyValid,
} from "@/lib/contracts/readers";
import type {
  PayoutDestination,
  TreasuryBucket,
  TreasuryPolicy,
} from "@/lib/contracts/types";

type UseTreasuryOptions = {
  merchantId?: number | null;
  maxDestinations?: number;
  maxBuckets?: number;
  enabled?: boolean;
};

type UseTreasuryResult = {
  policy: TreasuryPolicy | null;
  destinations: PayoutDestination[];
  buckets: TreasuryBucket[];
  policyValid: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useTreasury(
  options: UseTreasuryOptions = {},
): UseTreasuryResult {
  const {
    merchantId,
    maxDestinations = 20,
    maxBuckets = 10,
    enabled = true,
  } = options;

  const [policy, setPolicy] = useState<TreasuryPolicy | null>(null);
  const [destinations, setDestinations] = useState<PayoutDestination[]>([]);
  const [buckets, setBuckets] = useState<TreasuryBucket[]>([]);
  const [policyValid, setPolicyValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  async function load(): Promise<void> {
    if (!enabled || merchantId == null) {
      setLoading(false);
      setPolicy(null);
      setDestinations([]);
      setBuckets([]);
      setPolicyValid(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [policyResult, validResult] = await Promise.all([
        readTreasuryPolicy(glideReadClient, merchantId),
        readTreasuryPolicyValid(glideReadClient, merchantId),
      ]);

      const destinationReads = Array.from(
        { length: maxDestinations },
        async (_, index) => {
          const destinationId = index + 1;
          return readTreasuryDestination(glideReadClient, merchantId, destinationId);
        },
      );

      const bucketReads = Array.from({ length: maxBuckets }, async (_, index) => {
        const bucketId = index + 1;
        return readTreasuryBucket(glideReadClient, merchantId, bucketId);
      });

      const [destinationResults, bucketResults] = await Promise.all([
        Promise.all(destinationReads),
        Promise.all(bucketReads),
      ]);

      setPolicy(policyResult);
      setPolicyValid(validResult);
      setDestinations(
        destinationResults.filter(
          (item): item is PayoutDestination => item !== null,
        ),
      );
      setBuckets(
        bucketResults.filter((item): item is TreasuryBucket => item !== null),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load treasury";
      setError(message);
      setPolicy(null);
      setDestinations([]);
      setBuckets([]);
      setPolicyValid(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId, maxDestinations, maxBuckets, enabled]);

  return {
    policy,
    destinations,
    buckets,
    policyValid,
    loading,
    error,
    refetch: load,
  };
}