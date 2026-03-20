"use client";

import { useMemo, useState } from "react";
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
  INVOICE_STATUS,
  SETTLEMENT_STATUS,
  invoiceStatusLabel,
  formatAssetAmount,
  formatRailAmount,
} from "@/lib/contracts/constants";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { confirmCheckoutPayment } from "@/lib/api/indexer";

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

function railTone(isSelected: boolean) {
  return isSelected
    ? "border-blue-600 bg-white shadow-sm"
    : "border-blue-200 bg-blue-50 hover:bg-white";
}

export default function CheckoutInvoicePage() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference;

  const {
    invoice,
    paymentStatus,
    checkout,
    selectedRail,
    selectedRailKey,
    setSelectedRailKey,
    loading,
    error,
    refetch,
  } = useCheckoutInvoice(reference);

  const {
    settlements,
    loading: settlementsLoading,
    refetch: refetchSettlements,
  } = useIndexedSettlements(invoice?.merchantId ?? null);

  const [txid, setTxid] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  async function refreshStatus() {
    await refetch();
    await refetchSettlements();
  }

  async function copyValue(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    alert(`${label} copied`);
  }

  async function onConfirmPaid() {
    if (!invoice || !selectedRail) {
      setConfirmMessage("Invoice or payment rail not ready.");
      return;
    }

    if (!txid.trim()) {
      setConfirmMessage("Please paste the transaction ID.");
      return;
    }

    if (!selectedRail.address) {
      setConfirmMessage("Selected rail does not have a receiving address.");
      return;
    }

    try {
      setConfirming(true);
      setConfirmMessage("Confirming payment and distributing to treasury...");

      await confirmCheckoutPayment({
        reference: invoice.reference,
        merchantId: invoice.merchantId,
        rail: selectedRail.rail,
        assetLabel: selectedRail.assetLabel,
        amount: Number(selectedRail.amount),
        txid: txid.trim(),
        receiveAddress: selectedRail.address,
      });

      setConfirmMessage("Payment confirmed. Merchant balances updated.");
      setTxid("");
      await refreshStatus();
    } catch (err) {
      setConfirmMessage(
        err instanceof Error ? err.message : "Failed to confirm payment",
      );
    } finally {
      setConfirming(false);
    }
  }

  const linkedSettlement = useMemo(() => {
    if (!invoice) return null;

    return settlements.find((item) => item.invoiceId === (invoice.invoiceId ?? 0)) ?? null;
  }, [invoice, settlements]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-sm text-gray-600">Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (error || !invoice || !checkout) {
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
  const paymentAddress = selectedRail?.address ?? null;
  const paymentAddressLabel = selectedRail?.addressLabel ?? "Payment address";
  const displayAmount = selectedRail
    ? formatRailAmount(Number(selectedRail.amount), selectedRail.assetLabel)
    : "0";

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
              <div className="text-sm text-gray-500 mb-2">Merchant settles in</div>
              <div className="text-4xl font-semibold text-gray-900">
                {checkout.settlementAssetLabel}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {formatAssetAmount(checkout.settlementAmount, checkout.settlementAsset)} {checkout.settlementAssetLabel}
              </div>
              <div className="mt-1 text-sm text-gray-500">
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
                  Choose payment method
                </div>
              </div>

              <div className="mb-4 text-sm text-blue-900">
                All payment options are quoted at the same value.
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {checkout.rails.map((rail) => {
                  const isSelected = selectedRailKey === rail.rail;
                  const railAmount = formatRailAmount(Number(rail.amount), rail.assetLabel);

                  return (
                    <button
                      key={rail.rail}
                      type="button"
                      onClick={() => setSelectedRailKey(rail.rail)}
                      className={`rounded-xl border p-4 text-left transition-all ${railTone(isSelected)}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {rail.label}
                        </div>
                        <div className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600">
                          {rail.customerStatusLabel}
                        </div>
                      </div>

                      <div className="mt-3 text-lg font-semibold text-gray-900">
                        {railAmount} {rail.assetLabel}
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        {rail.addressLabel}: {rail.address ?? "Not available yet"}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-5">
                <div>
                  <div className="text-xs text-blue-700 mb-1">Selected asset</div>
                  <div className="text-lg font-semibold text-blue-950">
                    {selectedRail?.assetLabel ?? "Not selected"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-blue-700 mb-1">Exact amount</div>
                  <div className="rounded-xl border border-blue-200 bg-white p-4">
                    <div className="text-2xl font-semibold text-gray-900">
                      {displayAmount} {selectedRail?.assetLabel ?? ""}
                    </div>
                    {selectedRail ? (
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            void copyValue(`${displayAmount}`, "Amount")
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Amount
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-blue-700 mb-1">
                    {paymentAddressLabel}
                  </div>
                  {paymentAddress ? (
                    <div className="rounded-xl border border-blue-200 bg-white p-4">
                      <div className="break-all text-sm font-mono text-gray-900">
                        {paymentAddress}
                      </div>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => void copyValue(paymentAddress, "Address")}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Address
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      This payment rail is not wired to a receiving address yet.
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-blue-200 bg-white p-4 space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Payment instructions
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {selectedRail?.visibleMessage ??
                        "Choose a payment rail to continue."}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Paste transaction ID
                    </div>
                    <input
                      value={txid}
                      onChange={(e) => setTxid(e.target.value)}
                      placeholder="Enter transaction hash"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Demo/test flow: after sending payment, paste txid and confirm.
                    </div>
                  </div>

                  {confirmMessage ? (
                    <div className="text-sm text-gray-700">{confirmMessage}</div>
                  ) : null}

                  <Button
                    type="button"
                    onClick={() => void onConfirmPaid()}
                    disabled={confirming || !selectedRail || !txid.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {confirming ? "Confirming..." : "I’ve Paid"}
                  </Button>
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
                  Settlement currency
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatAssetAmount(checkout.settlementAmount, checkout.settlementAsset)} {checkout.settlementAssetLabel}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Quote source
                </div>
                <div className="text-sm text-gray-700">
                  Static market quote
                </div>
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
                {invoice.invoiceId ?? "Pending index"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Selected rail</div>
              <div className="text-sm font-semibold text-gray-900">
                {selectedRail?.label ?? "Not selected"}
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
              <div className="text-xs text-gray-500 mb-1">Settle to</div>
              <div className="text-sm text-gray-700">
                {formatAssetAmount(checkout.settlementAmount, checkout.settlementAsset)} {checkout.settlementAssetLabel}
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