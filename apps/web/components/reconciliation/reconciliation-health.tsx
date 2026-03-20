"use client";

import { Activity, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";
import { INVOICE_STATUS } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const date = new Date(createdAt * 1000);
  return date.toLocaleString();
}

export function ReconciliationHealth() {
  const { merchantId } = useMerchantSession();
  const { invoices } = useIndexedInvoices(merchantId);
  const { settlements } = useIndexedSettlements(merchantId);
  const { activities } = useIndexedActivity(merchantId, 20);

  const paidInvoices = invoices.filter((invoice) => invoice.status === INVOICE_STATUS.PAID);
  const matchedRecords = paidInvoices.filter((invoice) =>
    settlements.some(
      (settlement) =>
        settlement.invoiceId === invoice.invoiceId ||
        settlement.settlementId === invoice.settlementId,
    ),
  ).length;

  const accuracy =
    paidInvoices.length === 0
      ? 100
      : Math.round((matchedRecords / paidInvoices.length) * 1000) / 10;

  const lastRun = activities.find(
    (activity) =>
      activity.eventType.includes("payment_status_synced") ||
      activity.eventType.includes("settlement") ||
      activity.eventType.includes("invoice"),
  );

  const healthMetrics = [
    {
      label: "System Accuracy",
      value: `${accuracy}%`,
      status: "healthy" as const,
      trend: `${matchedRecords} matched`,
    },
    {
      label: "Matched Records",
      value: `${matchedRecords} / ${paidInvoices.length}`,
      status: "healthy" as const,
      trend: "Indexed",
    },
    {
      label: "Last Run",
      value: lastRun ? createdLabel(lastRun.createdAt) : "No runs yet",
      status: "recent" as const,
      trend: "Auto",
    },
  ];

  const statusConfig = {
    healthy: {
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    recent: {
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reconciliation Health</h3>
            <p className="text-sm text-gray-500">System accuracy metrics</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {healthMetrics.map((metric) => {
          const config = statusConfig[metric.status];

          return (
            <div
              key={metric.label}
              className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                <CheckCircle2 className={`h-4 w-4 ${config.iconColor}`} />
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className={`text-2xl font-semibold ${config.textColor}`}>
                  {metric.value}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">{metric.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Auto-Reconciliation</span>
          </div>
          <span className="text-xs text-gray-600">Indexer cycle based</span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Updated from indexed invoices and settlements
        </div>
      </div>
    </div>
  );
}
