import { CheckSquare, CheckCircle2, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

const records = [
  {
    id: "REC-2847",
    invoiceRef: "INV-2846",
    paymentId: "PAY-8374",
    settlementId: "STL-2847",
    expectedAmount: "0.0567",
    actualAmount: "0.0562",
    feeAmount: "0.0005",
    variance: "0.0000",
    asset: "sBTC",
    status: "matched" as const,
    createdTime: "2 hours ago",
  },
  {
    id: "REC-2846",
    invoiceRef: "INV-2844",
    paymentId: "PAY-8372",
    settlementId: "STL-2846",
    expectedAmount: "0.1203",
    actualAmount: "0.1197",
    feeAmount: "0.0006",
    variance: "0.0000",
    asset: "sBTC",
    status: "matched" as const,
    createdTime: "1 day ago",
  },
  {
    id: "REC-2845",
    invoiceRef: "INV-2847",
    paymentId: "PAY-8376",
    settlementId: "STL-2845",
    expectedAmount: "0.0234",
    actualAmount: "0.0232",
    feeAmount: "0.0002",
    variance: "0.0000",
    asset: "sBTC",
    status: "matched" as const,
    createdTime: "3 hours ago",
  },
  {
    id: "REC-2844",
    invoiceRef: "INV-2840",
    paymentId: "PAY-8365",
    settlementId: "STL-2839",
    expectedAmount: "0.0450",
    actualAmount: "0.0439",
    feeAmount: "0.0005",
    variance: "0.0006",
    asset: "sBTC",
    status: "mismatched" as const,
    createdTime: "2 days ago",
  },
  {
    id: "REC-2843",
    invoiceRef: "INV-2845",
    paymentId: "PAY-8377",
    settlementId: "STL-2844",
    expectedAmount: "120.34",
    actualAmount: "119.15",
    feeAmount: "1.19",
    variance: "0.00",
    asset: "USDCx",
    status: "matched" as const,
    createdTime: "4 hours ago",
  },
  {
    id: "REC-2842",
    invoiceRef: "INV-2838",
    paymentId: "PAY-8361",
    settlementId: "STL-2836",
    expectedAmount: "0.0892",
    actualAmount: "0.0878",
    feeAmount: "0.0009",
    variance: "0.0005",
    asset: "sBTC",
    status: "review" as const,
    createdTime: "3 days ago",
  },
];

const statusConfig = {
  matched: {
    icon: CheckCircle2,
    label: "Matched",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  mismatched: {
    icon: AlertTriangle,
    label: "Mismatched",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  review: {
    icon: Clock,
    label: "Review",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

export function ReconciliationRecords() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reconciliation Records</h3>
            <p className="text-sm text-gray-500">Invoice and settlement matching results</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rec ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Ref
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settlement ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variance
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
            {records.map((record) => {
              const config = statusConfig[record.status];
              const StatusIcon = config.icon;
              const hasVariance = parseFloat(record.variance) > 0;

              return (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{record.id}</div>
                      <div className="text-xs text-gray-500">{record.createdTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.invoiceRef}</div>
                      <div className="text-xs text-gray-500">{record.paymentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.settlementId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {record.expectedAmount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {record.actualAmount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{record.feeAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${
                      hasVariance ? "text-red-700" : "text-gray-400"
                    }`}>
                      {hasVariance ? `+${record.variance}` : record.variance}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
  href={`/reconciliation/${record.id}`}
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