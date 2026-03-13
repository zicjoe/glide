"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";
import { formatDateTime } from "@/lib/format/date";
import {
  loadReconciliationRecords,
  type StoredReconciliationRecord,
} from "@/lib/ops-storage";

export default function ReconciliationPage() {
  const [records, setRecords] = useState<StoredReconciliationRecord[]>([]);

  useEffect(() => {
    setRecords(loadReconciliationRecords());
  }, []);

  return (
    <div>
      <AppHeader
        title="Reconciliation"
        description="Compare expected invoice amounts against actual settlement outcomes."
      />

      <div className="space-y-6 p-8">
        <SectionCard
          title="Reconciliation records"
          description="Each completed payment is checked against the settlement result."
        >
          {records.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
              No reconciliation records yet.
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.reconciliationId}
                  className="rounded-xl border border-zinc-200 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-zinc-950">
                          Invoice {record.invoiceId.slice(-6)}
                        </p>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                          {record.status}
                        </span>
                      </div>

                      <dl className="mt-3 space-y-1 text-xs text-zinc-500">
                        <div className="flex gap-2">
                          <dt>Payment:</dt>
                          <dd>{record.paymentId}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt>Settlement:</dt>
                          <dd>{record.settlementId}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt>Created:</dt>
                          <dd>{formatDateTime(record.createdAt)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="min-w-[220px] space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Expected</span>
                        <span className="font-medium text-zinc-950">
                          ${record.expectedAmount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Actual</span>
                        <span className="font-medium text-zinc-950">
                          ${record.actualAmount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Fees</span>
                        <span className="font-medium text-zinc-950">
                          ${record.feeAmount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Variance</span>
                        <span className="font-medium text-zinc-950">
                          ${record.variance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}