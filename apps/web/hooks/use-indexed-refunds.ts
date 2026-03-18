"use client";

import { useEffect, useState } from "react";
import { getIndexedRefunds } from "@/lib/api/indexer";

export type IndexedRefund = {
  refundId: string;
  merchantId: number;
  invoiceId: number | null;
  settlementId: number | null;
  asset: number;
  amount: number;
  destination: string;
  reason: string;
  status: string;
  requestedBy: string | null;
  createdAt: number;
  updatedAt: number;
};

type UseIndexedRefundsResult = {
  refunds: IndexedRefund[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapRefund(row: any): IndexedRefund {
  return {
    refundId: String(row.refund_id),
    merchantId: Number(row.merchant_id),
    invoiceId: row.invoice_id == null ? null : Number(row.invoice_id),
    settlementId: row.settlement_id == null ? null : Number(row.settlement_id),
    asset: Number(row.asset),
    amount: Number(row.amount),
    destination: String(row.destination),
    reason: String(row.reason),
    status: String(row.status),
    requestedBy: row.requested_by == null ? null : String(row.requested_by),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export function useIndexedRefunds(
  merchantId: number | null,
): UseIndexedRefundsResult {
  const [refunds, setRefunds] = useState<IndexedRefund[]>([]);
  const [loading, setLoading] = useState(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setRefunds([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedRefunds(merchantId);
      setRefunds(result.refunds.map(mapRefund));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load refunds");
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId]);

  return {
    refunds,
    loading,
    error,
    refetch: load,
  };
}
