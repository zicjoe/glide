export type SettlementAsset = "sBTC" | "USDCx";

export interface Merchant {
  merchantId: string;
  owner: string;
  businessName: string;
  defaultSettlementAsset: SettlementAsset;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}