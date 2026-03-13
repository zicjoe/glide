"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";
import { loadAllocations, type StoredBucketAllocation } from "@/lib/payment-storage";

function sumAmounts(values: string[]): string {
  const total = values.reduce((sum, value) => sum + Number(value), 0);
  return total.toFixed(2);
}

export default function YieldPage() {
  const [allocations, setAllocations] = useState<StoredBucketAllocation[]>([]);

  useEffect(() => {
    setAllocations(loadAllocations());
  }, []);

  const queuedAllocations = useMemo(
    () => allocations.filter((item) => item.deploymentStatus === "QUEUED"),
    [allocations],
  );

  const deployedAllocations = useMemo(
    () => allocations.filter((item) => item.deploymentStatus === "DEPLOYED"),
    [allocations],
  );

  const queuedValue = useMemo(
    () => sumAmounts(queuedAllocations.map((item) => item.amount)),
    [queuedAllocations],
  );

  const deployedValue = useMemo(
    () => sumAmounts(deployedAllocations.map((item) => item.amount)),
    [deployedAllocations],
  );

  return (
    <div>
      <AppHeader
        title="Yield"
        description="Track idle-balance policies and active deployed positions."
      />

      <div className="space-y-6 p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Deployment overview"
            description="Balances queued for yield based on treasury bucket policy."
          >
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Queued balance</dt>
                <dd className="font-medium text-zinc-950">${queuedValue}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Deployed balance</dt>
                <dd className="font-medium text-zinc-950">${deployedValue}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Queued allocations</dt>
                <dd className="font-medium text-zinc-950">
                  {queuedAllocations.length}
                </dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard
            title="Queue status"
            description="Allocations marked with EARN are queued after settlement."
          >
            {queuedAllocations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
                No queued yield allocations yet.
              </div>
            ) : (
              <div className="space-y-3">
                {queuedAllocations.map((allocation) => (
                  <div
                    key={allocation.allocationId}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-950">
                        Bucket {allocation.bucketId.slice(-6)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Deployment status: {allocation.deploymentStatus}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-950">
                      ${allocation.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}