import type { IdleMode } from "./treasury";
import type { SettlementAsset } from "./merchant";

export interface SettlementRecord {
  settlementId: string;
  paymentId: string;
  merchantId: string;
  asset: SettlementAsset;
  grossAmount: string;
  netAmount: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  processedAt: string;
}

export interface BucketAllocation {
  allocationId: string;
  settlementId: string;
  bucketId: string;
  amount: string;
  idleMode: IdleMode;
  deploymentStatus: "NONE" | "QUEUED" | "DEPLOYED";
  createdAt: string;
}