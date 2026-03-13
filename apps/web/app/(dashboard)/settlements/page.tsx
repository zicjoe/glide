"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";
import { formatDateTime } from "@/lib/format/date";
import {
  loadAllocations,
  loadSettlements,
  type StoredBucketAllocation,
  type StoredSettlementRecord,
} from "@/lib/payment-storage";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<StoredSettlementRecord[]>([]);
  const [allocations, setAllocations] = useState<StoredBucketAllocation[]>([]);

  useEffect(() => {
    setSettlements(loadSettlements());
    setAllocations(loadAllocations());
  }, []);

  return (
    <div>
      <AppHeader
        title="Settlements"
        description="Review payment execution, settlement outcomes, and allocation records."
      />

      <div className="space-y-6 p-8">
        <SectionCard
          title="Settlement records"
          description="Completed settlement results and downstream allocations."
        >
          {settlements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
              No settlement records yet.
            </div>
          ) : (
            <div className="space-y-4">
              {settlements.map((settlement) => {
                const settlementAllocations = allocations.filter(
                  (item) => item.settlementId === settlement.settlementId,
                );

                return (
                  <div
                    key={settlement.settlementId}
                    className="rounded-xl border border-zinc-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950">
                          {settlement.asset} settlement
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Settlement ID: {settlement.settlementId}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Processed: {formatDateTime(settlement.processedAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-zinc-950">
                          ${settlement.netAmount}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Status: {settlement.status}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Allocations
                      </p>

                      <div className="mt-3 space-y-2">
                        {settlementAllocations.map((allocation) => (
                          <div
                            key={allocation.allocationId}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-zinc-600">
                              Bucket {allocation.bucketId.slice(-6)} • {allocation.idleMode}
                            </span>
                            <span className="font-medium text-zinc-950">
                              ${allocation.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}