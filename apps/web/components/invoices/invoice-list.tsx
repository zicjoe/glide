"use client";

import {
  ExternalLink,
  Copy,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Invoice } from "@/lib/contracts/types";
import { ASSET, INVOICE_STATUS, assetLabel } from "@/lib/contracts/constants";
import { writeCreateSettlement } from "@/lib/contracts/writers";

const statusConfig = {
  open: {
    icon: Clock,
    label: "Open",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  paid: {
    icon: CheckCircle2,
    label: "Paid",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  expired: {
    icon: AlertCircle,
    label: "Expired",
    iconColor: "text-gray-600",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

function statusKey(status: number) {
  switch (status) {
    case INVOICE_STATUS.OPEN:
      return "open";
    case INVOICE_STATUS.PAID:
      return "paid";
    case INVOICE_STATUS.EXPIRED:
      return "expired";
    case INVOICE_STATUS.CANCELLED:
      return "cancelled";
    default:
      return "open";
  }
}

function expiryLabel(expiryAt: number, status: number) {
  if (status === INVOICE_STATUS.PAID) return "Paid";
  if (status === INVOICE_STATUS.EXPIRED) return "Expired";

  const now = Math.floor(Date.now() / 1000);
  const diff = expiryAt - now;
  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / 3600);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} left`;
  return `${hours} hour${hours !== 1 ? "s" : ""} left`;
}

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

type InvoiceListProps = {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  onSettled?: () => Promise<void> | void;
};

export function InvoiceList({
  invoices,
  loading,
  error,
  onSettled,
}: InvoiceListProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [settlingId, setSettlingId] = useState<number | null>(null);

  async function handleSettle(invoice: Invoice) {
    try {
      setSettlingId(invoice.invoiceId);
      setMessage(`Submitting settlement for ${invoice.reference}...`);

      const grossAmount = invoice.amount;
      const feeAmount = 0;

      await writeCreateSettlement({
        merchantId: invoice.merchantId,
        invoiceId: invoice.invoiceId,
        grossAmount,
        feeAmount,
      });

      setMessage(`Settlement submitted for ${invoice.reference}. Waiting for refresh...`);

      if (onSettled) {
        await onSettled();
      }

      setMessage(`Settlement created for ${invoice.reference}.`);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to create settlement",
      );
    } finally {
      setSettlingId(null);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Invoice List</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage payment requests and checkout links
          </p>
        </div>
      </div>

      {message ? <div className="px-6 py-4 text-sm text-gray-700">{message}</div> : null}

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading invoices...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : invoices.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No invoices yet.</div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const key = statusKey(invoice.status);
                const config = statusConfig[key];
                const StatusIcon = config.icon;
                const asset = assetLabel(invoice.asset);

                return (
                  <tr key={invoice.invoiceId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {invoice.reference}
                        </div>
                        <div className="text-xs text-gray-500">
                          Merchant #{invoice.merchantId}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          invoice.asset === ASSET.SBTC
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {asset}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {invoice.amount} {asset}
                        </div>
                        <div className="text-xs text-gray-500">{invoice.description}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}
                      >
                        <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor}`} />
                        <span className={`text-xs font-semibold ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {expiryLabel(invoice.expiryAt, invoice.status)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {createdLabel(invoice.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invoice.status === INVOICE_STATUS.OPEN && (
                          <>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
                            >
                              <Link href={`/invoices/${invoice.reference}`}>
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                Open
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                              onClick={() => void handleSettle(invoice)}
                              disabled={settlingId === invoice.invoiceId}
                            >
                              {settlingId === invoice.invoiceId ? "Settling..." : "Settle"}
                            </Button>

                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        {invoice.status === INVOICE_STATUS.PAID && (
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {invoice.status === INVOICE_STATUS.EXPIRED && (
                          <span className="text-xs text-gray-400">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}