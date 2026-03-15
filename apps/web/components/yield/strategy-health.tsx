import { Activity, CheckCircle2, Clock, AlertTriangle, Pause } from "lucide-react";

const strategies = [
  {
    id: 1,
    name: "Stacks Yield Optimizer",
    status: "healthy" as const,
    uptime: "99.9%",
    deployed: "0.2345 sBTC",
  },
  {
    id: 2,
    name: "sBTC Staking Pool",
    status: "healthy" as const,
    uptime: "100%",
    deployed: "0.1234 sBTC",
  },
  {
    id: 3,
    name: "Conservative Yield",
    status: "healthy" as const,
    uptime: "99.7%",
    deployed: "0.0678 sBTC",
  },
  {
    id: 4,
    name: "USDCx Yield Pool",
    status: "healthy" as const,
    uptime: "98.5%",
    deployed: "1234.50 USDCx",
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
  queued: {
    icon: Clock,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
  },
  degraded: {
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
  },
  paused: {
    icon: Pause,
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
  },
};

export function StrategyHealth() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Strategy Health</h3>
            <p className="text-sm text-gray-500">Deployment route status</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {strategies.map((strategy) => {
          const config = statusConfig[strategy.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={strategy.id}
              className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <StatusIcon className={`h-4 w-4 ${config.iconColor} mt-0.5`} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{strategy.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{strategy.deployed}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Uptime:</span>
                  <span className={`ml-1 font-semibold ${config.textColor}`}>{strategy.uptime}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${config.bgColor} border ${config.borderColor}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${config.iconColor.replace("text-", "bg-")}`} />
                  <span className={`font-semibold ${config.textColor}`}>Healthy</span>
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
            <span className="text-sm font-semibold text-gray-900">All Strategies Healthy</span>
          </div>
          <span className="text-xs text-gray-600">4/4 operational</span>
        </div>
      </div>
    </div>
  );
}