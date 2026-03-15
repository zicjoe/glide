import { Wallet } from "lucide-react";

const buckets = [
  {
    name: "Operating",
    percentage: 60,
    amount: "0.7700 sBTC",
    usdValue: "$46,890",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    name: "Reserves",
    percentage: 30,
    amount: "0.3850 sBTC",
    usdValue: "$23,445",
    color: "bg-gray-700",
    lightColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
  },
  {
    name: "Yield Pool",
    percentage: 10,
    amount: "0.1284 sBTC",
    usdValue: "$7,815",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
];

export function TreasuryAllocation() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Treasury Allocation
            </h3>
            <p className="text-sm text-gray-500">Split across buckets</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {buckets.map((bucket) => (
          <div
            key={bucket.name}
            className={`p-5 rounded-xl ${bucket.lightColor} border ${bucket.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">
                {bucket.name}
              </span>
              <span className={`text-sm font-semibold ${bucket.textColor}`}>
                {bucket.percentage}%
              </span>
            </div>

            <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden shadow-inner">
              <div
                className={`${bucket.color} h-3 rounded-full shadow-sm transition-all duration-700`}
                style={{ width: `${bucket.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                {bucket.amount}
              </span>
              <span className="text-xs text-gray-600">{bucket.usdValue}</span>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Total Balance
            </span>
            <div className="text-right">
              <div className="text-base font-semibold text-gray-900">
                1.2834 sBTC
              </div>
              <div className="text-xs text-gray-500">$78,150</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}