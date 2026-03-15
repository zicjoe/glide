import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const yieldQueue = [
  {
    id: "YLD-1042",
    amount: "0.0500 sBTC",
    usdValue: "$3,045",
    strategy: "Stackswap LP",
    status: "deployed" as const,
    apy: "8.4%",
    deployedAt: "2 days ago",
  },
  {
    id: "YLD-1041",
    amount: "0.0750 sBTC",
    usdValue: "$4,568",
    strategy: "Alex Lending",
    status: "deployed" as const,
    apy: "6.2%",
    deployedAt: "5 days ago",
  },
  {
    id: "YLD-1040",
    amount: "0.0234 sBTC",
    usdValue: "$1,425",
    strategy: "Velar Staking",
    status: "queued" as const,
    apy: "7.8%",
    deployedAt: "Pending",
  },
];

export function YieldDeployment() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Yield Deployment
              </h3>
              <p className="text-sm text-gray-500">
                Active strategies and queued balances
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Avg APY
            </div>
            <div className="text-lg font-semibold text-green-700">7.5%</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {yieldQueue.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {item.status === "deployed" ? (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center shadow-sm">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.strategy}
                    </span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200">
                      {item.apy} APY
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.id} • {item.deployedAt}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {item.amount}
                </div>
                <div className="text-xs text-gray-500">{item.usdValue}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-xs text-green-700 uppercase tracking-wider font-medium mb-1">
                Total Deployed
              </div>
              <div className="text-lg font-semibold text-green-900">
                0.1250 sBTC
              </div>
              <div className="text-xs text-green-600">$7,613</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-xs text-amber-700 uppercase tracking-wider font-medium mb-1">
                Queued
              </div>
              <div className="text-lg font-semibold text-amber-900">
                0.0234 sBTC
              </div>
              <div className="text-xs text-amber-600">$1,425</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}