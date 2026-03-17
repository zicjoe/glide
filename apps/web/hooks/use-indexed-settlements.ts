"use client";

import { useEffect, useState } from "react";
import { getIndexedSettlements } from "@/lib/api/indexer";

export type IndexedSettlement = {
  settlementId: number;
  merchantId: number;
  invoiceId: number;
  asset: number;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: number;
  createdAt: number;
  completedAt: number;
  executor: string;
};

export type IndexedSettlementAllocation = {
  settlementId: number;
  bucketId: number;
  allocationBps: number;
  amount: number;
  destinationId: number;
};

type UseIndexedSettlementsResult = {
  settlements: IndexedSettlement[];
  allocations: IndexedSettlementAllocation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapSettlement(row: any): IndexedSettlement {
  return {
    settlementId: Number(row.settlement_id),
    merchantId: Number(row.merchant_id),
    invoiceId: Number(row.invoice_id),
    asset: Number(row.asset),
    grossAmount: Number(row.gross_amount),
    feeAmount: Number(row.fee_amount),
    netAmount: Number(row.net_amount),
    status: Number(row.status),
    createdAt: Number(row.created_at),
    completedAt: Number(row.completed_at),
    executor: String(row.executor),
  };
}

function mapAllocation(row: any): IndexedSettlementAllocation {
  return {
    settlementId: Number(row.settlement_id),
    bucketId: Number(row.bucket_id),
    allocationBps: Number(row.allocation_bps),
    amount: Number(row.amount),
    destinationId: Number(row.destination_id),
  };
}

export function useIndexedSettlements(
  merchantId: number | null,
): UseIndexedSettlementsResult {
  const [settlements, setSettlements] = useState<IndexedSettlement[]>([]);
  const [allocations, setAllocations] = useState<IndexedSettlementAllocation[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setSettlements([]);
      setAllocations([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedSettlements(merchantId);
      setSettlements(result.settlements.map(mapSettlement));
      setAllocations(result.allocations.map(mapAllocation));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settlements");
      setSettlements([]);
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId]);

  return {
    settlements,
    allocations,
    loading,
    error,
    refetch: load,
  };
}