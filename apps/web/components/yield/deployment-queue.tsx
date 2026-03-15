import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const queuedItems = [
  {
    id: 1,
    bucketName: "Yield Pool",
    asset: "sBTC",
    amount: "0.0450",
    usdValue: "$2,742.00",
    strategyTarget: "Stacks Yield Optimizer",
    queueStatus: "Ready",
    createdTime: "15 min ago",
  },
  {
    id: 2,
    bucketName: "Operating",
    asset: "sBTC",
    amount: "0.0234",
    usdValue: "$1,426.50",
    strategyTarget: "sBTC Staking Pool",
    queueStatus: "Pending Threshold",
    createdTime: "1 hour ago",
  },
  {
    id: 3,
    bucketName: "Reserves",
    asset: "sBTC",
    amount: "0.0163",
    usdValue: "$993.80",
    strategyTarget: "Conservative Yield",
    queueStatus: "Ready",
    createdTime: "2 hours ago",
  },
];

export function DeploymentQueue() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Deployment Queue</h3>
              <p className="text-sm text-gray-500">Idle balances awaiting deployment</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{queuedItems.length}</span> pending
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bucket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strategy Target
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
            {queuedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.bucketName}</div>
                    <div className="text-xs text-gray-500">{item.createdTime}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    item.asset === "sBTC"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {item.asset}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.amount}</div>
                    <div className="text-xs text-gray-500">{item.usdValue}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.strategyTarget}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                    item.queueStatus === "Ready"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      item.queueStatus === "Ready" ? "bg-green-600" : "bg-amber-600"
                    }`} />
                    {item.queueStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
                  >
                    <ArrowRight className="mr-1.5 h-3.5 w-3.5" />
                    Deploy
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}