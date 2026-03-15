import {
    RefreshCcw,
    CheckCircle2,
    Clock,
    Loader2,
    XCircle,
    Ban,
    ExternalLink,
  } from "lucide-react";
  import Link from "next/link";
  
  const refunds = [
    {
      id: "RFD-2847",
      invoiceRef: "INV-2846",
      settlementId: "STL-2847",
      asset: "sBTC",
      refundAmount: "0.0567",
      usdValue: "$3,454.20",
      status: "completed" as const,
      requestedBy: "admin@glide.co",
      createdTime: "2 hours ago",
    },
    {
      id: "RFD-2846",
      invoiceRef: "INV-2844",
      settlementId: "STL-2846",
      asset: "sBTC",
      refundAmount: "0.1203",
      usdValue: "$7,326.30",
      status: "processing" as const,
      requestedBy: "support@glide.co",
      createdTime: "5 hours ago",
    },
    {
      id: "RFD-2845",
      invoiceRef: "INV-2842",
      settlementId: "STL-2842",
      asset: "sBTC",
      refundAmount: "0.0234",
      usdValue: "$1,426.50",
      status: "pending" as const,
      requestedBy: "admin@glide.co",
      createdTime: "1 day ago",
    },
    {
      id: "RFD-2844",
      invoiceRef: "INV-2840",
      settlementId: "STL-2840",
      asset: "USDCx",
      refundAmount: "450.00",
      usdValue: "$450.00",
      status: "approved" as const,
      requestedBy: "admin@glide.co",
      createdTime: "1 day ago",
    },
    {
      id: "RFD-2843",
      invoiceRef: "INV-2838",
      settlementId: "STL-2838",
      asset: "sBTC",
      refundAmount: "0.0892",
      usdValue: "$5,432.60",
      status: "failed" as const,
      requestedBy: "support@glide.co",
      createdTime: "2 days ago",
    },
    {
      id: "RFD-2842",
      invoiceRef: "INV-2835",
      settlementId: "STL-2835",
      asset: "sBTC",
      refundAmount: "0.0345",
      usdValue: "$2,101.50",
      status: "rejected" as const,
      requestedBy: "admin@glide.co",
      createdTime: "3 days ago",
    },
  ];
  
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    approved: {
      icon: CheckCircle2,
      label: "Approved",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    processing: {
      icon: Loader2,
      label: "Processing",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      iconColor: "text-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    rejected: {
      icon: Ban,
      label: "Rejected",
      iconColor: "text-gray-600",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
  };
  
  export function RefundRecords() {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <RefreshCcw className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Refund Records</h3>
              <p className="text-sm text-gray-500">Payment reversal and payout status</p>
            </div>
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refunds.map((refund) => {
                const config = statusConfig[refund.status];
                const StatusIcon = config.icon;
  
                return (
                  <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{refund.id}</div>
                        <div className="text-xs text-gray-500">{refund.createdTime}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{refund.invoiceRef}</div>
                        <div className="text-xs text-gray-500">{refund.settlementId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        refund.asset === "sBTC"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {refund.asset}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {refund.refundAmount}
                        </div>
                        <div className="text-xs text-gray-500">{refund.usdValue}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}>
                        <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor} ${refund.status === "processing" ? "animate-spin" : ""}`} />
                        <span className={`text-xs font-semibold ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{refund.requestedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
  href={`/refunds/${refund.id}`}
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