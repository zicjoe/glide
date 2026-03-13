import type { SettlementAsset } from "./merchant";

export interface Quote {
  quoteId: string;
  invoiceId: string;
  inputAsset: SettlementAsset;
  outputAsset: SettlementAsset;
  inputAmount: string;
  expectedOutputAmount: string;
  slippageBps: number;
  networkFeeEstimate: string;
  routePlanId: string;
  expiresAt: string;
  status: "ACTIVE" | "USED" | "EXPIRED" | "FAILED";
}

export interface RoutePlan {
  routePlanId: string;
  quoteId: string;
  provider: string;
  hops: number;
  estimatedFee: string;
  estimatedDuration: number;
  minOutputAmount: string;
  liquidityCheckStatus: "PASS" | "PARTIAL" | "FAIL";
}

export interface LiquidityCheck {
  checkId: string;
  quoteId: string;
  assetIn: SettlementAsset;
  assetOut: SettlementAsset;
  requestedAmount: string;
  availableLiquidity: string;
  status: "PASS" | "PARTIAL" | "FAIL";
  checkedAt: string;
}