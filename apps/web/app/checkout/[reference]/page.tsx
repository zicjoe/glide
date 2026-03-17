"use client";

import { Copy, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCheckoutInvoice } from "@/hooks/use-checkout-invoice";
import {
  ASSET,
  INVOICE_STATUS,
  assetLabel,
  invoiceStatusLabel,
} from "@/lib/contracts/constants";

function expiryLabel(expiryAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = expiryAt - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / 3600);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} left`;
  return `${hours} hour${hours !== 1 ? "s" : ""} left`;
}

function statusIcon(status: number) {
  switch (status) {
    case INVOICE_STATUS.PAID:
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case INVOICE_STATUS.EXPIRED:
    case INVOICE_STATUS.CANCELLED:
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-amber-600" />;
  }
}

export default function CheckoutInvoicePage() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference;
  const { invoice, paymentDestination, loading, error } = useCheckoutInvoice(reference);

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-sm text-gray-600">Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="text-lg font-semibold text-red-700 mb-2">Invoice unavailable</div>
          <div className="text-sm text-red-600">{error || "Invoice not found"}</div>
        </div>
      </div>
    );
  }

  const isOpen = invoice.status === INVOICE_STATUS.OPEN;
  const asset = assetLabel(invoice.asset);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">Invoice Reference</div>
              <div className="text-2xl font-semibold text-gray-900">{invoice.reference}</div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                {statusIcon(invoice.status)}
                <span className="text-sm font-medium text-gray-700">
                  {invoiceStatusLabel(invoice.status)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2">Amount Due</div>
              <div className="text-3xl font-semibold text-gray-900">
                {invoice.amount} {asset}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {isOpen ? expiryLabel(invoice.expiryAt) : "Invoice closed"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Description</div>
              <div className="text-sm text-gray-800 leading-relaxed">
                {invoice.description}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Payment Asset</div>
              <div className="text-sm font-semibold text-gray-900">{asset}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Payment Destination</div>
              {paymentDestination ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500 mb-1">{paymentDestination.label}</div>
                  <div className="break-all text-sm font-mono text-gray-900">
                    {paymentDestination.destination}
                  </div>
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void copyValue(paymentDestination.destination)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Address
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-red-600">
                  No payment destination configured for this invoice asset yet.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-medium text-blue-900 mb-2">How payment works</div>
              <div className="text-sm text-blue-800 leading-relaxed">
                Send the exact invoice amount to the destination above using the specified asset.
                After payment is detected and verified, Glide will move the invoice into settlement flow.
              </div>
            </div>
          </div>

          <div className="col-span-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-5">
            <div>
              <div className="text-xs text-gray-500 mb-1">Merchant ID</div>
              <div className="text-sm font-semibold text-gray-900">{invoice.merchantId}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Invoice ID</div>
              <div className="text-sm font-semibold text-gray-900">{invoice.invoiceId}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Settlement Status</div>
              <div className="text-sm text-gray-700">
                {invoice.settlementId ? `Settlement #${invoice.settlementId}` : "Awaiting payment verification"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Current State</div>
              <div className="text-sm text-gray-700">{invoiceStatusLabel(invoice.status)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Asset</div>
              <div className="text-sm text-gray-700">
                {invoice.asset === ASSET.SBTC ? "sBTC" : "USDCx"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}