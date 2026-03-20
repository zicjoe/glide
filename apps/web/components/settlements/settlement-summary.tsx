"use client";

import {
  SETTLEMENT_STATUS,
  ASSET,
  assetLabel,
  formatAssetAmount,
} from "@/lib/contracts/constants";
import type { IndexedSettlement } from "@/hooks/use-indexed-settlements";

type Props = {
  settlements: IndexedSettlement[];
};

function sum(items: number[]) {
  return items.reduce((a, b) => a + b, 0);
}

export function SettlementSummary({ settlements }: Props) {
  const totalCount = settlements.length;

  const completedCount = settlements.filter(
    (s) => s.status === SETTLEMENT_STATUS.COMPLETED,
  ).length;

  const pendingCount = settlements.filter(
    (s) =>
      s.status === SETTLEMENT_STATUS.PENDING ||
      s.status === SETTLEMENT_STATUS.PROCESSING,
  ).length;

  const sbtcNet = sum(
    settlements
      .filter((s) => s.asset === ASSET.SBTC)
      .map((s) => s.netAmount),
  );

  const usdcxNet = sum(
    settlements
      .filter((s) => s.asset === ASSET.USDCX)
      .map((s) => s.netAmount),
  );

  const uniqueAssets = Array.from(new Set(settlements.map((s) => s.asset)));
  const singleAsset = uniqueAssets.length === 1 ? uniqueAssets[0] : null;
  const totalNet = sum(settlements.map((s) => s.netAmount));

  const cards =
    singleAsset != null
      ? [
          { label: "Total Settlements", value: String(totalCount) },
          { label: "Pending / Processing", value: String(pendingCount) },
          { label: "Completed", value: String(completedCount) },
          {
            label: "Net Settled",
            value: `${formatAssetAmount(totalNet, singleAsset)} ${assetLabel(singleAsset)}`,
          },
        ]
      : [
          { label: "Total Settlements", value: String(totalCount) },
          { label: "Pending / Processing", value: String(pendingCount) },
          { label: "Completed", value: String(completedCount) },
          {
            label: "Net Settled sBTC",
            value: `${formatAssetAmount(sbtcNet, ASSET.SBTC)} ${assetLabel(ASSET.SBTC)}`,
          },
          {
            label: "Net Settled USDCx",
            value: `${formatAssetAmount(usdcxNet, ASSET.USDCX)} ${assetLabel(ASSET.USDCX)}`,
          },
        ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {card.label}
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}