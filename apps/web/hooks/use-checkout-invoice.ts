"use client";

import { useEffect, useState } from "react";
import { getIndexedInvoiceByReference } from "@/lib/api/indexer";
import type { Invoice, PayoutDestination, TreasuryPolicy } from "@/lib/contracts/types";

type CheckoutInvoiceResult = {
  invoice: Invoice | null;
  policy: TreasuryPolicy | null;
  paymentDestination: PayoutDestination | null;
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
    settlementId: row.settlement_id == null ? null : Number(row.settlement_id),
  };
}

function mapPolicy(row: any): TreasuryPolicy {
  return {
    merchantId: Number(row.merchant_id),
    settlementAsset: Number(row.settlement_asset) as 0 | 1,
    autoSplit: Boolean(row.auto_split),
    idleYield: Boolean(row.idle_yield),
    yieldThreshold: Number(row.yield_threshold),
    updatedAt: Number(row.updated_at),
  };
}

function mapDestination(row: any): PayoutDestination {
  return {
    merchantId: Number(row.merchant_id),
    destinationId: Number(row.destination_id),
    label: String(row.label),
    asset: Number(row.asset) as 0 | 1,
    destination: String(row.destination),
    destinationType: Number(row.destination_type) as 0 | 1 | 2,
    enabled: Boolean(row.enabled),
    createdAt: Number(row.created_at),
  };
}

export function useCheckoutInvoice(reference: string): CheckoutInvoiceResult {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [policy, setPolicy] = useState<TreasuryPolicy | null>(null);
  const [paymentDestination, setPaymentDestination] = useState<PayoutDestination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const result = await getIndexedInvoiceByReference(reference);

      setInvoice(result.invoice ? mapInvoice(result.invoice) : null);
      setPolicy(result.policy ? mapPolicy(result.policy) : null);
      setPaymentDestination(
        result.paymentDestination ? mapDestination(result.paymentDestination) : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoice");
      setInvoice(null);
      setPolicy(null);
      setPaymentDestination(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [reference]);

  return {
    invoice,
    policy,
    paymentDestination,
    loading,
    error,
    refetch: load,
  };
}