import type { SettlementAsset } from "./merchant";

export type IdleMode = "HOLD" | "EARN";

export interface TreasuryPolicy {
  policyId: string;
  merchantId: string;
  settlementAsset: SettlementAsset;
  autoSplitEnabled: boolean;
  yieldEnabled: boolean;
  yieldThreshold: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TreasuryBucket {
  bucketId: string;
  policyId: string;
  name: string;
  allocationBps: number;
  destinationId: string;
  idleMode: IdleMode;
  enabled: boolean;
}

export interface PayoutDestination {
  destinationId: string;
  merchantId: string;
  label: string;
  asset: SettlementAsset;
  address: string;
  type: "WALLET" | "OPS" | "RESERVE" | "TREASURY" | "SUPPLIER";
  enabled: boolean;
  createdAt: string;
}