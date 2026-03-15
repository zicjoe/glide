import { PieChart, Wallet } from "lucide-react";

const allocations = [
  {
    bucket: "Yield Pool",
    percentage: 65,
    deployed: "0.2938 sBTC",
    usdValue: "$17,905.80",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
  {
    bucket: "Operating",
    percentage: 25,
    deployed: "0.1131 sBTC",
    usdValue: "$6,891.10",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    bucket: "Reserves",
    percentage: 10,
    deployed: "0.0454 sBTC",
    usdValue: "$2,767.40",
    color: "bg-gray-600",
    lightColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
  },
];

export function YieldAllocationBreakdown() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Allocation Source</h3>
            <p className="text-sm text-gray-500">Deployed by bucket</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {allocations.map((allocation) => (
          <div
            key={allocation.bucket}
            className={`p-4 rounded-xl border ${allocation.borderColor} ${allocation.lightColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${allocation.color} flex items-center justify-center shadow-sm`}>
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{allocation.bucket}</div>
                  <div className="text-xs text-gray-600">{allocation.percentage}% of total</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Deployed Amount</span>
                <span className="font-semibold text-gray-900">{allocation.deployed}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">USD Value</span>
                <span className="font-semibold text-gray-900">{allocation.usdValue}</span>
              </div>

              <div className="pt-2">
                <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className={`${allocation.color} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${allocation.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Total Deployed</span>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">0.4523 sBTC</div>
            <div className="text-xs text-gray-600">$27,564.30</div>
          </div>
        </div>
      </div>
    </div>
  );
}