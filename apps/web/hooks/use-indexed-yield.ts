"use client";

import { useEffect, useState } from "react";
import { getIndexedYield } from "@/lib/api/indexer";

export type IndexedYieldStrategy = {
  strategyId: number;
  name: string;
  asset: number;
  riskLevel: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
};

export type IndexedYieldQueueItem = {
  queueId: number;
  merchantId: number;
  bucketId: number;
  asset: number;
  amount: number;
  strategyId: number;
  status: number;
  createdAt: number;
  executor: string;
};

export type IndexedYieldPosition = {
  positionId: number;
  merchantId: number;
  bucketId: number;
  asset: number;
  amount: number;
  strategyId: number;
  status: number;
  queuedId: number;
  deployedAt: number;
  withdrawnAt: number;
  executor: string;
};

export type IndexedVaultBalance = {
  merchantId: number;
  bucketId: number;
  asset: number;
  available: number;
  queued: number;
  deployed: number;
  updatedAt: number;
};

type UseIndexedYieldResult = {
  strategies: IndexedYieldStrategy[];
  queueItems: IndexedYieldQueueItem[];
  positions: IndexedYieldPosition[];
  balances: IndexedVaultBalance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useIndexedYield(merchantId: number | null): UseIndexedYieldResult {
  const [strategies, setStrategies] = useState<IndexedYieldStrategy[]>([]);
  const [queueItems, setQueueItems] = useState<IndexedYieldQueueItem[]>([]);
  const [positions, setPositions] = useState<IndexedYieldPosition[]>([]);
  const [balances, setBalances] = useState<IndexedVaultBalance[]>([]);
  const [loading, setLoading] = useState(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setStrategies([]);
      setQueueItems([]);
      setPositions([]);
      setBalances([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedYield(merchantId);

      setStrategies(
        result.strategies.map((row) => ({
          strategyId: Number(row.strategy_id),
          name: String(row.name),
          asset: Number(row.asset),
          riskLevel: Number(row.risk_level),
          active: Boolean(row.active),
          createdAt: Number(row.created_at),
          updatedAt: Number(row.updated_at),
        })),
      );

      setQueueItems(
        result.queueItems.map((row) => ({
          queueId: Number(row.queue_id),
          merchantId: Number(row.merchant_id),
          bucketId: Number(row.bucket_id),
          asset: Number(row.asset),
          amount: Number(row.amount),
          strategyId: Number(row.strategy_id),
          status: Number(row.status),
          createdAt: Number(row.created_at),
          executor: String(row.executor),
        })),
      );

      setPositions(
        result.positions.map((row) => ({
          positionId: Number(row.position_id),
          merchantId: Number(row.merchant_id),
          bucketId: Number(row.bucket_id),
          asset: Number(row.asset),
          amount: Number(row.amount),
          strategyId: Number(row.strategy_id),
          status: Number(row.status),
          queuedId: Number(row.queued_id),
          deployedAt: Number(row.deployed_at),
          withdrawnAt: Number(row.withdrawn_at),
          executor: String(row.executor),
        })),
      );

      setBalances(
        result.balances.map((row) => ({
          merchantId: Number(row.merchant_id),
          bucketId: Number(row.bucket_id),
          asset: Number(row.asset),
          available: Number(row.available),
          queued: Number(row.queued),
          deployed: Number(row.deployed),
          updatedAt: Number(row.updated_at),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load yield");
      setStrategies([]);
      setQueueItems([]);
      setPositions([]);
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId]);

  return {
    strategies,
    queueItems,
    positions,
    balances,
    loading,
    error,
    refetch: load,
  };
}
