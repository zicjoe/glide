"use client";

import {
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wallet,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCheckoutInvoice } from "@/hooks/use-checkout-invoice";
import {
  ASSET,
  INVOICE_STATUS,
  SETTLEMENT_STATUS,
  invoiceStatusLabel,
  assetLabel,
} from "@/lib/contracts/constants";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";

function expiryLabel(expiryAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = expiryAt - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / 3600);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} left`;
  return `${hours} hour${hours !== 1 ? "s" : ""} left`;
}

function invoiceStatusIcon(status: number) {
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

function settlementLabel(status: number) {
  switch (status) {
    case SETTLEMENT_STATUS.PENDING:
      return "Pending";
    case SETTLEMENT_STATUS.PROCESSING:
      return "Processing";
    case SETTLEMENT_STATUS.COMPLETED:
      return "Completed";
    case SETTLEMENT_STATUS.FAILED:
      return "Failed";
    default:
      return "Unknown";
  }
}

function settlementTone(status: number) {
  switch (status) {
    case SETTLEMENT_STATUS.COMPLETED:
      return "bg-green-50 border-green-200 text-green-800";
    case SETTLEMENT_STATUS.FAILED:
      return "bg-red-50 border-red-200 text-red-800";
    case SETTLEMENT_STATUS.PROCESSING:
      return "bg-blue-50 border-blue-200 text-blue-800";
    default:
      return "bg-amber-50 border-amber-200 text-amber-800";
  }
}

function paymentStatusLabel(status: string | null) {
  switch (status) {
    case "awaiting_payment":
      return "Awaiting payment";
    case "payment_detected":
      return "Payment detected";
    case "payment_confirmed":
      return "Payment confirmed";
    case "settlement_pending":
      return "Settlement pending";
    case "settled":
      return "Settled";
    case "expired":
      return "Expired";
    default:
      return "Awaiting payment";
  }
}

function paymentStatusTone(status: string | null) {
  switch (status) {
    case "settled":
      return "bg-green-50 border-green-200 text-green-800";
    case "payment_confirmed":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "payment_detected":
      return "bg-sky-50 border-sky-200 text-sky-800";
    case "expired":
      return "bg-red-50 border-red-200 text-red-800";
    case "settlement_pending":
      return "bg-amber-50 border-amber-200 text-amber-800";
    default:
      return "bg-amber-50 border-amber-200 text-amber-800";
  }
}

function paymentStatusDescription(status: string | null) {
  switch (status) {
    case "awaiting_payment":
      return "Customer payment has not been verified yet.";
    case "payment_detected":
      return "A matching payment has been observed and is awaiting confirmation.";
    case "payment_confirmed":
      return "Payment has been confirmed and is ready for settlement flow.";
    case "settlement_pending":
      return "Payment is confirmed and waiting for settlement execution.";
    case "settled":
      return "Payment has been fully processed through settlement.";
    case "expired":
      return "This invoice expired before a valid payment was confirmed.";
    default:
      return "Customer payment has not been verified yet.";
  }
}

export default function CheckoutInvoicePage() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference;

  const {
    invoice,
    paymentDestination,
    paymentStatus,
    loading,
    error,
    refetch,
  } = useCheckoutInvoice(reference);

  const { merchantId } = useMerchantSession();
  const {
    settlements,
    loading: settlementsLoading,
    refetch: refetchSettlements,
  } = useIndexedSettlements(merchantId);

  async function refreshStatus() {
    await refetch();
    await refetchSettlements();
  }

  async function copyValue(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    alert(`${label} copied`);
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
          <div className="text-lg font-semibold text-red-700 mb-2">
            Invoice unavailable
          </div>
          <div className="text-sm text-red-600">
            {error || "Invoice not found"}
          </div>
        </div>
      </div>
    );
  }

  const isOpen = invoice.status === INVOICE_STATUS.OPEN;
  const asset = assetLabel(invoice.asset);

  const linkedSettlement =
    invoice.settlementId != null
      ? settlements.find((item) => item.settlementId === invoice.settlementId) ??
        null
      : settlements.find((item) => item.invoiceId === invoice.invoiceId) ?? null;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">Invoice Reference</div>
              <div className="text-2xl font-semibold text-gray-900">
                {invoice.reference}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                {invoiceStatusIcon(invoice.status)}
                <span className="text-sm font-medium text-gray-700">
                  {invoiceStatusLabel(invoice.status)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2">Amount Due</div>
              <div className="text-4xl font-semibold text-gray-900">
                {invoice.amount} {asset}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {isOpen ? expiryLabel(invoice.expiryAt) : "Invoice closed"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-5 w-5 text-blue-700" />
                <div className="text-base font-semibold text-blue-900">
                  Send payment
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="text-xs text-blue-700 mb-1">Asset</div>
                  <div className="text-lg font-semibold text-blue-950">{asset}</div>
                </div>

                <div>
                  <div className="text-xs text-blue-700 mb-1">Exact amount</div>
                  <div className="rounded-xl border border-blue-200 bg-white p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                      {invoice.amount} {asset}
                    </div>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          void copyValue(`${invoice.amount}`, "Amount")
                        }
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Amount
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-blue-700 mb-1">
                    Merchant payment address
                  </div>
                  {paymentDestination ? (
                    <div className="rounded-xl border border-blue-200 bg-white p-4">
                      <div className="text-xs text-gray-500 mb-1">
                        {paymentDestination.label}
                      </div>
                      <div className="break-all text-sm font-mono text-gray-900">
                        {paymentDestination.destination}
                      </div>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            void copyValue(
                              paymentDestination.destination,
                              "Address",
                            )
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Address
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">
                      No payment destination configured for this asset yet.
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-blue-200 bg-white p-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Payment instructions
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    Send the exact amount shown above to the merchant payment
                    address using <span className="font-medium">{asset}</span>.
                    After payment is detected and verified, Glide will move this
                    invoice into settlement flow.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </div>
                <div className="text-sm text-gray-800 leading-relaxed">
                  {invoice.description}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Payment Asset
                </div>
                <div className="text-sm font-semibold text-gray-900">{asset}</div>
              </div>
            </div>
          </div>

          <div className="col-span-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-5">
            <div>
              <div className="text-xs text-gray-500 mb-1">Merchant ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {invoice.merchantId}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Invoice ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {invoice.invoiceId}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">Payment Status</div>
              <div
                className={`rounded-xl border p-4 ${paymentStatusTone(
                  paymentStatus?.paymentStatus ?? null,
                )}`}
              >
                <div className="text-sm font-medium">
                  {paymentStatusLabel(paymentStatus?.paymentStatus ?? null)}
                </div>
                <div className="text-xs mt-1">
                  {paymentStatusDescription(paymentStatus?.paymentStatus ?? null)}
                </div>

                {paymentStatus?.observedTxid ? (
                  <div className="mt-3 text-xs break-all">
                    TX: {paymentStatus.observedTxid}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">Settlement Status</div>
              {settlementsLoading ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking settlement...
                </div>
              ) : linkedSettlement ? (
                <div
                  className={`rounded-xl border p-4 ${settlementTone(
                    linkedSettlement.status,
                  )}`}
                >
                  <div className="text-sm font-medium">
                    Settlement #{linkedSettlement.settlementId}
                  </div>
                  <div className="text-xs mt-1">
                    {settlementLabel(linkedSettlement.status)}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  Awaiting payment verification
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Current State</div>
              <div className="text-sm text-gray-700">
                {invoiceStatusLabel(invoice.status)}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Asset</div>
              <div className="text-sm text-gray-700">
                {invoice.asset === ASSET.SBTC ? "sBTC" : "USDCx"}
              </div>
            </div>

            <Button type="button" variant="outline" onClick={() => void refreshStatus()}>
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}