import { AlertTriangle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

const exceptions = [
  {
    id: 1,
    recordId: "REC-2844",
    invoiceRef: "INV-2840",
    reason: "Settlement amount lower than expected",
    expectedAmount: "0.0450 sBTC",
    actualAmount: "0.0439 sBTC",
    variance: "0.0006 sBTC",
    usdVariance: "$36.60",
    priority: "high" as const,
    createdTime: "2 days ago",
  },
  {
    id: 2,
    recordId: "REC-2842",
    invoiceRef: "INV-2838",
    reason: "Fee calculation discrepancy",
    expectedAmount: "0.0892 sBTC",
    actualAmount: "0.0878 sBTC",
    variance: "0.0005 sBTC",
    usdVariance: "$30.50",
    priority: "medium" as const,
    createdTime: "3 days ago",
  },
  {
    id: 3,
    recordId: "REC-2837",
    invoiceRef: "INV-2831",
    reason: "Treasury allocation rounding variance",
    expectedAmount: "0.0234 sBTC",
    actualAmount: "0.0232 sBTC",
    variance: "0.0002 sBTC",
    usdVariance: "$12.20",
    priority: "low" as const,
    createdTime: "5 days ago",
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

export function VarianceExceptions() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Variance & Exceptions</h3>
              <p className="text-sm text-gray-500">Records requiring review and investigation</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{exceptions.length}</span> flagged
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {exceptions.map((exception) => {
          const config = priorityConfig[exception.priority];

          return (
            <div
              key={exception.id}
              className={`p-5 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <Flag className={`h-5 w-5 ${config.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{exception.recordId}</span>
                      <span className="text-xs text-gray-500">• {exception.invoiceRef}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}>
                        {exception.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 mb-2">{exception.reason}</div>
                    <div className="text-xs text-gray-600">{exception.createdTime}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Expected</div>
                  <div className="text-sm font-semibold text-gray-900">{exception.expectedAmount}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Actual</div>
                  <div className="text-sm font-semibold text-gray-900">{exception.actualAmount}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Variance</div>
                  <div className={`text-sm font-semibold ${config.color}`}>
                    {exception.variance}
                  </div>
                  <div className="text-xs text-gray-600">{exception.usdVariance}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
                >
                  Investigate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
                >
                  Mark Resolved
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}