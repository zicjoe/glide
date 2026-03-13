import type { SettlementAsset } from "./merchant";

export interface YieldPosition {
  positionId: string;
  bucketId: string;
  asset: SettlementAsset;
  principal: string;
  strategy: string;
  status: "ACTIVE" | "CLOSED";
  openedAt: string;
}