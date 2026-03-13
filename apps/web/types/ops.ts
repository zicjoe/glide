import type { SettlementAsset } from "./merchant";

export interface RefundRequest {
  refundId: string;
  paymentId: string;
  invoiceId: string;
  merchantId: string;
  reason: string;
  amount: string;
  asset: SettlementAsset;
  destination: string;
  status: "REQUESTED" | "APPROVED" | "SENT" | "FAILED";
  createdAt: string;
}

export interface ReconciliationRecord {
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

export interface FeePolicy {
  feePolicyId: string;
  merchantId: string;
  networkFeeMode: "MERCHANT_PAYS" | "CUSTOMER_PAYS" | "SPLIT";
  routingFeeMode: "MERCHANT_PAYS" | "CUSTOMER_PAYS" | "SPLIT";
  refundFeeMode: "MERCHANT_PAYS" | "CUSTOMER_PAYS" | "SPLIT";
  active: boolean;
}

export interface NotificationEvent {
  eventId: string;
  merchantId: string;
  type: string;
  payload: string;
  deliveryStatus: "PENDING" | "DELIVERED" | "FAILED";
  createdAt: string;
}