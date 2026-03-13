import { createId } from "@/lib/format/id";
import type { StoredInvoice } from "@/lib/invoice-storage";
import type {
  StoredBucketAllocation,
  StoredPayment,
  StoredSettlementRecord,
} from "@/lib/payment-storage";
import type { TreasurySettingsSnapshot } from "@/lib/treasury-storage";

export interface SettlementExecutionResult {
  payment: StoredPayment;
  settlement: StoredSettlementRecord;
  allocations: StoredBucketAllocation[];
}

function toMinorUnits(value: string): number {
  return Math.round(Number(value) * 100);
}

function fromMinorUnits(value: number): string {
  return (value / 100).toFixed(2);
}

export function executeSettlement(params: {
  invoice: StoredInvoice;
  treasury: TreasurySettingsSnapshot;
}): SettlementExecutionResult {
  const { invoice, treasury } = params;
  const now = new Date().toISOString();

  const grossMinor = toMinorUnits(invoice.amount);
  const netMinor = grossMinor;

  const payment: StoredPayment = {
    paymentId: createId("pay"),
    invoiceId: invoice.invoiceId,
    payer: "demo_customer",
    inputAsset: invoice.settlementAsset,
    inputAmount: invoice.amount,
    settledAsset: invoice.settlementAsset,
    settledAmount: invoice.amount,
    status: "CONFIRMED",
    txId: createId("tx"),
    createdAt: now,
  };

  const settlement: StoredSettlementRecord = {
    settlementId: createId("settle"),
    paymentId: payment.paymentId,
    merchantId: invoice.merchantId,
    asset: invoice.settlementAsset,
    grossAmount: fromMinorUnits(grossMinor),
    netAmount: fromMinorUnits(netMinor),
    status: "COMPLETED",
    processedAt: now,
  };

  const activeBuckets = treasury.buckets.filter((bucket) => bucket.enabled);

  const allocations: StoredBucketAllocation[] = activeBuckets.map((bucket, index) => {
    const isLast = index === activeBuckets.length - 1;

    const allocatedMinor = isLast
      ? netMinor -
        activeBuckets
          .slice(0, index)
          .reduce(
            (sum, current) => sum + Math.round((netMinor * current.allocationBps) / 10000),
            0,
          )
      : Math.round((netMinor * bucket.allocationBps) / 10000);

    return {
      allocationId: createId("alloc"),
      settlementId: settlement.settlementId,
      bucketId: bucket.bucketId,
      amount: fromMinorUnits(Math.max(allocatedMinor, 0)),
      idleMode: bucket.idleMode,
      deploymentStatus: bucket.idleMode === "EARN" ? "QUEUED" : "NONE",
      createdAt: now,
    };
  });

  return {
    payment,
    settlement,
    allocations,
  };
}