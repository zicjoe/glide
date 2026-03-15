import { SettlementsHeader } from "@/components/settlements/settlements-header";
import { SettlementSummary } from "@/components/settlements/settlement-summary";
import { SettlementRecords } from "@/components/settlements/settlement-records";
import { AllocationDetail } from "@/components/settlements/allocation-detail";
import { ExecutionStatus } from "@/components/settlements/execution-status";
import { SettlementActivity } from "@/components/settlements/settlement-activity";

export default function SettlementsPage() {
  return (
    <div className="min-h-full">
      <SettlementsHeader />

      <div className="px-8 py-6 space-y-6">
        <SettlementSummary />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <SettlementRecords />
            <AllocationDetail />
          </div>

          <div className="col-span-1 space-y-6">
            <ExecutionStatus />
            <SettlementActivity />
          </div>
        </div>
      </div>
    </div>
  );
}