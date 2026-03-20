"use client";

import { useEffect, useState } from "react";
import { getPaymentReceipts } from "@/lib/api/indexer";

export type PaymentReceipt = {
  receiptId: number;
  merchantId: number;
  reference: string | null;
  assetLabel: string;
  amount: number;
  receiveAddress: string;
  txid: string;
  status: string;
  invoiceReference: string | null;
  createdAt: number;
  updatedAt: number;
};

type UsePaymentReceiptsResult = {
  receipts: PaymentReceipt[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapReceipt(row: any): PaymentReceipt {
  return {
    receiptId: Number(row.receipt_id),
    merchantId: Number(row.merchant_id),
    reference: row.reference == null ? null : String(row.reference),
    assetLabel: String(row.asset_label),
    amount: Number(row.amount),
    receiveAddress: String(row.receive_address),
    txid: String(row.txid),
    status: String(row.status),
    invoiceReference:
      row.invoice_reference == null ? null : String(row.invoice_reference),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export function usePaymentReceipts(
  merchantId: number | null,
): UsePaymentReceiptsResult {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setReceipts([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getPaymentReceipts(merchantId);
      setReceipts(result.receipts.map(mapReceipt));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load receipts");
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId]);

  return {
    receipts,
    loading,
    error,
    refetch: load,
  };
}