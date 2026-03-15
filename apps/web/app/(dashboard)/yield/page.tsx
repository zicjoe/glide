import { YieldHeader } from "@/components/yield/yield-header";
import { YieldSummary } from "@/components/yield/yield-summary";
import { DeploymentQueue } from "@/components/yield/deployment-queue";
import { ActivePositions } from "@/components/yield/active-positions";
import { StrategyHealth } from "@/components/yield/strategy-health";
import { YieldAllocationBreakdown } from "@/components/yield/yield-allocation-breakdown";
import { YieldActivity } from "@/components/yield/yield-activity";

export default function YieldPage() {
  return (
    <div className="min-h-full">
      <YieldHeader />

      <div className="px-8 py-6 space-y-6">
        <YieldSummary />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <DeploymentQueue />
            <ActivePositions />
          </div>

          <div className="col-span-1 space-y-6">
            <StrategyHealth />
            <YieldAllocationBreakdown />
          </div>
        </div>

        <YieldActivity />
      </div>
    </div>
  );
}