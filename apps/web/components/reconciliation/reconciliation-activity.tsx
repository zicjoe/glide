import { CheckCircle2, AlertTriangle, Clock, DollarSign, FileText } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "matched" as const,
    message: "REC-2847 matched successfully",
    timestamp: "2 hours ago",
    detail: "INV-2846 → STL-2847",
  },
  {
    id: 2,
    type: "mismatched" as const,
    message: "REC-2844 flagged for review",
    timestamp: "2 days ago",
    detail: "Variance: 0.0006 sBTC",
  },
  {
    id: 3,
    type: "matched" as const,
    message: "REC-2845 matched successfully",
    timestamp: "3 hours ago",
    detail: "INV-2847 → STL-2845",
  },
  {
    id: 4,
    type: "matched" as const,
    message: "REC-2846 matched successfully",
    timestamp: "1 day ago",
    detail: "INV-2844 → STL-2846",
  },
  {
    id: 5,
    type: "review" as const,
    message: "REC-2842 requires investigation",
    timestamp: "3 days ago",
    detail: "Fee discrepancy detected",
  },
];

const feeInsights = [
  {
    label: "Total Fees Paid",
    value: "0.0127 sBTC",
    usdValue: "$774.30",
    color: "blue",
  },
  {
    label: "Fee Variance",
    value: "0.0003 sBTC",
    usdValue: "$18.30",
    color: "amber",
  },
  {
    label: "Avg Fee Rate",
    value: "0.88%",
    usdValue: "Last 30 days",
    color: "purple",
  },
];

export function ReconciliationActivity() {
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
                <div className="text-xs text-gray-600 mt-1">
                  {insight.usdValue}
                </div>
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
          {recentActivities.map((activity) => {
            let icon;
            let iconColor;

            switch (activity.type) {
              case "matched":
                icon = CheckCircle2;
                iconColor = "text-green-600";
                break;
              case "mismatched":
                icon = AlertTriangle;
                iconColor = "text-red-600";
                break;
              case "review":
                icon = Clock;
                iconColor = "text-amber-600";
                break;
              default:
                icon = FileText;
                iconColor = "text-gray-600";
            }

            const Icon = icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-900 font-medium">{activity.message}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{activity.detail}</div>
                  <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}