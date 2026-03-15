import type {
    AssetId,
    DestinationTypeId,
    IdleModeId,
    InvoiceStatusId,
    RiskLevelId,
    SettlementStatusId,
    YieldStatusId,
  } from "./constants";
  
  export type Merchant = {
    merchantId: number;
    owner: string;
    active: boolean;
    createdAt: number;
  };
  
  export type TreasuryPolicy = {
    merchantId: number;
    settlementAsset: AssetId;
    autoSplit: boolean;
    idleYield: boolean;
    yieldThreshold: number;
    updatedAt: number;
  };
  
  export type PayoutDestination = {
    merchantId: number;
    destinationId: number;
    label: string;
    asset: AssetId;
    destination: string;
    destinationType: DestinationTypeId;
    enabled: boolean;
    createdAt: number;
  };
  
  export type TreasuryBucket = {
    merchantId: number;
    bucketId: number;
    name: string;
    allocationBps: number;
    destinationId: number;
    idleMode: IdleModeId;
    enabled: boolean;
    createdAt: number;
  };
  
  export type Invoice = {
    invoiceId: number;
    merchantId: number;
    reference: string;
    asset: AssetId;
    amount: number;
    description: string;
    expiryAt: number;
    status: InvoiceStatusId;
    createdAt: number;
    paidAt: number;
    settlementId: number | null;
  };
  
  export type Settlement = {
    settlementId: number;
    merchantId: number;
    invoiceId: number;
    asset: AssetId;
    grossAmount: number;
    feeAmount: number;
    netAmount: number;
    status: SettlementStatusId;
    createdAt: number;
    completedAt: number;
    executor: string;
  };
  
  export type SettlementAllocation = {
    settlementId: number;
    bucketId: number;
    allocationBps: number;
    amount: number;
    destinationId: number;
  };
  
  export type VaultBalance = {
    merchantId: number;
    bucketId: number;
    asset: AssetId;
    available: number;
    queued: number;
    deployed: number;
    updatedAt: number;
  };
  
  export type Strategy = {
    strategyId: number;
    name: string;
    asset: AssetId;
    riskLevel: RiskLevelId;
    active: boolean;
    createdAt: number;
    updatedAt: number;
  };
  
  export type YieldQueueItem = {
    queueId: number;
    merchantId: number;
    bucketId: number;
    asset: AssetId;
    amount: number;
    strategyId: number;
    status: YieldStatusId;
    createdAt: number;
    executor: string;
  };
  
  export type YieldPosition = {
    positionId: number;
    merchantId: number;
    bucketId: number;
    asset: AssetId;
    amount: number;
    strategyId: number;
    status: YieldStatusId;
    queuedId: number;
    deployedAt: number;
    withdrawnAt: number;
    executor: string;
  };