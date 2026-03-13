import type { SettlementAsset } from "./merchant";

export interface Payment {
  paymentId: string;
  invoiceId: string;
  payer: string;
  inputAsset: SettlementAsset;
  inputAmount: string;
  settledAsset: SettlementAsset;
  settledAmount: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  txId: string;
  createdAt: string;
}

export interface SettlementAttempt {
  attemptId: string;
  paymentId: string;
  quoteId: string;
  routePlanId: string;
  attemptNumber: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  failureReason: string | null;
  createdAt: string;
}