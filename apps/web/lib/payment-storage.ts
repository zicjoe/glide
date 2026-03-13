const PAYMENT_STORAGE_KEY = "glide:payments";
const SETTLEMENT_STORAGE_KEY = "glide:settlements";
const ALLOCATION_STORAGE_KEY = "glide:allocations";

export interface StoredPayment {
  paymentId: string;
  invoiceId: string;
  payer: string;
  inputAsset: "sBTC" | "USDCx";
  inputAmount: string;
  settledAsset: "sBTC" | "USDCx";
  settledAmount: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  txId: string;
  createdAt: string;
}

export interface StoredSettlementRecord {
  settlementId: string;
  paymentId: string;
  merchantId: string;
  asset: "sBTC" | "USDCx";
  grossAmount: string;
  netAmount: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  processedAt: string;
}

export interface StoredBucketAllocation {
  allocationId: string;
  settlementId: string;
  bucketId: string;
  amount: string;
  idleMode: "HOLD" | "EARN";
  deploymentStatus: "NONE" | "QUEUED" | "DEPLOYED";
  createdAt: string;
}

function loadJson<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function saveJson<T>(key: string, value: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadPayments(): StoredPayment[] {
  return loadJson<StoredPayment>(PAYMENT_STORAGE_KEY);
}

export function savePayments(payments: StoredPayment[]) {
  saveJson(PAYMENT_STORAGE_KEY, payments);
}

export function loadSettlements(): StoredSettlementRecord[] {
  return loadJson<StoredSettlementRecord>(SETTLEMENT_STORAGE_KEY);
}

export function saveSettlements(settlements: StoredSettlementRecord[]) {
  saveJson(SETTLEMENT_STORAGE_KEY, settlements);
}

export function loadAllocations(): StoredBucketAllocation[] {
  return loadJson<StoredBucketAllocation>(ALLOCATION_STORAGE_KEY);
}

export function saveAllocations(allocations: StoredBucketAllocation[]) {
  saveJson(ALLOCATION_STORAGE_KEY, allocations);
}