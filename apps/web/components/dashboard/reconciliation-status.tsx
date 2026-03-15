import { CheckSquare, AlertCircle, CheckCircle2 } from "lucide-react";

const reconciliationData = {
  matched: 847,
  unmatched: 3,
  lastRun: "2 hours ago",
  status: "healthy" as const,
};

const recentActivity = [
  {
    id: 1,
    type: "match" as const,
    message: "Matched 12 settlements",
    timestamp: "30 min ago",
  },
  {
    id: 2,
    type: "mismatch" as const,
    message: "Flagged INV-2843 for review",
    timestamp: "2 hours ago",
  },
  {
    id: 3,
    type: "match" as const,
    message: "Reconciled treasury split",
    timestamp: "5 hours ago",
  },
  {
    id: 4,
    type: "match" as const,
    message: "Matched 8 settlements",
    timestamp: "1 day ago",
  },
];

export function ReconciliationStatus() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Reconciliation
            </h3>
            <p className="text-sm text-gray-500">System health status</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">
              System Healthy
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700">Matched records</span>
              <span className="font-semibold text-green-900">
                {reconciliationData.matched}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-700">Unmatched records</span>
              <span className="font-semibold text-green-900">
                {reconciliationData.unmatched}
              </span>
            </div>
            <div className="pt-2 border-t border-green-200">
              <div className="text-xs text-green-600">
                Last run: {reconciliationData.lastRun}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
            Recent Activity
          </h4>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                {activity.type === "match" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-900 font-medium">
                    {activity.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 font-medium">
              Accuracy Score
            </span>
            <span className="text-sm font-semibold text-gray-900">99.6%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full shadow-sm transition-all duration-700"
              style={{ width: "99.6%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}