"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getIndexedInvoiceByReference,
  type IndexedInvoiceCheckoutResponse,
} from "@/lib/api/indexer";

export type CheckoutInvoice = {
  invoiceId: number;
  merchantId: number;
  reference: string;
  asset: number;
  amount: number;
  description: string;
  expiryAt: number;
  destinationId: number | null;
  paymentDestination: string;
  status: number;
  createdAt: number;
  paidAt: number;
  settlementId: number | null;
};

export type CheckoutPaymentStatus = {
  invoiceId: number;
  merchantId: number;
  paymentStatus: string;
  observedAmount: number | null;
  observedAsset: number | null;
  observedTxid: string | null;
  observedAt: number | null;
  confirmedAt: number | null;
  updatedAt: number;
};

export type CheckoutRail = {
  rail: string;
  label: string;
  assetLabel: string;
  amount: number;
  normalizedAsset: number;
  normalizedAmount: number;
  customerStatusLabel: string;
  cashbackEligible: boolean;
  cashbackBps: number;
  cashbackAmount: number;
  routeType: string;
  visibleMessage: string;
  address: string | null;
  addressLabel: string;
};

export type CheckoutData = {
  settlementAsset: number;
  settlementAssetLabel: string;
  settlementAmount: number;
  quoteSource: {
    btcUsd: number;
    usdcUsd: number;
    usdcxUsd: number;
    sbtcBtc: number;
    mode: string;
  } | null;
  defaultRail: string | null;
  rails: CheckoutRail[];
};

type UseCheckoutInvoiceResult = {
  invoice: CheckoutInvoice | null;
  paymentStatus: CheckoutPaymentStatus | null;
  checkout: CheckoutData | null;
  selectedRail: CheckoutRail | null;
  selectedRailKey: string | null;
  setSelectedRailKey: (rail: string) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapInvoice(
  row: NonNullable<IndexedInvoiceCheckoutResponse["invoice"]>,
): CheckoutInvoice {
  return {
    invoiceId: Number(row.invoice_id),
    merchantId: Number(row.merchant_id),
    reference: String(row.reference),
    asset: Number(row.asset),
    amount: Number(row.amount),
    description: String(row.description),
    expiryAt: Number(row.expiry_at),
    destinationId:
      "destination_id" in row && row.destination_id != null
        ? Number(row.destination_id)
        : null,
    paymentDestination:
      "payment_destination" in row ? String(row.payment_destination ?? "") : "",
    status: Number(row.status),
    createdAt: Number(row.created_at),
    paidAt: Number(row.paid_at),
    settlementId: row.settlement_id == null ? null : Number(row.settlement_id),
  };
}

function mapPaymentStatus(
  row: NonNullable<IndexedInvoiceCheckoutResponse["paymentStatus"]>,
): CheckoutPaymentStatus {
  return {
    invoiceId: Number(row.invoice_id),
    merchantId: Number(row.merchant_id),
    paymentStatus: String(row.payment_status),
    observedAmount:
      row.observed_amount == null ? null : Number(row.observed_amount),
    observedAsset:
      row.observed_asset == null ? null : Number(row.observed_asset),
    observedTxid:
      row.observed_txid == null ? null : String(row.observed_txid),
    observedAt: row.observed_at == null ? null : Number(row.observed_at),
    confirmedAt: row.confirmed_at == null ? null : Number(row.confirmed_at),
    updatedAt: Number(row.updated_at),
  };
}

function mapCheckout(
  row: NonNullable<IndexedInvoiceCheckoutResponse["checkout"]>,
): CheckoutData {
  return {
    settlementAsset: Number(row.settlementAsset),
    settlementAssetLabel: String(row.settlementAssetLabel),
    settlementAmount: Number(row.settlementAmount),
    quoteSource: row.quoteSource
      ? {
          btcUsd: Number(row.quoteSource.btcUsd),
          usdcUsd: Number(row.quoteSource.usdcUsd),
          usdcxUsd: Number(row.quoteSource.usdcxUsd),
          sbtcBtc: Number(row.quoteSource.sbtcBtc),
          mode: String(row.quoteSource.mode),
        }
      : null,
    defaultRail: row.defaultRail ? String(row.defaultRail) : null,
    rails: (row.rails ?? []).map((rail) => ({
      rail: String(rail.rail),
      label: String(rail.label),
      assetLabel: String(rail.assetLabel),
      amount: Number(rail.amount),
      normalizedAsset: Number(rail.normalizedAsset),
      normalizedAmount: Number(rail.normalizedAmount),
      customerStatusLabel: String(rail.customerStatusLabel),
      cashbackEligible: Boolean(rail.cashbackEligible),
      cashbackBps: Number(rail.cashbackBps),
      cashbackAmount: Number(rail.cashbackAmount),
      routeType: String(rail.routeType),
      visibleMessage: String(rail.visibleMessage),
      address: rail.address == null ? null : String(rail.address),
      addressLabel: String(rail.addressLabel),
    })),
  };
}

export function useCheckoutInvoice(reference: string): UseCheckoutInvoiceResult {
  const [invoice, setInvoice] = useState<CheckoutInvoice | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<CheckoutPaymentStatus | null>(null);
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [selectedRailKey, setSelectedRailKeyState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedRail = useMemo(() => {
    if (!checkout) return null;
    if (!selectedRailKey) return checkout.rails[0] ?? null;
    return checkout.rails.find((rail) => rail.rail === selectedRailKey) ?? checkout.rails[0] ?? null;
  }, [checkout, selectedRailKey]);

  function setSelectedRailKey(rail: string) {
    setSelectedRailKeyState(rail);
  }

  async function load() {
    try {
      setLoading(true);
      setError(null);

      let result: IndexedInvoiceCheckoutResponse | null = null;

      for (let attempt = 1; attempt <= 8; attempt++) {
        try {
          const response = await getIndexedInvoiceByReference(reference);
          if (response.invoice) {
            result = response;
            break;
          }
        } catch {
        }

        if (attempt < 8) {
          await sleep(1500);
        }
      }

      if (!result || !result.invoice) {
        setInvoice(null);
        setPaymentStatus(null);
        setCheckout(null);
        setSelectedRailKeyState(null);
        setError("Invoice not found yet. Please wait a few seconds and refresh.");
        return;
      }

      const mappedInvoice = mapInvoice(result.invoice);
      const mappedCheckout = result.checkout ? mapCheckout(result.checkout) : null;

      setInvoice(mappedInvoice);
      setPaymentStatus(result.paymentStatus ? mapPaymentStatus(result.paymentStatus) : null);
      setCheckout(mappedCheckout);

      setSelectedRailKeyState((current) => {
        if (current && mappedCheckout?.rails.some((rail) => rail.rail === current)) {
          return current;
        }
        return mappedCheckout?.defaultRail ?? mappedCheckout?.rails[0]?.rail ?? null;
      });
    } catch (err) {
      setInvoice(null);
      setPaymentStatus(null);
      setCheckout(null);
      setSelectedRailKeyState(null);
      setError(err instanceof Error ? err.message : "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [reference]);

  return {
    invoice,
    paymentStatus,
    checkout,
    selectedRail,
    selectedRailKey,
    setSelectedRailKey,
    loading,
    error,
    refetch: load,
  };
}