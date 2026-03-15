import { Activity, CheckCircle2, TrendingUp, Clock } from "lucide-react";

const healthMetrics = [
  {
    label: "System Accuracy",
    value: "95.5%",
    status: "healthy" as const,
    trend: "+2.3%",
  },
  {
    label: "Matched Records",
    value: "149 / 156",
    status: "healthy" as const,
    trend: "95.5%",
  },
  {
    label: "Last Run",
    value: "2 min ago",
    status: "recent" as const,
    trend: "Auto",
  },
];

const statusConfig = {
  healthy: {
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
  recent: {
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
};

export function ReconciliationHealth() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reconciliation Health</h3>
            <p className="text-sm text-gray-500">System accuracy metrics</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {healthMetrics.map((metric) => {
          const config = statusConfig[metric.status];

          return (
            <div
              key={metric.label}
              className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                <CheckCircle2 className={`h-4 w-4 ${config.iconColor}`} />
              </div>
              <div className="flex items-end justify-between">
                <div className={`text-2xl font-semibold ${config.textColor}`}>
                  {metric.value}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">{metric.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Auto-Reconciliation</span>
          </div>
          <span className="text-xs text-gray-600">Every 30 minutes</span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Next run scheduled in 28 minutes
        </div>
      </div>
    </div>
  );
}