import { ClipboardCheck, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const pendingRefunds = [
  {
    id: "RFD-2845",
    invoiceRef: "INV-2842",
    settlementId: "STL-2842",
    reason: "Customer requested refund for order cancellation",
    asset: "sBTC",
    amount: "0.0234",
    usdValue: "$1,426.50",
    requester: "admin@glide.co",
    priority: "medium" as const,
    createdTime: "1 day ago",
  },
  {
    id: "RFD-2848",
    invoiceRef: "INV-2849",
    settlementId: "STL-2849",
    reason: "Duplicate payment detected - merchant error",
    asset: "sBTC",
    amount: "0.0567",
    usdValue: "$3,454.20",
    requester: "support@glide.co",
    priority: "high" as const,
    createdTime: "4 hours ago",
  },
  {
    id: "RFD-2849",
    invoiceRef: "INV-2850",
    settlementId: "STL-2850",
    reason: "Service not delivered - customer complaint",
    asset: "USDCx",
    amount: "234.50",
    usdValue: "$234.50",
    requester: "admin@glide.co",
    priority: "low" as const,
    createdTime: "2 days ago",
  },
];

const priorityConfig = {
  high: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    badgeBorder: "border-red-300",
  },
  medium: {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-300",
  },
  low: {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-300",
  },
};

export function RefundApproval() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Refund Approval Queue</h3>
              <p className="text-sm text-gray-500">Items awaiting review and approval</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{pendingRefunds.length}</span> pending
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {pendingRefunds.map((refund) => {
          const config = priorityConfig[refund.priority];

          return (
            <div
              key={refund.id}
              className={`p-5 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <Flag className={`h-5 w-5 ${config.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{refund.id}</span>
                      <span className="text-xs text-gray-500">• {refund.invoiceRef}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}>
                        {refund.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 mb-2">{refund.reason}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="h-3.5 w-3.5" />
                      {refund.requester}
                      <span className="text-gray-400">•</span>
                      {refund.createdTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Asset</div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    refund.asset === "sBTC"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                    {refund.asset}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Refund Amount</div>
                  <div className="text-sm font-semibold text-gray-900">{refund.amount}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">USD Value</div>
                  <div className="text-sm font-semibold text-gray-900">{refund.usdValue}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button className="h-9 px-4 text-sm bg-green-600 hover:bg-green-700 text-white shadow-sm font-medium flex-1">
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="h-9 px-4 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium flex-1"
                >
                  Reject
                </Button>
                <Button
  asChild
  variant="outline"
  className="h-9 px-4 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
>
  <Link href={`/refunds/${refund.id}`}>View Detail</Link>
</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}