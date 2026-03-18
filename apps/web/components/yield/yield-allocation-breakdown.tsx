"use client";

import { PieChart, Wallet } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";

const bucketMeta: Record<number, { name: string; color: string; light: string; border: string }> = {
  1: { name: "Bucket 1", color: "bg-blue-500", light: "bg-blue-50", border: "border-blue-200" },
  2: { name: "Bucket 2", color: "bg-green-500", light: "bg-green-50", border: "border-green-200" },
  3: { name: "Bucket 3", color: "bg-gray-600", light: "bg-gray-50", border: "border-gray-200" },
};

export function YieldAllocationBreakdown() {
  const { merchantId } = useMerchantSession();
  const { balances, loading, error } = useIndexedYield(merchantId);

  const deployedByBucket = balances.reduce<Record<number, number>>((acc, balance) => {
    acc[balance.bucketId] = (acc[balance.bucketId] || 0) + balance.deployed;
    return acc;
  }, {});

  const totalDeployed = Object.values(deployedByBucket).reduce((a, b) => a + b, 0);

  const allocations = Object.entries(deployedByBucket)
    .map(([bucketId, deployed]) => {
      const id = Number(bucketId);
      const meta = bucketMeta[id] || {
        name: `Bucket ${id}`,
        color: "bg-gray-500",
        light: "bg-gray-50",
        border: "border-gray-200",
      };

      return {
        bucketId: id,
        bucket: meta.name,
        percentage: totalDeployed === 0 ? 0 : Math.round((deployed / totalDeployed) * 100),
        deployed,
        color: meta.color,
        lightColor: meta.light,
        borderColor: meta.border,
      };
    })
    .sort((a, b) => b.deployed - a.deployed);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Allocation Source</h3>
            <p className="text-sm text-gray-500">Deployed by bucket</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading allocation breakdown...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : allocations.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No deployed balances yet.</div>
      ) : (
        <>
          <div className="p-6 space-y-4">
            {allocations.map((allocation) => (
              <div
                key={allocation.bucketId}
                className={`p-4 rounded-xl border ${allocation.borderColor} ${allocation.lightColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${allocation.color} flex items-center justify-center shadow-sm`}>
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{allocation.bucket}</div>
                      <div className="text-xs text-gray-600">{allocation.percentage}% of total</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Deployed Amount</span>
                    <span className="font-semibold text-gray-900">{allocation.deployed}</span>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className={`${allocation.color} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${allocation.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total Deployed</span>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{totalDeployed}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
