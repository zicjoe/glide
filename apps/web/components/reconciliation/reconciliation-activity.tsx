"use client";

import { CheckCircle2, AlertTriangle, Clock, DollarSign, FileText } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function ReconciliationActivity() {
  const { merchantId } = useMerchantSession();
  const { activities, loading, error } = useIndexedActivity(merchantId, 20);
  const { settlements } = useIndexedSettlements(merchantId);

  const recentActivities = activities
    .filter(
      (activity) =>
        activity.eventType.includes("payment_status") ||
        activity.eventType.includes("settlement") ||
        activity.eventType.includes("invoice"),
    )
    .slice(0, 5);

  const totalFees = settlements.reduce((sum, settlement) => sum + settlement.feeAmount, 0);
  const totalGross = settlements.reduce((sum, settlement) => sum + settlement.grossAmount, 0);
  const avgFeeRate =
    totalGross === 0 ? 0 : Math.round((totalFees / totalGross) * 10000) / 100;

  const unmatchedCount = activities.filter(
    (activity) =>
      activity.eventType.includes("failed") || activity.eventType.includes("expired"),
  ).length;

  const feeInsights = [
    {
      label: "Total Fees Paid",
      value: String(totalFees),
      usdValue: "Indexed settlement fees",
      color: "blue",
    },
    {
      label: "Flagged Events",
      value: String(unmatchedCount),
      usdValue: "Potential reconciliation issues",
      color: "amber",
    },
    {
      label: "Avg Fee Rate",
      value: `${avgFeeRate}%`,
      usdValue: "Gross to fee ratio",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Fee Insights</h3>
              <p className="text-sm text-gray-500">Discrepancy tracking</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {feeInsights.map((insight) => {
            const colorMap = {
              blue: {
                bg: "bg-blue-50",
                border: "border-blue-200",
                text: "text-blue-700",
              },
              amber: {
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-700",
              },
              purple: {
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-700",
              },
            };

            const colors = colorMap[insight.color as keyof typeof colorMap];

            return (
              <div
                key={insight.label}
                className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}
              >
                <div className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
                  {insight.label}
                </div>
                <div className={`text-lg font-semibold ${colors.text}`}>
                  {insight.value}
                </div>
                <div className="text-xs text-gray-600 mt-1">{insight.usdValue}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Reconciliation events</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {loading ? (
            <div className="text-sm text-gray-600">Loading reconciliation activity...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : recentActivities.length === 0 ? (
            <div className="text-sm text-gray-600">No reconciliation activity yet.</div>
          ) : (
            recentActivities.map((activity) => {
              let Icon = FileText;
              let iconColor = "text-gray-600";

              if (activity.eventType.includes("settlement")) {
                Icon = CheckCircle2;
                iconColor = "text-green-600";
              } else if (
                activity.eventType.includes("failed") ||
                activity.eventType.includes("expired")
              ) {
                Icon = AlertTriangle;
                iconColor = "text-red-600";
              } else if (activity.eventType.includes("payment_status")) {
                Icon = Clock;
                iconColor = "text-amber-600";
              }

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium">
                      {activity.eventType.replaceAll("_", " ")}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {activity.entityType} #{activity.entityId}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {createdLabel(activity.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
