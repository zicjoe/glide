import { createId } from "@/lib/format/id";
import type { StoredInvoice } from "@/lib/invoice-storage";
import type { StoredPayment, StoredSettlementRecord } from "@/lib/payment-storage";
import type { StoredReconciliationRecord } from "@/lib/ops-storage";

function toMinorUnits(value: string): number {
  return Math.round(Number(value) * 100);
}

function fromMinorUnits(value: number): string {
  return (value / 100).toFixed(2);
}

export function createReconciliationRecord(params: {
  invoice: StoredInvoice;
  payment: StoredPayment;
  settlement: StoredSettlementRecord;
}): StoredReconciliationRecord {
  const { invoice, payment, settlement } = params;

  const expectedMinor = toMinorUnits(invoice.amount);
  const actualMinor = toMinorUnits(settlement.netAmount);
  const feeMinor = Math.max(
    toMinorUnits(settlement.grossAmount) - actualMinor,
    0,
  );
  const varianceMinor = actualMinor - expectedMinor;

  const status: StoredReconciliationRecord["status"] =
    varianceMinor === 0 ? "MATCHED" : "MISMATCHED";

  return {
    reconciliationId: createId("recon"),
    merchantId: invoice.merchantId,
    invoiceId: invoice.invoiceId,
    paymentId: payment.paymentId,
    settlementId: settlement.settlementId,
    expectedAmount: fromMinorUnits(expectedMinor),
    actualAmount: fromMinorUnits(actualMinor),
    feeAmount: fromMinorUnits(feeMinor),
    variance: fromMinorUnits(varianceMinor),
    status,
    createdAt: new Date().toISOString(),
  };
}