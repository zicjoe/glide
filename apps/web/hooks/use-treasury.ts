"use client";

import { useEffect, useState } from "react";
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
  const { merchantId, enabled = true } = options;

  const [policy, setPolicy] = useState<TreasuryPolicy | null>(null);
  const [destinations, setDestinations] = useState<PayoutDestination[]>([]);
  const [buckets, setBuckets] = useState<TreasuryBucket[]>([]);
  const [policyValid, setPolicyValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  async function load(): Promise<void> {
    console.log("useTreasury merchantId", merchantId);
    console.log("useTreasury enabled", enabled);

    if (!enabled || merchantId == null) {
      setLoading(false);
      setError(null);
      setPolicy(null);
      setDestinations([]);
      setBuckets([]);
      setPolicyValid(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("1. reading treasury policy");
      const policyResult = await readTreasuryPolicy(glideReadClient, merchantId);
      console.log("policyResult", policyResult);
      setPolicy(policyResult);

      console.log("2. reading treasury policy validity");
      const validResult = await readTreasuryPolicyValid(glideReadClient, merchantId);
      console.log("validResult", validResult);
      setPolicyValid(validResult);

      const loadedDestinations: PayoutDestination[] = [];
      for (const destinationId of [1, 2, 3]) {
        console.log(`3.${destinationId} reading destination`, destinationId);
        const destination = await readTreasuryDestination(
          glideReadClient,
          merchantId,
          destinationId,
        );
        console.log(`destination ${destinationId}`, destination);

        if (destination) {
          loadedDestinations.push(destination);
        }
      }
      setDestinations(loadedDestinations);

      const loadedBuckets: TreasuryBucket[] = [];
      for (const bucketId of [1, 2, 3]) {
        console.log(`4.${bucketId} reading bucket`, bucketId);
        const bucket = await readTreasuryBucket(
          glideReadClient,
          merchantId,
          bucketId,
        );
        console.log(`bucket ${bucketId}`, bucket);

        if (bucket) {
          loadedBuckets.push(bucket);
        }
      }
      setBuckets(loadedBuckets);
    } catch (err) {
      console.error("useTreasury staged load error", err);
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
  }, [merchantId, enabled]);

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