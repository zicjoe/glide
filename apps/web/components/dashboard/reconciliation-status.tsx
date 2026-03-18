"use client";

import { CheckSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";
import { INVOICE_STATUS } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function ReconciliationStatus() {
  const { merchantId } = useMerchantSession();
  const { invoices } = useIndexedInvoices(merchantId);
  const { settlements } = useIndexedSettlements(merchantId);
  const { activities } = useIndexedActivity(merchantId, 4);

  const paidInvoices = invoices.filter((i) => i.status === INVOICE_STATUS.PAID).length;
  const matched = Math.min(paidInvoices, settlements.length);
  const unmatched = Math.max(paidInvoices - settlements.length, 0);
  const healthy = unmatched === 0;

  const accuracy =
    paidInvoices === 0 ? 100 : Math.round((matched / paidInvoices) * 1000) / 10;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Reconciliation
            </h3>
            <p className="text-sm text-gray-500">System health status</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div
          className={`border rounded-lg p-4 ${
            healthy
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {healthy ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
            <span
              className={`text-sm font-semibold ${
                healthy ? "text-green-900" : "text-amber-900"
              }`}
            >
              {healthy ? "System Healthy" : "Needs Review"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className={healthy ? "text-green-700" : "text-amber-700"}>
                Matched records
              </span>
              <span className={`font-semibold ${healthy ? "text-green-900" : "text-amber-900"}`}>
                {matched}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className={healthy ? "text-green-700" : "text-amber-700"}>
                Unmatched records
              </span>
              <span className={`font-semibold ${healthy ? "text-green-900" : "text-amber-900"}`}>
                {unmatched}
              </span>
            </div>

            <div className="pt-2 border-t border-current/10">
              <div className={`text-xs ${healthy ? "text-green-600" : "text-amber-600"}`}>
                Based on paid invoices versus indexed settlements
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
            Recent Activity
          </h4>
          <div className="space-y-2">
            {activities.length === 0 ? (
              <div className="text-xs text-gray-500">No recent activity.</div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  {activity.eventType.includes("failed") ? (
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium">
                      {activity.eventType.replaceAll("_", " ")}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {createdLabel(activity.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 font-medium">
              Accuracy Score
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {accuracy}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full shadow-sm transition-all duration-700 ${
                healthy
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-amber-500 to-amber-600"
              }`}
              style={{ width: `${Math.min(accuracy, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
