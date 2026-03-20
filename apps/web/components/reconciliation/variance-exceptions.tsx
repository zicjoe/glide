"use client";

import { AlertTriangle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { INVOICE_STATUS, assetLabel } from "@/lib/contracts/constants";

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

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function VarianceExceptions() {
  const { merchantId } = useMerchantSession();
  const { invoices, loading: invoicesLoading, error: invoicesError } =
    useIndexedInvoices(merchantId);
  const { settlements, loading: settlementsLoading, error: settlementsError } =
    useIndexedSettlements(merchantId);

  const loading = invoicesLoading || settlementsLoading;
  const error = invoicesError || settlementsError;

  const exceptions = invoices
    .filter((invoice) => invoice.status === INVOICE_STATUS.PAID)
    .map((invoice) => {
      const settlement =
        settlements.find((item) => item.invoiceId === invoice.invoiceId) ??
        settlements.find((item) => item.settlementId === invoice.settlementId) ??
        null;

      if (!settlement) {
        return {
          id: `REC-${invoice.invoiceId}`,
          invoiceRef: invoice.reference,
          reason: "No settlement indexed for paid invoice",
          expectedAmount: `${invoice.amount} ${assetLabel(invoice.asset)}`,
          actualAmount: "0",
          variance: invoice.amount,
          createdTime: createdLabel(invoice.createdAt),
        };
      }

      const variance = Math.max(invoice.amount - settlement.netAmount, 0);
      if (variance === 0) return null;

      return {
        id: `REC-${invoice.invoiceId}`,
        invoiceRef: invoice.reference,
        reason: "Settlement net amount lower than invoice amount",
        expectedAmount: `${invoice.amount} ${assetLabel(invoice.asset)}`,
        actualAmount: `${settlement.netAmount} ${assetLabel(invoice.asset)}`,
        variance,
        createdTime: createdLabel(invoice.createdAt),
      };
    })
    .filter(Boolean)
    .map((item) => {
      const priority =
        item!.variance >= 100000 ? "high" : item!.variance >= 10000 ? "medium" : "low";
      return { ...item!, priority: priority as keyof typeof priorityConfig };
    })
    .slice(0, 5);

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

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading variance exceptions...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : exceptions.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No variance exceptions found.</div>
      ) : (
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
                        <span className="text-sm font-semibold text-gray-900">{exception.id}</span>
                        <span className="text-xs text-gray-500">• {exception.invoiceRef}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                        >
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
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 text-gray-700"
                    disabled
                  >
                    Investigate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-gray-300 text-gray-700"
                    disabled
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
