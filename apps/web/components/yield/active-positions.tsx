import { TrendingUp, ExternalLink, ArrowDownCircle } from "lucide-react";

const activePositions = [
  {
    id: 1,
    strategyName: "Stacks Yield Optimizer",
    asset: "sBTC",
    depositedAmount: "0.2345",
    usdDeposited: "$14,290.50",
    apy: "7.2%",
    earnedAmount: "0.0034",
    usdEarned: "$207.30",
    deploymentDate: "14 days ago",
    status: "earning" as const,
  },
  {
    id: 2,
    strategyName: "sBTC Staking Pool",
    asset: "sBTC",
    depositedAmount: "0.1234",
    usdDeposited: "$7,519.40",
    apy: "6.5%",
    earnedAmount: "0.0018",
    usdEarned: "$109.70",
    deploymentDate: "21 days ago",
    status: "earning" as const,
  },
  {
    id: 3,
    strategyName: "Conservative Yield",
    asset: "sBTC",
    depositedAmount: "0.0678",
    usdDeposited: "$4,131.80",
    apy: "5.9%",
    earnedAmount: "0.0009",
    usdEarned: "$54.85",
    deploymentDate: "18 days ago",
    status: "earning" as const,
  },
  {
    id: 4,
    strategyName: "USDCx Yield Pool",
    asset: "USDCx",
    depositedAmount: "1234.50",
    usdDeposited: "$1,234.50",
    apy: "8.1%",
    earnedAmount: "23.45",
    usdEarned: "$23.45",
    deploymentDate: "10 days ago",
    status: "earning" as const,
  },
];

export function ActivePositions() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Active Positions</h3>
              <p className="text-sm text-gray-500">Currently deployed yield-earning balances</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{activePositions.length}</span> strategies
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strategy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deposited
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                APY
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activePositions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{position.strategyName}</div>
                    <div className="text-xs text-gray-500">{position.deploymentDate}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    position.asset === "sBTC"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {position.asset}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{position.depositedAmount}</div>
                    <div className="text-xs text-gray-500">{position.usdDeposited}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-700">{position.apy}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-green-700">+{position.earnedAmount}</div>
                    <div className="text-xs text-green-600">{position.usdEarned}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                    Earning
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                      <ArrowDownCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}