import { ReconciliationHeader } from "@/components/reconciliation/reconciliation-header";
import { ReconciliationSummary } from "@/components/reconciliation/reconciliation-summary";
import { ReconciliationRecords } from "@/components/reconciliation/reconciliation-records";
import { VarianceExceptions } from "@/components/reconciliation/variance-exceptions";
import { ReconciliationHealth } from "@/components/reconciliation/reconciliation-health";
import { ReconciliationActivity } from "@/components/reconciliation/reconciliation-activity";

export default function ReconciliationPage() {
  return (
    <div className="min-h-full">
      <ReconciliationHeader />

      <div className="px-8 py-6 space-y-6">
        <ReconciliationSummary />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <ReconciliationRecords />
            <VarianceExceptions />
          </div>

          <div className="col-span-1 space-y-6">
            <ReconciliationHealth />
            <ReconciliationActivity />
          </div>
        </div>
      </div>
    </div>
  );
}