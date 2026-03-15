import { ArrowDownUp, CheckCircle2, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
const settlements = [
  {
    id: "STL-2847",
    invoice: "INV-2846",
    asset: "sBTC",
    grossAmount: "0.0567",
    netAmount: "0.0562",
    usdValue: "$3,454.20",
    status: "completed" as const,
    processedTime: "2 hours ago",
    merchant: "TechFlow Inc",
  },
  {
    id: "STL-2846",
    invoice: "INV-2844",
    asset: "sBTC",
    grossAmount: "0.1203",
    netAmount: "0.1197",
    usdValue: "$7,326.30",
    status: "completed" as const,
    processedTime: "1 day ago",
    merchant: "Merchant LLC",
  },
  {
    id: "STL-2845",
    invoice: "INV-2847",
    asset: "sBTC",
    grossAmount: "0.0234",
    netAmount: "0.0232",
    usdValue: "$1,426.50",
    status: "processing" as const,
    processedTime: "In progress",
    merchant: "Acme Corp",
  },
  {
    id: "STL-2844",
    invoice: "INV-2845",
    asset: "USDCx",
    grossAmount: "120.34",
    netAmount: "119.15",
    usdValue: "$119.15",
    status: "processing" as const,
    processedTime: "Queued",
    merchant: "BuildCo",
  },
  {
    id: "STL-2843",
    invoice: "INV-2841",
    asset: "sBTC",
    grossAmount: "0.0450",
    netAmount: "0.0000",
    usdValue: "$0.00",
    status: "failed" as const,
    processedTime: "3 hours ago",
    merchant: "Digital Shop",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  processing: {
    icon: Clock,
    label: "Processing",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  failed: {
    icon: AlertTriangle,
    label: "Failed",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  flagged: {
    icon: AlertTriangle,
    label: "Flagged",
    iconColor: "text-orange-600",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
};

export function SettlementRecords() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <ArrowDownUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Settlement Records</h3>
            <p className="text-sm text-gray-500">Payment execution and allocation history</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settlement ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Processed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {settlements.map((settlement) => {
              const config = statusConfig[settlement.status];
              const StatusIcon = config.icon;

              return (
                <tr key={settlement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{settlement.id}</div>
                      <div className="text-xs text-gray-500">
                        {settlement.invoice} • {settlement.merchant}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      settlement.asset === "sBTC"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {settlement.asset}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {settlement.grossAmount}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {settlement.netAmount}
                      </div>
                      <div className="text-xs text-gray-500">{settlement.usdValue}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}>
                      <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor}`} />
                      <span className={`text-xs font-semibold ${config.textColor}`}>
                        {config.label}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{settlement.processedTime}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
  href={`/settlements/${settlement.id}`}
  className="text-gray-400 hover:text-blue-600 transition-colors p-1 inline-flex"
>
  <ExternalLink className="h-4 w-4" />
</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}