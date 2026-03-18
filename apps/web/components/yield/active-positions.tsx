"use client";

import { TrendingUp, ExternalLink, ArrowDownCircle } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { assetLabel, YIELD_STATUS } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 86400) return `${Math.max(1, Math.floor(diff / 3600))} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function ActivePositions() {
  const { merchantId } = useMerchantSession();
  const { positions, strategies, loading, error } = useIndexedYield(merchantId);

  const active = positions.filter((p) => p.status === YIELD_STATUS.DEPLOYED);

  function strategyName(strategyId: number) {
    return (
      strategies.find((s) => s.strategyId === strategyId)?.name ||
      `Strategy #${strategyId}`
    );
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
              <h3 className="text-base font-semibold text-gray-900">Active Positions</h3>
              <p className="text-sm text-gray-500">Currently deployed yield-earning balances</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{active.length}</span> positions
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading active positions...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : active.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No active positions yet.</div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deposited
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {active.map((position) => (
                <tr key={position.positionId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {strategyName(position.strategyId)}
                      </div>
                      <div className="text-xs text-gray-500">{createdLabel(position.deployedAt)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                      {assetLabel(position.asset)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{position.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Position #{position.positionId}</div>
                    <div className="text-xs text-gray-500">Queue #{position.queuedId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                      Earning
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                        <ArrowDownCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
