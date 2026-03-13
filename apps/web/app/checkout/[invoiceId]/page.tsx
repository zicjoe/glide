"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDateTime } from "@/lib/format/date";
import { loadInvoices, type StoredInvoice, updateInvoiceStatus } from "@/lib/invoice-storage";
import {
  loadAllocations,
  loadPayments,
  loadSettlements,
  saveAllocations,
  savePayments,
  saveSettlements,
} from "@/lib/payment-storage";
import { executeSettlement } from "@/lib/settlement-engine";
import { loadTreasurySettings } from "@/lib/treasury-storage";
import { getInvoiceStatus } from "@/lib/validators/invoice";
import type { Invoice } from "@/types/invoice";
import {
    loadReconciliationRecords,
    saveReconciliationRecords,
  } from "@/lib/ops-storage";
import { createReconciliationRecord } from "@/lib/reconciliation";

interface CheckoutPageProps {
  params: Promise<{
    invoiceId: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const [invoiceId, setInvoiceId] = useState("");
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then((resolved) => {
      setInvoiceId(resolved.invoiceId);
      setInvoices(loadInvoices());
      setIsReady(true);
    });
  }, [params]);

  const invoice = useMemo(() => {
    const match = invoices.find((item) => item.invoiceId === invoiceId);

    if (!match) {
      return null;
    }

    return {
      ...match,
      status: getInvoiceStatus(match as Invoice),
    };
  }, [invoiceId, invoices]);

  const quote = useMemo(() => {
    if (!invoice) {
      return null;
    }

    return {
      inputAsset: invoice.settlementAsset,
      outputAsset: invoice.settlementAsset,
      inputAmount: invoice.amount,
      expectedOutputAmount: invoice.amount,
      networkFeeEstimate: "0.00",
      route: "Direct settlement",
    };
  }, [invoice]);

  function handlePayInvoice() {
    if (!invoice || invoice.status !== "OPEN") {
      return;
    }

    const treasury = loadTreasurySettings();

    if (!treasury) {
      setMessage("Treasury settings are required before payments can settle.");
      return;
    }

    setIsPaying(true);

    try {
      const result = executeSettlement({
        invoice,
        treasury,
      });

      const nextPayments = [result.payment, ...loadPayments()];
      const nextSettlements = [result.settlement, ...loadSettlements()];
      const nextAllocations = [...result.allocations, ...loadAllocations()];

      savePayments(nextPayments);
      saveSettlements(nextSettlements);
      saveAllocations(nextAllocations);

      const reconciliationRecord = createReconciliationRecord({
        invoice,
        payment: result.payment,
        settlement: result.settlement,
      });

      const nextReconciliationRecords = [
        reconciliationRecord,
        ...loadReconciliationRecords(),
      ];

      saveReconciliationRecords(nextReconciliationRecords);

      const nextInvoices = updateInvoiceStatus(invoice.invoiceId, "PAID");
      setInvoices(nextInvoices);
      setMessage("Payment confirmed and settlement recorded.");
    } catch {
      setMessage("Payment could not be processed.");
    } finally {
      setIsPaying(false);
    }
  }

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
            Glide Checkout
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-950">
            Invoice not found
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            The invoice link is invalid or no longer available on this device.
          </p>
          <Link
            href="/invoices"
            className="mt-6 inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
          >
            Back to invoices
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
          Glide Checkout
        </p>

        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {invoice.reference}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {invoice.description}
            </p>
          </div>

          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {invoice.status}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold text-zinc-950">Invoice details</h2>

            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Invoice ID</dt>
                <dd className="max-w-[60%] break-all text-right font-medium text-zinc-950">
                  {invoice.invoiceId}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Settlement asset</dt>
                <dd className="font-medium text-zinc-950">{invoice.settlementAsset}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Amount due</dt>
                <dd className="font-medium text-zinc-950">${invoice.amount}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Expires</dt>
                <dd className="font-medium text-zinc-950">
                  {formatDateTime(invoice.expiresAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold text-zinc-950">Quote preview</h2>

            {quote ? (
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Pay with</dt>
                  <dd className="font-medium text-zinc-950">{quote.inputAsset}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Receive as</dt>
                  <dd className="font-medium text-zinc-950">{quote.outputAsset}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Expected output</dt>
                  <dd className="font-medium text-zinc-950">
                    {quote.expectedOutputAmount} {quote.outputAsset}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Network fee</dt>
                  <dd className="font-medium text-zinc-950">
                    {quote.networkFeeEstimate} {quote.outputAsset}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Route</dt>
                  <dd className="font-medium text-zinc-950">{quote.route}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePayInvoice}
          disabled={invoice.status !== "OPEN" || isPaying}
          className="mt-8 w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isPaying ? "Processing..." : "Confirm payment"}
        </button>

        {message ? <p className="mt-4 text-sm text-zinc-600">{message}</p> : null}
      </div>
    </main>
  );
}