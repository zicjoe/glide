import { Activity, TrendingUp, ArrowDownCircle, Clock, DollarSign } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    type: "deployment" as const,
    message: "Deployed to Stacks Yield Optimizer",
    timestamp: "15 min ago",
    amount: "0.0450 sBTC",
    bucket: "Yield Pool",
  },
  {
    id: 2,
    type: "yield" as const,
    message: "Yield earned from sBTC Staking Pool",
    timestamp: "2 hours ago",
    amount: "+0.0003 sBTC",
    bucket: "Operating",
  },
  {
    id: 3,
    type: "deployment" as const,
    message: "Deployed to Conservative Yield",
    timestamp: "4 hours ago",
    amount: "0.0163 sBTC",
    bucket: "Reserves",
  },
  {
    id: 4,
    type: "withdrawal" as const,
    message: "Withdrawn from USDCx Yield Pool",
    timestamp: "6 hours ago",
    amount: "234.50 USDCx",
    bucket: "Operating",
  },
  {
    id: 5,
    type: "yield" as const,
    message: "Yield earned from Stacks Yield Optimizer",
    timestamp: "1 day ago",
    amount: "+0.0005 sBTC",
    bucket: "Yield Pool",
  },
  {
    id: 6,
    type: "deployment" as const,
    message: "Deployed to sBTC Staking Pool",
    timestamp: "2 days ago",
    amount: "0.0234 sBTC",
    bucket: "Operating",
  },
];

const yieldProjections = [
  {
    label: "Est. Monthly Yield",
    value: "0.0089 sBTC",
    usdValue: "$542.30",
    color: "green",
  },
  {
    label: "Est. Annual Yield",
    value: "0.1068 sBTC",
    usdValue: "$6,507.60",
    color: "blue",
  },
  {
    label: "Total Earned (All Time)",
    value: "0.0245 sBTC",
    usdValue: "$1,493.50",
    color: "purple",
  },
];

export function YieldActivity() {
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

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {recentActivities.map((activity) => {
                let icon;
                let iconColor;

                switch (activity.type) {
                  case "deployment":
                    icon = TrendingUp;
                    iconColor = "text-blue-600";
                    break;
                  case "yield":
                    icon = DollarSign;
                    iconColor = "text-green-600";
                    break;
                  case "withdrawal":
                    icon = ArrowDownCircle;
                    iconColor = "text-amber-600";
                    break;
                  default:
                    icon = Clock;
                    iconColor = "text-gray-600";
                }

                const Icon = icon;

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-900 font-medium">{activity.message}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{activity.bucket}</div>
                      <div className="flex items-center justify-between mt-2">
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
                <p className="text-sm text-gray-500">Performance estimates</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {yieldProjections.map((projection) => {
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

              const colors = colorMap[projection.color as keyof typeof colorMap];

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
                  <div className="text-xs text-gray-600 mt-1">
                    {projection.usdValue}
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