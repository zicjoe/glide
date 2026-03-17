"use client";

import { useEffect, useState } from "react";
import { getIndexedInvoices } from "@/lib/api/indexer";
import type { Invoice } from "@/lib/contracts/types";

type UseIndexedInvoicesResult = {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapInvoice(row: any): Invoice {
  return {
    invoiceId: Number(row.invoice_id),
    merchantId: Number(row.merchant_id),
    reference: String(row.reference),
    asset: Number(row.asset) as 0 | 1,
    amount: Number(row.amount),
    description: String(row.description),
    expiryAt: Number(row.expiry_at),
    status: Number(row.status) as 0 | 1 | 2 | 3,
    createdAt: Number(row.created_at),
    paidAt: Number(row.paid_at),
    settlementId:
      row.settlement_id == null ? null : Number(row.settlement_id),
  };
}

export function useIndexedInvoices(
  merchantId: number | null,
): UseIndexedInvoicesResult {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(merchantId));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!merchantId) {
      setInvoices([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedInvoices(merchantId);
      setInvoices(result.invoices.map(mapInvoice));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [merchantId]);

  return {
    invoices,
    loading,
    error,
    refetch: load,
  };
}
