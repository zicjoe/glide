const RECONCILIATION_STORAGE_KEY = "glide:reconciliation";
const REFUND_STORAGE_KEY = "glide:refunds";
const EVENT_STORAGE_KEY = "glide:events";

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

export interface StoredRefundRequest {
  refundId: string;
  paymentId: string;
  invoiceId: string;
  merchantId: string;
  reason: string;
  amount: string;
  asset: "sBTC" | "USDCx";
  destination: string;
  status: "REQUESTED" | "APPROVED" | "SENT" | "FAILED";
  createdAt: string;
}

export interface StoredNotificationEvent {
  eventId: string;
  merchantId: string;
  type:
    | "INVOICE_CREATED"
    | "PAYMENT_CONFIRMED"
    | "SETTLEMENT_RECORDED"
    | "REFUND_REQUESTED";
  payload: string;
  deliveryStatus: "PENDING" | "DELIVERED" | "FAILED";
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

export function loadRefundRequests(): StoredRefundRequest[] {
  return loadJson<StoredRefundRequest>(REFUND_STORAGE_KEY);
}

export function saveRefundRequests(refunds: StoredRefundRequest[]) {
  saveJson(REFUND_STORAGE_KEY, refunds);
}

export function loadNotificationEvents(): StoredNotificationEvent[] {
  return loadJson<StoredNotificationEvent>(EVENT_STORAGE_KEY);
}

export function saveNotificationEvents(events: StoredNotificationEvent[]) {
  saveJson(EVENT_STORAGE_KEY, events);
}