import { Activity, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

const executionRoutes = [
  {
    id: 1,
    route: "sBTC Settlement Route",
    status: "healthy" as const,
    lastExecution: "2 min ago",
    successRate: "99.8%",
    queue: 2,
  },
  {
    id: 2,
    route: "USDCx Settlement Route",
    status: "healthy" as const,
    lastExecution: "5 min ago",
    successRate: "100%",
    queue: 0,
  },
  {
    id: 3,
    route: "Treasury Split Processor",
    status: "processing" as const,
    lastExecution: "Active",
    successRate: "98.5%",
    queue: 3,
  },
  {
    id: 4,
    route: "Yield Deployment Router",
    status: "degraded" as const,
    lastExecution: "45 min ago",
    successRate: "94.2%",
    queue: 1,
  },
];

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
  processing: {
    icon: Loader2,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  degraded: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
  },
  failed: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
  },
};

export function ExecutionStatus() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Execution Status</h3>
            <p className="text-sm text-gray-500">Settlement route health</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {executionRoutes.map((route) => {
          const config = statusConfig[route.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={route.id}
              className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <StatusIcon className={`h-4 w-4 ${config.iconColor} mt-0.5 ${route.status === "processing" ? "animate-spin" : ""}`} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{route.route}</div>
                    <div className="text-xs text-gray-600 mt-0.5">Last: {route.lastExecution}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Success Rate:</span>
                  <span className={`ml-1 font-semibold ${config.textColor}`}>{route.successRate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Queue:</span>
                  <span className="ml-1 font-semibold text-gray-700">{route.queue}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-900">System Operational</span>
          </div>
          <span className="text-xs text-gray-600">All critical routes healthy</span>
        </div>
      </div>
    </div>
  );
}