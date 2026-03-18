"use client";

import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { assetLabel, YIELD_STATUS } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function DeploymentQueue() {
  const { merchantId } = useMerchantSession();
  const { queueItems, strategies, loading, error } = useIndexedYield(merchantId);

  const queuedItems = queueItems.filter(
    (item) =>
      item.status === YIELD_STATUS.QUEUED ||
      item.status === YIELD_STATUS.PAUSED,
  );

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
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Deployment Queue</h3>
              <p className="text-sm text-gray-500">Idle balances awaiting deployment</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{queuedItems.length}</span> pending
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading deployment queue...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : queuedItems.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No queued items yet.</div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strategy Target
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
              {queuedItems.map((item) => (
                <tr key={item.queueId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Queue #{item.queueId}</div>
                      <div className="text-xs text-gray-500">{createdLabel(item.createdAt)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                      {assetLabel(item.asset)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{item.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{strategyName(item.strategyId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                      {item.status === YIELD_STATUS.PAUSED ? "Paused" : "Ready"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-8 px-3 text-xs border-gray-300 text-gray-500"
                    >
                      <ArrowRight className="mr-1.5 h-3.5 w-3.5" />
                      Deploy
                    </Button>
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
