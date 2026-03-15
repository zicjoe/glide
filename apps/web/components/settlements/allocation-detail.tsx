import { PieChart, Wallet } from "lucide-react";

const allocationData = {
  settlementId: "STL-2847",
  invoice: "INV-2846",
  totalAmount: "0.0562 sBTC",
  usdValue: "$3,454.20",
  buckets: [
    {
      name: "Operating",
      percentage: 60,
      amount: "0.0337 sBTC",
      usdValue: "$2,072.52",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      name: "Reserves",
      percentage: 30,
      amount: "0.0169 sBTC",
      usdValue: "$1,036.26",
      color: "bg-gray-600",
      lightColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
    },
    {
      name: "Yield Pool",
      percentage: 10,
      amount: "0.0056 sBTC",
      usdValue: "$345.42",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
  ],
};

export function AllocationDetail() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Treasury Allocation Detail</h3>
              <p className="text-sm text-gray-500">Settlement split across treasury buckets</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Settlement</div>
            <div className="text-sm font-semibold text-gray-900">{allocationData.settlementId}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                Net Settlement Amount
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {allocationData.totalAmount}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {allocationData.usdValue}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {allocationData.invoice}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {allocationData.buckets.map((bucket) => (
            <div
              key={bucket.name}
              className={`p-5 rounded-xl border ${bucket.borderColor} ${bucket.lightColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${bucket.color} flex items-center justify-center shadow-sm`}>
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{bucket.name}</div>
                    <div className="text-xs text-gray-600">{bucket.percentage}% allocation</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{bucket.amount}</div>
                  <div className="text-xs text-gray-600">{bucket.usdValue}</div>
                </div>
              </div>

              <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`${bucket.color} h-2 rounded-full transition-all duration-700`}
                  style={{ width: `${bucket.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
            <span className="text-sm font-semibold text-green-900">Allocation Complete</span>
          </div>
          <span className="text-xs text-green-700">100% distributed to treasury buckets</span>
        </div>
      </div>
    </div>
  );
}