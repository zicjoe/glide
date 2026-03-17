import Link from "next/link";
import { CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

const settlements = [
  {
    id: "INV-2847",
    asset: "sBTC",
    amount: "0.0234",
    usdValue: "$1,426.50",
    status: "completed" as const,
    timestamp: "2 hours ago",
    recipient: "Acme Corp",
  },
  {
    id: "INV-2846",
    asset: "sBTC",
    amount: "0.0567",
    usdValue: "$3,454.20",
    status: "completed" as const,
    timestamp: "5 hours ago",
    recipient: "TechFlow Inc",
  },
  {
    id: "INV-2845",
    asset: "USDCx",
    amount: "120.34",
    usdValue: "$120.34",
    status: "processing" as const,
    timestamp: "1 day ago",
    recipient: "BuildCo",
  },
  {
    id: "INV-2844",
    asset: "sBTC",
    amount: "0.1203",
    usdValue: "$7,326.30",
    status: "completed" as const,
    timestamp: "1 day ago",
    recipient: "Merchant LLC",
  },
  {
    id: "INV-2843",
    asset: "sBTC",
    amount: "0.0892",
    usdValue: "$5,432.60",
    status: "completed" as const,
    timestamp: "2 days ago",
    recipient: "Digital Goods Co",
  },
];

export function RecentSettlements() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Recent Settlements
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track payment settlements and their status
            </p>
          </div>
          <Link href="/settlements" className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium transition-colors group">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link href="/executor" className="rounded-xl border border-gray-200 p-5 hover:bg-gray-50">
  <div className="text-sm font-semibold text-gray-900">Executor Ops</div>
  <div className="text-xs text-gray-600 mt-1">Verify payments and trigger settlements</div>
</Link>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {settlements.map((settlement) => (
              <tr
                key={settlement.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {settlement.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {settlement.recipient}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      settlement.asset === "sBTC"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {settlement.asset}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {settlement.amount} {settlement.asset}
                    </div>
                    <div className="text-xs text-gray-500">
                      {settlement.usdValue}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {settlement.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Completed
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                          Processing
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {settlement.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}