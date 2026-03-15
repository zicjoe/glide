import { ActivityHeader } from "@/components/activity/activity-header";
import { ActivitySummary } from "@/components/activity/activity-summary";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ActivityCategories } from "@/components/activity/activity-categories";
import { AuditTraceability } from "@/components/activity/audit-traceability";
import { CriticalAlerts } from "@/components/activity/critical-alerts";

export default function ActivityPage() {
  return (
    <div className="min-h-full">
      <ActivityHeader />

      <div className="px-8 py-6 space-y-6">
        <ActivitySummary />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <ActivityFeed />
          </div>

          <div className="col-span-1 space-y-6">
            <ActivityCategories />
            <AuditTraceability />
            <CriticalAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}