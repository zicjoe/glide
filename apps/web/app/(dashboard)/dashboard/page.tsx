"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";
import { formatDateTime } from "@/lib/format/date";
import {
  loadAllocations,
  loadSettlements,
  type StoredSettlementRecord,
  type StoredBucketAllocation,
} from "@/lib/payment-storage";

function sumAmounts(values: string[]): string {
  const total = values.reduce((sum, value) => sum + Number(value), 0);
  return total.toFixed(2);
}

export default function DashboardPage() {
  const [settlements, setSettlements] = useState<StoredSettlementRecord[]>([]);
  const [allocations, setAllocations] = useState<StoredBucketAllocation[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSettlements(loadSettlements());
    setAllocations(loadAllocations());
    setIsReady(true);
  }, []);

  const totalSettled = useMemo(
    () => sumAmounts(settlements.map((item) => item.netAmount)),
    [settlements],
  );

  const liquidBalance = useMemo(
    () =>
      sumAmounts(
        allocations
          .filter((item) => item.deploymentStatus === "NONE")
          .map((item) => item.amount),
      ),
    [allocations],
  );

  const deployedBalance = useMemo(
    () =>
      sumAmounts(
        allocations
          .filter((item) => item.deploymentStatus !== "NONE")
          .map((item) => item.amount),
      ),
    [allocations],
  );

  return (
    <div>
      <AppHeader
        title="Dashboard"
        description="Monitor settlements, treasury activity, and idle balance deployment."
      />

      <div className="space-y-6 p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <SectionCard title="Total settled" description="Net merchant settlement volume.">
            <p className="text-2xl font-semibold text-zinc-950">
              {isReady ? `$${totalSettled}` : "$0.00"}
            </p>
          </SectionCard>

          <SectionCard title="Liquid balance" description="Available balance across active buckets.">
            <p className="text-2xl font-semibold text-zinc-950">
              {isReady ? `$${liquidBalance}` : "$0.00"}
            </p>
          </SectionCard>

          <SectionCard title="Deployed balance" description="Funds currently queued or allocated to yield.">
            <p className="text-2xl font-semibold text-zinc-950">
              {isReady ? `$${deployedBalance}` : "$0.00"}
            </p>
          </SectionCard>
        </div>

        <SectionCard
          title="Recent settlement activity"
          description="Latest completed settlements."
        >
          {settlements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
              No settlement activity yet.
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.slice(0, 5).map((settlement) => (
                <div
                  key={settlement.settlementId}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-950">
                      {settlement.asset} settlement
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDateTime(settlement.processedAt)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-950">
                    ${settlement.netAmount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}