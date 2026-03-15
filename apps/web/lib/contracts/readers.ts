import { CONTRACT_IDS } from "./config";
import type {
  Invoice,
  Merchant,
  PayoutDestination,
  Settlement,
  SettlementAllocation,
  Strategy,
  TreasuryBucket,
  TreasuryPolicy,
  VaultBalance,
  YieldPosition,
  YieldQueueItem,
} from "./types";
import {
  getField,
  getOptionalField,
  normalizeResponse,
  toBoolean,
  toNumber,
  toStringValue,
  unwrapSome,
} from "./clarity";

type ContractCallFn = (args: {
  contractId: string;
  functionName: string;
  functionArgs?: unknown[];
}) => Promise<unknown>;

export type GlideReadClient = {
  callReadOnly: ContractCallFn;
};

function mapMerchant(merchantId: number, value: unknown): Merchant {
  return {
    merchantId,
    owner: toStringValue(getField(value, "owner")),
    active: toBoolean(getField(value, "active")),
    createdAt: toNumber(getField(value, "created-at")),
  };
}

function mapTreasuryPolicy(merchantId: number, value: unknown): TreasuryPolicy {
  return {
    merchantId,
    settlementAsset: toNumber(getField(value, "settlement-asset")),
    autoSplit: toBoolean(getField(value, "auto-split")),
    idleYield: toBoolean(getField(value, "idle-yield")),
    yieldThreshold: toNumber(getField(value, "yield-threshold")),
    updatedAt: toNumber(getField(value, "updated-at")),
  };
}

function mapPayoutDestination(
  merchantId: number,
  destinationId: number,
  value: unknown,
): PayoutDestination {
  return {
    merchantId,
    destinationId,
    label: toStringValue(getField(value, "label")),
    asset: toNumber(getField(value, "asset")),
    destination: toStringValue(getField(value, "destination")),
    destinationType: toNumber(getField(value, "destination-type")),
    enabled: toBoolean(getField(value, "enabled")),
    createdAt: toNumber(getField(value, "created-at")),
  };
}

function mapTreasuryBucket(
  merchantId: number,
  bucketId: number,
  value: unknown,
): TreasuryBucket {
  return {
    merchantId,
    bucketId,
    name: toStringValue(getField(value, "name")),
    allocationBps: toNumber(getField(value, "allocation-bps")),
    destinationId: toNumber(getField(value, "destination-id")),
    idleMode: toNumber(getField(value, "idle-mode")),
    enabled: toBoolean(getField(value, "enabled")),
    createdAt: toNumber(getField(value, "created-at")),
  };
}

function mapInvoice(invoiceId: number, value: unknown): Invoice {
  return {
    invoiceId,
    merchantId: toNumber(getField(value, "merchant-id")),
    reference: toStringValue(getField(value, "reference")),
    asset: toNumber(getField(value, "asset")),
    amount: toNumber(getField(value, "amount")),
    description: toStringValue(getField(value, "description")),
    expiryAt: toNumber(getField(value, "expiry-at")),
    status: toNumber(getField(value, "status")),
    createdAt: toNumber(getField(value, "created-at")),
    paidAt: toNumber(getField(value, "paid-at")),
    settlementId: unwrapSome<number>(getField(value, "settlement-id")),
  };
}

function mapSettlement(settlementId: number, value: unknown): Settlement {
  return {
    settlementId,
    merchantId: toNumber(getField(value, "merchant-id")),
    invoiceId: toNumber(getField(value, "invoice-id")),
    asset: toNumber(getField(value, "asset")),
    grossAmount: toNumber(getField(value, "gross-amount")),
    feeAmount: toNumber(getField(value, "fee-amount")),
    netAmount: toNumber(getField(value, "net-amount")),
    status: toNumber(getField(value, "status")),
    createdAt: toNumber(getField(value, "created-at")),
    completedAt: toNumber(getField(value, "completed-at")),
    executor: toStringValue(getField(value, "executor")),
  };
}

function mapSettlementAllocation(
  settlementId: number,
  bucketId: number,
  value: unknown,
): SettlementAllocation {
  return {
    settlementId,
    bucketId,
    allocationBps: toNumber(getField(value, "allocation-bps")),
    amount: toNumber(getField(value, "amount")),
    destinationId: toNumber(getField(value, "destination-id")),
  };
}

function mapVaultBalance(
  merchantId: number,
  bucketId: number,
  asset: number,
  value: unknown,
): VaultBalance {
  return {
    merchantId,
    bucketId,
    asset,
    available: toNumber(getField(value, "available")),
    queued: toNumber(getField(value, "queued")),
    deployed: toNumber(getField(value, "deployed")),
    updatedAt: toNumber(getField(value, "updated-at")),
  };
}

function mapStrategy(strategyId: number, value: unknown): Strategy {
  return {
    strategyId,
    name: toStringValue(getField(value, "name")),
    asset: toNumber(getField(value, "asset")),
    riskLevel: toNumber(getField(value, "risk-level")),
    active: toBoolean(getField(value, "active")),
    createdAt: toNumber(getField(value, "created-at")),
    updatedAt: toNumber(getField(value, "updated-at")),
  };
}

