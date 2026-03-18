"use client";

import { useEffect, useState } from "react";
import { getIndexedInvoiceByReference } from "@/lib/api/indexer";
import type {
  Invoice,
  PayoutDestination,
  TreasuryPolicy,
} from "@/lib/contracts/types";

type CheckoutPaymentStatus = {
  paymentStatus: string;
  observedAmount: number | null;
  observedAsset: number | null;
  observedTxid: string | null;
  observedAt: number | null;
  confirmedAt: number | null;
  updatedAt: number | null;
};

type CheckoutInvoiceResult = {
  invoice: Invoice | null;
  policy: TreasuryPolicy | null;
  paymentDestination: PayoutDestination | null;
  paymentStatus: CheckoutPaymentStatus | null;
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

function mapPaymentStatus(row: any): CheckoutPaymentStatus | null {
  if (!row) return null;

  return {
    paymentStatus: String(row.payment_status),
    observedAmount:
      row.observed_amount == null ? null : Number(row.observed_amount),
    observedAsset:
      row.observed_asset == null ? null : Number(row.observed_asset),
    observedTxid: row.observed_txid == null ? null : String(row.observed_txid),
    observedAt: row.observed_at == null ? null : Number(row.observed_at),
    confirmedAt: row.confirmed_at == null ? null : Number(row.confirmed_at),
    updatedAt: row.updated_at == null ? null : Number(row.updated_at),
  };
}

export function useCheckoutInvoice(reference: string): CheckoutInvoiceResult {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [policy, setPolicy] = useState<TreasuryPolicy | null>(null);
  const [paymentDestination, setPaymentDestination] =
    useState<PayoutDestination | null>(null);
  const [paymentStatus, setPaymentStatus] =
    useState<CheckoutPaymentStatus | null>(null);
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
        result.paymentDestination
          ? mapDestination(result.paymentDestination)
          : null,
      );
      setPaymentStatus(mapPaymentStatus(result.paymentStatus));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoice");
      setInvoice(null);
      setPolicy(null);
      setPaymentDestination(null);
      setPaymentStatus(null);
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
    paymentStatus,
    loading,
    error,
    refetch: load,
  };
}
