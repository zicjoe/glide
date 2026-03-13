"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { createEvent } from "@/lib/events";
import { formatDateTime } from "@/lib/format/date";
import { createId } from "@/lib/format/id";
import { loadInvoices } from "@/lib/invoice-storage";
import { loadPayments } from "@/lib/payment-storage";
import {
  loadNotificationEvents,
  loadRefundRequests,
  saveNotificationEvents,
  saveRefundRequests,
  type StoredRefundRequest,
} from "@/lib/ops-storage";

export function RefundsClient() {
  const [refunds, setRefunds] = useState<StoredRefundRequest[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const payments = useMemo(() => loadPayments(), []);
  const invoices = useMemo(() => loadInvoices(), []);

  useEffect(() => {
    setRefunds(loadRefundRequests());
  }, []);

  const paymentOptions = payments.filter((payment) => payment.status === "CONFIRMED");

  function handleCreateRefund() {
    const payment = payments.find((item) => item.paymentId === selectedPaymentId);

    if (!payment) {
      setErrors(["Choose a valid payment."]);
      setMessage("");
      return;
    }

    if (!reason.trim()) {
      setErrors(["Refund reason is required."]);
      setMessage("");
      return;
    }

    if (!destination.trim()) {
      setErrors(["Refund destination is required."]);
      setMessage("");
      return;
    }

    const invoice = invoices.find((item) => item.invoiceId === payment.invoiceId);

    if (!invoice) {
      setErrors(["Original invoice could not be found."]);
      setMessage("");
      return;
    }

    const refund: StoredRefundRequest = {
      refundId: createId("refund"),
      paymentId: payment.paymentId,
      invoiceId: payment.invoiceId,
      merchantId: invoice.merchantId,
      reason: reason.trim(),
      amount: payment.settledAmount,
      asset: payment.settledAsset,
      destination: destination.trim(),
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
    };

    const nextRefunds = [refund, ...loadRefundRequests()];
    saveRefundRequests(nextRefunds);
    setRefunds(nextRefunds);

    const nextEvents = [
      createEvent({
        merchantId: refund.merchantId,
        type: "REFUND_REQUESTED",
        payload: `Refund ${refund.refundId} was requested for payment ${refund.paymentId}.`,
      }),
      ...loadNotificationEvents(),
    ];

    saveNotificationEvents(nextEvents);

    setSelectedPaymentId("");
    setReason("");
    setDestination("");
    setErrors([]);
    setMessage("Refund request created.");
  }

  return (
    <div className="space-y-6 p-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Create refund request"
          description="Request a refund against a confirmed payment."
        >
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">Payment</span>
              <select
                value={selectedPaymentId}
                onChange={(event) => setSelectedPaymentId(event.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              >
                <option value="">Choose payment</option>
                {paymentOptions.map((payment) => (
                  <option key={payment.paymentId} value={payment.paymentId}>
                    {payment.paymentId} • {payment.settledAmount} {payment.settledAsset}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">Reason</span>
              <textarea
                rows={4}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Customer requested reversal"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-800">
                Refund destination
              </span>
              <input
                type="text"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="SP..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950"
              />
            </label>

            <button
              type="button"
              onClick={handleCreateRefund}
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create refund request
            </button>

            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          </div>
        </SectionCard>

        <SectionCard
          title="Refund queue"
          description="Track requested refunds and their current status."
        >
          {refunds.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
              No refund requests yet.
            </div>
          ) : (
            <div className="space-y-4">
              {refunds.map((refund) => (
                <div
                  key={refund.refundId}
                  className="rounded-xl border border-zinc-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">
                        Refund {refund.refundId.slice(-6)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Payment: {refund.paymentId}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Created: {formatDateTime(refund.createdAt)}
                      </p>
                      <p className="mt-3 text-sm text-zinc-600">{refund.reason}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-950">
                        {refund.amount} {refund.asset}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">{refund.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {errors.length > 0 ? (
        <SectionCard
          title="Validation issues"
          description="Resolve these before creating a refund request."
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