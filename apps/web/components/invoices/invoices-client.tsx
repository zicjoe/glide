"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { SETTLEMENT_ASSETS } from "@/lib/constants/treasury";
import { toDateTimeLocalInputValue, formatDateTime } from "@/lib/format/date";
import { createId } from "@/lib/format/id";
import { loadInvoices, saveInvoices, type StoredInvoice } from "@/lib/invoice-storage";
import { validateInvoiceForm, getInvoiceStatus } from "@/lib/validators/invoice";
import type { SettlementAsset } from "@/types/merchant";
import type { Invoice } from "@/types/invoice";

function createDefaultExpiry(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return toDateTimeLocalInputValue(date);
}

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const [form, setForm] = useState({
    reference: "",
    amount: "",
    settlementAsset: "USDCx" as SettlementAsset,
    description: "",
    expiresAt: createDefaultExpiry(),
  });

  useEffect(() => {
    const stored = loadInvoices();
    setInvoices(stored);
    setIsHydrated(true);
  }, []);

  const hydratedInvoices = useMemo(() => {
    return invoices.map((invoice) => ({
      ...invoice,
      status: getInvoiceStatus(invoice as Invoice),
    }));
  }, [invoices]);

  function handleCreateInvoice() {
    const nextErrors = validateInvoiceForm(form);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      setSaveMessage("");
      return;
    }

    const invoice: StoredInvoice = {
      invoiceId: createId("inv"),
      merchantId: "merchant_demo",
      reference: form.reference.trim(),
      amount: form.amount,
      settlementAsset: form.settlementAsset,
      description: form.description.trim(),
      expiresAt: new Date(form.expiresAt).toISOString(),
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    const nextInvoices = [invoice, ...invoices];
    setInvoices(nextInvoices);
    saveInvoices(nextInvoices);

    setForm({
      reference: "",
      amount: "",
      settlementAsset: form.settlementAsset,
      description: "",
      expiresAt: createDefaultExpiry(),
    });
    setErrors([]);
    setSaveMessage("Invoice created successfully.");
  }

  function handleCancelInvoice(invoiceId: string) {
    const nextInvoices = invoices.map((invoice) =>
      invoice.invoiceId === invoiceId
        ? { ...invoice, status: "CANCELLED" as const }
        : invoice,
    );

    setInvoices(nextInvoices);
    saveInvoices(nextInvoices);
    setSaveMessage("Invoice cancelled.");
  }

  if (!isHydrated) {
    return (
      <div className="p-8">
        <SectionCard
          title="Invoices"
          description="Loading invoice workspace."
        >
          <p className="text-sm text-zinc-500">Loading invoices...</p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Create invoice"
          description="Generate a merchant payment request with a chosen settlement asset."
        >
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">Reference</span>
              <input
                type="text"
                value={form.reference}
                onChange={(event) =>
                  setForm((current) => ({ ...current, reference: event.target.value }))
                }
                placeholder="INV-1001"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
                placeholder="100.00"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">
                Settlement asset
              </span>
              <select
                value={form.settlementAsset}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    settlementAsset: event.target.value as SettlementAsset,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              >
                {SETTLEMENT_ASSETS.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">Description</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Settlement for design retainer"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">Expiry</span>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    expiresAt: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
            </label>

            <button
              type="button"
              onClick={handleCreateInvoice}
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create invoice
            </button>

            {saveMessage ? (
              <p className="text-sm text-emerald-700">{saveMessage}</p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          title="Invoice summary"
          description="Preview key values before sending the payment link."
        >
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Reference</dt>
              <dd className="font-medium text-zinc-950">
                {form.reference || "Not set"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Amount</dt>
              <dd className="font-medium text-zinc-950">
                {form.amount ? `$${form.amount}` : "$0.00"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Settlement asset</dt>
              <dd className="font-medium text-zinc-950">{form.settlementAsset}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500">Expiry</dt>
              <dd className="font-medium text-zinc-950">
                {formatDateTime(new Date(form.expiresAt).toISOString())}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <SectionCard
        title="Invoice list"
        description="Track open, expired, and cancelled invoices."
      >
        {hydratedInvoices.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No invoices yet.
          </div>
        ) : (
          <div className="space-y-4">
            {hydratedInvoices.map((invoice) => (
              <div
                key={invoice.invoiceId}
                className="rounded-xl border border-zinc-200 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-zinc-950">
                        {invoice.reference}
                      </p>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {invoice.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-600">
                      {invoice.description}
                    </p>

                    <dl className="mt-3 space-y-1 text-xs text-zinc-500">
                      <div className="flex gap-2">
                        <dt>Invoice ID:</dt>
                        <dd className="break-all">{invoice.invoiceId}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt>Created:</dt>
                        <dd>{formatDateTime(invoice.createdAt)}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt>Expires:</dt>
                        <dd>{formatDateTime(invoice.expiresAt)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="min-w-[180px] space-y-3">
                    <p className="text-right text-lg font-semibold text-zinc-950">
                      ${invoice.amount}
                    </p>
                    <p className="text-right text-sm text-zinc-500">
                      Settles in {invoice.settlementAsset}
                    </p>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/checkout/${invoice.invoiceId}`}
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                      >
                        Open checkout
                      </Link>

                      {invoice.status === "OPEN" ? (
                        <button
                          type="button"
                          onClick={() => handleCancelInvoice(invoice.invoiceId)}
                          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Cancel invoice
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {errors.length > 0 ? (
        <SectionCard
          title="Validation issues"
          description="Resolve these before creating an invoice."
        >
          <ul className="space-y-2 text-sm text-red-600">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}