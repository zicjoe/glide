import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { RecentSettlements } from "@/components/dashboard/recent-settlements";
import { TreasuryAllocation } from "@/components/dashboard/treasury-allocation";
import { YieldDeployment } from "@/components/dashboard/yield-deployment";
import { ReconciliationStatus } from "@/components/dashboard/reconciliation-status";

export default function DashboardPage() {
  return (
    <div className="min-h-full">
      <DashboardHeader />

      <div className="px-8 py-6 space-y-6">
        <MetricCards />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentSettlements />
          </div>

          <div className="col-span-1">
            <TreasuryAllocation />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <YieldDeployment />
          </div>

          <div className="col-span-1">
            <ReconciliationStatus />
          </div>
        </div>
      </div>
    </div>
  );
}