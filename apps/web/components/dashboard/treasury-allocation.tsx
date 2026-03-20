"use client";

import { Wallet } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useTreasury } from "@/hooks/use-treasury";

const bucketColors = [
  {
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    color: "bg-gray-700",
    lightColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
  },
  {
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
];

export function TreasuryAllocation() {
  const { merchantId } = useMerchantSession();
  const { buckets, loading, error } = useTreasury({
    merchantId: merchantId ?? undefined,
  });

  const orderedBuckets = [...buckets].sort((a, b) => a.bucketId - b.bucketId);

  const totalAllocationBps = orderedBuckets.reduce(
    (sum, bucket) => sum + bucket.allocationBps,
    0,
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Treasury Allocation
            </h3>
            <p className="text-sm text-gray-500">Split across buckets</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading treasury allocation...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : orderedBuckets.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No treasury buckets yet.</div>
      ) : (
        <div className="p-6 space-y-5">
          {orderedBuckets.map((bucket, index) => {
            const colors = bucketColors[index % bucketColors.length];
            const percentage = bucket.allocationBps / 100;

            return (
              <div
                key={bucket.bucketId}
                className={`p-5 rounded-xl ${colors.lightColor} border ${colors.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {bucket.name}
                  </span>
                  <span className={`text-sm font-semibold ${colors.textColor}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden shadow-inner">
                  <div
                    className={`${colors.color} h-3 rounded-full shadow-sm transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Bucket #{bucket.bucketId}
                  </span>
                  <span className="text-xs text-gray-600">
                    Destination #{bucket.destinationId}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Total Allocation
              </span>
              <div className="text-right">
                <div className="text-base font-semibold text-gray-900">
                  {(totalAllocationBps / 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">Configured onchain</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
