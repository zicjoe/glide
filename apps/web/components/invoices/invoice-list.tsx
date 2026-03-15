import {
    ExternalLink,
    Copy,
    XCircle,
    Clock,
    CheckCircle2,
    AlertCircle,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  
  const invoices = [
    {
      id: "INV-2847",
      asset: "sBTC",
      amount: "0.0234",
      usdValue: "$1,426.50",
      status: "open" as const,
      expiry: "6 days left",
      customer: "Acme Corp",
      createdAt: "2 hours ago",
    },
    {
      id: "INV-2846",
      asset: "sBTC",
      amount: "0.0567",
      usdValue: "$3,454.20",
      status: "paid" as const,
      expiry: "Paid",
      customer: "TechFlow Inc",
      createdAt: "5 hours ago",
    },
    {
      id: "INV-2845",
      asset: "USDCx",
      amount: "120.34",
      usdValue: "$120.34",
      status: "open" as const,
      expiry: "3 days left",
      customer: "BuildCo",
      createdAt: "1 day ago",
    },
    {
      id: "INV-2844",
      asset: "sBTC",
      amount: "0.1203",
      usdValue: "$7,326.30",
      status: "paid" as const,
      expiry: "Paid",
      customer: "Merchant LLC",
      createdAt: "1 day ago",
    },
    {
      id: "INV-2843",
      asset: "sBTC",
      amount: "0.0892",
      usdValue: "$5,432.60",
      status: "expired" as const,
      expiry: "Expired 2 days ago",
      customer: "Digital Goods Co",
      createdAt: "9 days ago",
    },
    {
      id: "INV-2842",
      asset: "USDCx",
      amount: "450.00",
      usdValue: "$450.00",
      status: "open" as const,
      expiry: "12 hours left",
      customer: "StartupXYZ",
      createdAt: "6 days ago",
    },
  ];
  
  const statusConfig = {
    open: {
      icon: Clock,
      label: "Open",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    paid: {
      icon: CheckCircle2,
      label: "Paid",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    expired: {
      icon: AlertCircle,
      label: "Expired",
      iconColor: "text-gray-600",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    cancelled: {
      icon: XCircle,
      label: "Cancelled",
      iconColor: "text-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };
  
  export function InvoiceList() {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Invoice List</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage payment requests and checkout links
              </p>
            </div>
          </div>
        </div>
  
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
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
                  Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
  
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => {
                const config = statusConfig[invoice.status];
                const StatusIcon = config.icon;
  
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {invoice.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {invoice.customer}
                        </div>
                      </div>
                    </td>
  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                          invoice.asset === "sBTC"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {invoice.asset}
                      </span>
                    </td>
  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {invoice.amount} {invoice.asset}
                        </div>
                        <div className="text-xs text-gray-500">{invoice.usdValue}</div>
                      </div>
                    </td>
  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}
                      >
                        <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor}`} />
                        <span className={`text-xs font-semibold ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{invoice.expiry}</div>
                      <div className="text-xs text-gray-500">{invoice.createdAt}</div>
                    </td>
  
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invoice.status === "open" && (
                          <>
                            <Button
  asChild
  variant="outline"
  size="sm"
  className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
>
  <Link href={`/invoices/${invoice.id}`}>
    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
    Open
  </Link>
</Button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
  
                        {invoice.status === "paid" && (
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        )}
  
                        {invoice.status === "expired" && (
                          <span className="text-xs text-gray-400">No actions</span>
                        )}
                      </div>
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