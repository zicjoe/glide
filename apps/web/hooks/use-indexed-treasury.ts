"use client";

import { useEffect, useState } from "react";
import {
  getIndexedMerchant,
  getIndexedTreasury,
} from "@/lib/api/indexer";
import type {
  Merchant,
  PayoutDestination,
  TreasuryBucket,
  TreasuryPolicy,
} from "@/lib/contracts/types";

type UseIndexedTreasuryResult = {
  merchant: Merchant | null;
  merchantId: number | null;
  policy: TreasuryPolicy | null;
  destinations: PayoutDestination[];
  buckets: TreasuryBucket[];
  policyValid: boolean | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapMerchant(row: any): Merchant {
  return {
    merchantId: row.merchant_id,
    owner: row.owner,
    active: Boolean(row.active),
    createdAt: Number(row.created_at),
  };
}

function mapPolicy(row: any): TreasuryPolicy {
  return {
    merchantId: row.merchant_id,
    settlementAsset: row.settlement_asset,
    autoSplit: Boolean(row.auto_split),
    idleYield: Boolean(row.idle_yield),
    yieldThreshold: Number(row.yield_threshold),
    updatedAt: Number(row.updated_at),
  };
}

function mapDestination(row: any): PayoutDestination {
  return {
    merchantId: row.merchant_id,
    destinationId: row.destination_id,
    label: row.label,
    asset: row.asset,
    destination: row.destination,
    destinationType: row.destination_type,
    enabled: Boolean(row.enabled),
    createdAt: Number(row.created_at),
  };
}

function mapBucket(row: any): TreasuryBucket {
  return {
    merchantId: row.merchant_id,
    bucketId: row.bucket_id,
    name: row.name,
    allocationBps: Number(row.allocation_bps),
    destinationId: Number(row.destination_id),
    idleMode: row.idle_mode,
    enabled: Boolean(row.enabled),
    createdAt: Number(row.created_at),
  };
}

export function useIndexedTreasury(owner: string | null): UseIndexedTreasuryResult {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [merchantId, setMerchantId] = useState<number | null>(null);
  const [policy, setPolicy] = useState<TreasuryPolicy | null>(null);
  const [destinations, setDestinations] = useState<PayoutDestination[]>([]);
  const [buckets, setBuckets] = useState<TreasuryBucket[]>([]);
  const [policyValid, setPolicyValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(owner));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!owner) {
      setLoading(false);
      setMerchant(null);
      setMerchantId(null);
      setPolicy(null);
      setDestinations([]);
      setBuckets([]);
      setPolicyValid(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const merchantRes = await getIndexedMerchant(owner);
      if (!merchantRes.merchant) {
        setMerchant(null);
        setMerchantId(null);
        setPolicy(null);
        setDestinations([]);
        setBuckets([]);
        setPolicyValid(null);
        return;
      }

      const mappedMerchant = mapMerchant(merchantRes.merchant);
      setMerchant(mappedMerchant);
      setMerchantId(mappedMerchant.merchantId);

      const treasuryRes = await getIndexedTreasury(mappedMerchant.merchantId);

      setPolicy(treasuryRes.policy ? mapPolicy(treasuryRes.policy) : null);
      setDestinations(treasuryRes.destinations.map(mapDestination));
      setBuckets(treasuryRes.buckets.map(mapBucket));

      const allocationTotal = treasuryRes.buckets.reduce(
        (sum, bucket) => sum + Number(bucket.allocation_bps),
        0
      );
      setPolicyValid(allocationTotal === 10000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load treasury";
      setError(message);
      setMerchant(null);
      setMerchantId(null);
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
  }, [owner]);

  return {
    merchant,
    merchantId,
    policy,
    destinations,
    buckets,
    policyValid,
    loading,
    error,
    refetch: load,
  };
}
