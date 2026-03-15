import { Clock, CheckCircle2, AlertTriangle, DollarSign } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "completed" as const,
    message: "STL-2847 completed",
    timestamp: "2 hours ago",
    amount: "0.0562 sBTC",
    detail: "Split to 3 buckets",
  },
  {
    id: 2,
    type: "processing" as const,
    message: "STL-2845 processing",
    timestamp: "In progress",
    amount: "0.0232 sBTC",
    detail: "Treasury allocation",
  },
  {
    id: 3,
    type: "completed" as const,
    message: "STL-2846 completed",
    timestamp: "1 day ago",
    amount: "0.1197 sBTC",
    detail: "Split to 3 buckets",
  },
  {
    id: 4,
    type: "failed" as const,
    message: "STL-2843 failed",
    timestamp: "3 hours ago",
    amount: "0.0450 sBTC",
    detail: "Route error",
  },
  {
    id: 5,
    type: "processing" as const,
    message: "STL-2844 queued",
    timestamp: "Pending",
    amount: "119.15 USDCx",
    detail: "Awaiting confirmation",
  },
];

const reconciliationStats = [
  {
    label: "Settlement Accuracy",
    value: "99.8%",
    status: "healthy" as const,
  },
  {
    label: "Allocation Match",
    value: "100%",
    status: "healthy" as const,
  },
  {
    label: "Fee Reconciliation",
    value: "98.9%",
    status: "healthy" as const,
  },
];

export function SettlementActivity() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Reconciliation</h3>
              <p className="text-sm text-gray-500">Settlement accuracy</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {reconciliationStats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-green-50 border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-green-700">{stat.value}</div>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Settlement events</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {activities.map((activity) => {
            let icon;
            let iconColor;

            switch (activity.type) {
              case "completed":
                icon = CheckCircle2;
                iconColor = "text-green-600";
                break;
              case "processing":
                icon = Clock;
                iconColor = "text-amber-600";
                break;
              case "failed":
                icon = AlertTriangle;
                iconColor = "text-red-600";
                break;
              default:
                icon = Clock;
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
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    <div className="text-xs font-semibold text-gray-700">{activity.amount}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}