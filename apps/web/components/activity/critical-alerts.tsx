import { AlertTriangle, Clock, Info } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "critical" as const,
    message: "Settlement route failure",
    detail: "STL-2843 failed during execution",
    timestamp: "3 hours ago",
  },
  {
    id: 2,
    type: "warning" as const,
    message: "Reconciliation variance",
    detail: "REC-2844 flagged for review",
    timestamp: "2 days ago",
  },
  {
    id: 3,
    type: "info" as const,
    message: "Policy update scheduled",
    detail: "Treasury allocation changes pending",
    timestamp: "1 day ago",
  },
];

const typeConfig = {
  critical: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
};

export function CriticalAlerts() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Recent Alerts</h3>
            <p className="text-sm text-gray-500">Important notifications</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-4 w-4 ${config.iconColor} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {alert.message}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {alert.detail}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 py-2 rounded-lg transition-colors">
          View All Alerts
        </button>
      </div>
    </div>
  );
}