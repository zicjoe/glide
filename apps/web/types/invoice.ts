import type { SettlementAsset } from "./merchant";

export interface Invoice {
  invoiceId: string;
  merchantId: string;
  reference: string;
  amount: string;
  settlementAsset: SettlementAsset;
  description: string;
  expiresAt: string;
  status: "DRAFT" | "OPEN" | "PAID" | "EXPIRED" | "CANCELLED";
  createdAt: string;
}