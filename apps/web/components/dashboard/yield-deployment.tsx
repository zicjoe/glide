"use client";

import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { YIELD_STATUS, assetLabel } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function YieldDeployment() {
  const { merchantId } = useMerchantSession();
  const { strategies, queueItems, positions, loading, error } = useIndexedYield(merchantId);

  const deployedTotal = positions.reduce((sum, item) => sum + item.amount, 0);
  const queuedTotal = queueItems.reduce((sum, item) => sum + item.amount, 0);

  const merged = [
    ...positions.map((item) => ({
      id: `POS-${item.positionId}`,
      strategyId: item.strategyId,
      amount: item.amount,
      asset: item.asset,
      status: "deployed" as const,
      createdAt: item.deployedAt,
    })),
    ...queueItems.map((item) => ({
      id: `QUE-${item.queueId}`,
      strategyId: item.strategyId,
      amount: item.amount,
      asset: item.asset,
      status: "queued" as const,
      createdAt: item.createdAt,
    })),
  ].slice(0, 5);

  function strategyName(strategyId: number) {
    return strategies.find((s) => s.strategyId === strategyId)?.name || `Strategy #${strategyId}`;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Yield Deployment
              </h3>
              <p className="text-sm text-gray-500">
                Active strategies and queued balances
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Active Strategies
            </div>
            <div className="text-lg font-semibold text-green-700">
              {strategies.filter((s) => s.active).length}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading yield deployment...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : merged.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No yield activity yet.</div>
      ) : (
        <div className="p-6">
          <div className="space-y-3">
            {merged.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  {item.status === "deployed" ? (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center shadow-sm">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {strategyName(item.strategyId)}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                        {item.status === "deployed" ? "Deployed" : "Queued"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.id} • {createdLabel(item.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.amount} {assetLabel(item.asset)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 uppercase tracking-wider font-medium mb-1">
                  Total Deployed
                </div>
                <div className="text-lg font-semibold text-green-900">
                  {deployedTotal}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-xs text-amber-700 uppercase tracking-wider font-medium mb-1">
                  Queued
                </div>
                <div className="text-lg font-semibold text-amber-900">
                  {queuedTotal}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
