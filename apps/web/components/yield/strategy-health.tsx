"use client";

import { Activity, CheckCircle2, AlertTriangle, Pause } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { assetLabel, riskLevelLabel } from "@/lib/contracts/constants";

export function StrategyHealth() {
  const { merchantId } = useMerchantSession();
  const { strategies, positions, loading, error } = useIndexedYield(merchantId);

  const healthyCount = strategies.filter((s) => s.active).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Strategy Health</h3>
            <p className="text-sm text-gray-500">Deployment route status</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading strategy health...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : strategies.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No strategies indexed yet.</div>
      ) : (
        <>
          <div className="p-6 space-y-3">
            {strategies.map((strategy) => {
              const deployed = positions
                .filter((p) => p.strategyId === strategy.strategyId)
                .reduce((sum, p) => sum + p.amount, 0);

              return (
                <div
                  key={strategy.strategyId}
                  className={`p-4 rounded-xl border ${
                    strategy.active
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2">
                      {strategy.active ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <Pause className="h-4 w-4 text-gray-600 mt-0.5" />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{strategy.name}</div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {deployed} {assetLabel(strategy.asset)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500">Risk:</span>
                      <span className="ml-1 font-semibold text-gray-900">
                        {riskLevelLabel(strategy.riskLevel)}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-gray-200 bg-white">
                      <div className={`h-1.5 w-1.5 rounded-full ${strategy.active ? "bg-green-600" : "bg-gray-500"}`} />
                      <span className={`font-semibold ${strategy.active ? "text-green-700" : "text-gray-700"}`}>
                        {strategy.active ? "Healthy" : "Paused"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${healthyCount > 0 ? "bg-green-600" : "bg-gray-500"} animate-pulse`} />
                <span className="text-sm font-semibold text-gray-900">
                  {healthyCount > 0 ? "Strategies Available" : "No Active Strategies"}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {healthyCount}/{strategies.length} operational
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
