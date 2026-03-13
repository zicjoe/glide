const RECONCILIATION_STORAGE_KEY = "glide:reconciliation";

export interface StoredReconciliationRecord {
  reconciliationId: string;
  merchantId: string;
  invoiceId: string;
  paymentId: string;
  settlementId: string;
  expectedAmount: string;
  actualAmount: string;
  feeAmount: string;
  variance: string;
  status: "MATCHED" | "MISMATCHED" | "REVIEW";
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

export function loadReconciliationRecords(): StoredReconciliationRecord[] {
  return loadJson<StoredReconciliationRecord>(RECONCILIATION_STORAGE_KEY);
}

export function saveReconciliationRecords(
  records: StoredReconciliationRecord[],
) {
  saveJson(RECONCILIATION_STORAGE_KEY, records);
}