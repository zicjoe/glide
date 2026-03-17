"use client";

import type {
  IndexedSettlement,
  IndexedSettlementAllocation,
} from "@/hooks/use-indexed-settlements";

type Props = {
  settlements: IndexedSettlement[];
  allocations: IndexedSettlementAllocation[];
};

export function AllocationDetail({ settlements, allocations }: Props) {
  const latestSettlement = settlements[0] ?? null;
  const latestAllocations = latestSettlement
    ? allocations.filter((a) => a.settlementId === latestSettlement.settlementId)
    : [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Allocation Detail
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Latest settlement bucket split
        </p>
      </div>

      {!latestSettlement ? (
        <div className="p-6 text-sm text-gray-600">
          No settlement allocations yet.
        </div>
      ) : latestAllocations.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">
          No allocation records found for settlement #{latestSettlement.settlementId}.
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="text-sm font-medium text-gray-900">
            Settlement #{latestSettlement.settlementId}
          </div>

          {latestAllocations.map((allocation) => (
            <div
              key={`${allocation.settlementId}-${allocation.bucketId}`}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="text-sm font-semibold text-gray-900">
                Bucket #{allocation.bucketId}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Allocation {allocation.allocationBps} bps
              </div>
              <div className="text-sm text-gray-700 mt-2">
                Amount {allocation.amount}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Destination #{allocation.destinationId}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}