function mapYieldQueueItem(queueId: number, value: unknown): YieldQueueItem {
  return {
    queueId,
    merchantId: toNumber(getField(value, "merchant-id")),
    bucketId: toNumber(getField(value, "bucket-id")),
    asset: toNumber(getField(value, "asset")),
    amount: toNumber(getField(value, "amount")),
    strategyId: toNumber(getField(value, "strategy-id")),
    status: toNumber(getField(value, "status")),
    createdAt: toNumber(getField(value, "created-at")),
    executor: toStringValue(getField(value, "executor")),
  };
}

function mapYieldPosition(positionId: number, value: unknown): YieldPosition {
  return {
    positionId,
    merchantId: toNumber(getField(value, "merchant-id")),
    bucketId: toNumber(getField(value, "bucket-id")),
    asset: toNumber(getField(value, "asset")),
    amount: toNumber(getField(value, "amount")),
    strategyId: toNumber(getField(value, "strategy-id")),
    status: toNumber(getField(value, "status")),
    queuedId: toNumber(getField(value, "queued-id")),
    deployedAt: toNumber(getField(value, "deployed-at")),
    withdrawnAt: toNumber(getField(value, "withdrawn-at")),
    executor: toStringValue(getField(value, "executor")),
  };
}

export async function readMerchant(
  client: GlideReadClient,
  merchantId: number,
): Promise<Merchant | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideCore(),
    functionName: "get-merchant",
    functionArgs: [merchantId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapMerchant(merchantId, value) : null;
}

export async function readMerchantIdByOwner(
  client: GlideReadClient,
  owner: string,
): Promise<number | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideCore(),
    functionName: "get-merchant-id-by-owner",
    functionArgs: [owner],
  });

  const value = unwrapSome(normalizeResponse(response));
  if (!value) return null;

  return toNumber(getField(value, "merchant-id"));
}

export async function readTreasuryPolicy(
  client: GlideReadClient,
  merchantId: number,
): Promise<TreasuryPolicy | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideTreasury(),
    functionName: "get-policy",
    functionArgs: [merchantId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapTreasuryPolicy(merchantId, value) : null;
}

export async function readTreasuryDestination(
  client: GlideReadClient,
  merchantId: number,
  destinationId: number,
): Promise<PayoutDestination | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideTreasury(),
    functionName: "get-destination",
    functionArgs: [merchantId, destinationId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapPayoutDestination(merchantId, destinationId, value) : null;
}

export async function readTreasuryBucket(
  client: GlideReadClient,
  merchantId: number,
  bucketId: number,
): Promise<TreasuryBucket | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideTreasury(),
    functionName: "get-bucket",
    functionArgs: [merchantId, bucketId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapTreasuryBucket(merchantId, bucketId, value) : null;
}

export async function readTreasuryPolicyValid(
  client: GlideReadClient,
  merchantId: number,
): Promise<boolean> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideTreasury(),
    functionName: "is-policy-valid",
    functionArgs: [merchantId],
  });

  return toBoolean(normalizeResponse(response));
}

export async function readInvoice(
  client: GlideReadClient,
  invoiceId: number,
): Promise<Invoice | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideInvoices(),
    functionName: "get-invoice",
    functionArgs: [invoiceId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapInvoice(invoiceId, value) : null;
}

export async function readSettlement(
  client: GlideReadClient,
  settlementId: number,
): Promise<Settlement | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideSettlements(),
    functionName: "get-settlement",
    functionArgs: [settlementId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapSettlement(settlementId, value) : null;
}

export async function readSettlementAllocation(
  client: GlideReadClient,
  settlementId: number,
  bucketId: number,
): Promise<SettlementAllocation | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideSettlements(),
    functionName: "get-settlement-allocation",
    functionArgs: [settlementId, bucketId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value
    ? mapSettlementAllocation(settlementId, bucketId, value)
    : null;
}

export async function readVaultBalance(
  client: GlideReadClient,
  merchantId: number,
  bucketId: number,
  asset: number,
): Promise<VaultBalance | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideVault(),
    functionName: "get-balance",
    functionArgs: [merchantId, bucketId, asset],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapVaultBalance(merchantId, bucketId, asset, value) : null;
}

export async function readStrategy(
  client: GlideReadClient,
  strategyId: number,
): Promise<Strategy | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideStrategyRegistry(),
    functionName: "get-strategy",
    functionArgs: [strategyId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapStrategy(strategyId, value) : null;
}

export async function readYieldQueueItem(
  client: GlideReadClient,
  queueId: number,
): Promise<YieldQueueItem | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideYield(),
    functionName: "get-queue-item",
    functionArgs: [queueId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapYieldQueueItem(queueId, value) : null;
}

export async function readYieldPosition(
  client: GlideReadClient,
  positionId: number,
): Promise<YieldPosition | null> {
  const response = await client.callReadOnly({
    contractId: CONTRACT_IDS.glideYield(),
    functionName: "get-position",
    functionArgs: [positionId],
  });

  const value = unwrapSome(normalizeResponse(response));
  return value ? mapYieldPosition(positionId, value) : null;
}