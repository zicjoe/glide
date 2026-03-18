"use client";

import { Activity, TrendingUp, ArrowDownCircle, Clock, DollarSign } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function YieldActivity() {
  const { merchantId } = useMerchantSession();
  const { positions, queueItems, loading, error } = useIndexedYield(merchantId);
  const { activities } = useIndexedActivity(merchantId, 8);

  const recentYieldActivity = activities.filter(
    (a) =>
      a.entityType === "yield" ||
      a.eventType.includes("yield") ||
      a.eventType.includes("vault"),
  );

  const totalQueued = queueItems.reduce((sum, item) => sum + item.amount, 0);
  const totalDeployed = positions.reduce((sum, item) => sum + item.amount, 0);

  const projections = [
    {
      label: "Total Queued",
      value: String(totalQueued),
      color: "green",
    },
    {
      label: "Total Deployed",
      value: String(totalDeployed),
      color: "blue",
    },
    {
      label: "Positions",
      value: String(positions.length),
      color: "purple",
    },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Deployments, withdrawals, and yield events</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-gray-600">Loading yield activity...</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : recentYieldActivity.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">No yield activity yet.</div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {recentYieldActivity.map((activity) => {
                  let Icon = Clock;
                  let iconColor = "text-gray-600";

                  if (activity.eventType.includes("yield")) {
                    Icon = DollarSign;
                    iconColor = "text-green-600";
                  } else if (activity.eventType.includes("vault")) {
                    Icon = ArrowDownCircle;
                    iconColor = "text-amber-600";
                  } else {
                    Icon = TrendingUp;
                    iconColor = "text-blue-600";
                  }

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-900 font-medium">
                          {activity.eventType.replaceAll("_", " ")}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {activity.entityType} #{activity.entityId}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">
                            {createdLabel(activity.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Yield Projections</h3>
                <p className="text-sm text-gray-500">Indexed metrics</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {projections.map((projection) => {
              const colorMap = {
                green: {
                  bg: "bg-green-50",
                  border: "border-green-200",
                  text: "text-green-700",
                },
                blue: {
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  text: "text-blue-700",
                },
                purple: {
                  bg: "bg-purple-50",
                  border: "border-purple-200",
                  text: "text-purple-700",
                },
              };

              const colors = colorMap[projection.color];

              return (
                <div
                  key={projection.label}
                  className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}
                >
                  <div className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
                    {projection.label}
                  </div>
                  <div className={`text-lg font-semibold ${colors.text}`}>
                    {projection.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
