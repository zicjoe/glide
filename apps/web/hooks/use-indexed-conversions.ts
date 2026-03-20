"use client";

import { useEffect, useState } from "react";
import { getConversions } from "@/lib/api/indexer";

export type IndexedConversion = {
  conversionId: number;
  merchantId: number;
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  quoteRate: number;
  sourceAddress: string | null;
  destinationAddress: string | null;
  txid: string | null;
  status: string;
  metadata: any;
  createdAt: number;
  updatedAt: number;
};

type UseIndexedConversionsResult = {
  conversions: IndexedConversion[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapConversion(row: any): IndexedConversion {
  return {
    conversionId: Number(row.conversion_id),
    merchantId: Number(row.merchant_id),
    fromAsset: String(row.from_asset),
    toAsset: String(row.to_asset),
    fromAmount: Number(row.from_amount),
    toAmount: Number(row.to_amount),
    quoteRate: Number(row.quote_rate),
    sourceAddress: row.source_address == null ? null : String(row.source_address),
    destinationAddress:
      row.destination_address == null ? null : String(row.destination_address),
    txid: row.txid == null ? null : String(row.txid),
    status: String(row.status),
    metadata: row.metadata_json,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export function useIndexedConversions(
  merchantId: number | null,
): UseIndexedConversionsResult {
  const [conversions, setConversions] = useState<IndexedConversion[]>([]);
  const [loading, setLoading] = useState(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setConversions([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getConversions(merchantId);
      setConversions(result.conversions.map(mapConversion));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversions");
      setConversions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId]);

  return {
    conversions,
    loading,
    error,
    refetch: load,
  };
}