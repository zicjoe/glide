"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadInvoices, type StoredInvoice } from "@/lib/invoice-storage";
import { formatDateTime } from "@/lib/format/date";
import { getInvoiceStatus } from "@/lib/validators/invoice";
import type { Invoice } from "@/types/invoice";

interface CheckoutPageProps {
  params: Promise<{
    invoiceId: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const [invoiceId, setInvoiceId] = useState("");
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [isReady, setIsReady] = useState(false);

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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
          Glide Checkout
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {invoice.reference}
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {invoice.description}
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Invoice ID</dt>
              <dd className="max-w-[60%] break-all text-right font-medium text-zinc-950">
                {invoice.invoiceId}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Settlement asset</dt>
              <dd className="font-medium text-zinc-950">
                {invoice.settlementAsset}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Amount due</dt>
              <dd className="font-medium text-zinc-950">${invoice.amount}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Status</dt>
              <dd className="font-medium text-zinc-950">{invoice.status}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Expires</dt>
              <dd className="font-medium text-zinc-950">
                {formatDateTime(invoice.expiresAt)}
              </dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          disabled={invoice.status !== "OPEN"}
          className="mt-8 w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Pay invoice
        </button>
      </div>
    </main>
  );
}