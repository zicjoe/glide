"use client";

import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { INVOICE_STATUS } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function InvoiceActivity() {
  const { merchantId } = useMerchantSession();
  const { activities, loading, error } = useIndexedActivity(merchantId, 10);
  const { invoices } = useIndexedInvoices(merchantId);

  const openCount = invoices.filter((i) => i.status === INVOICE_STATUS.OPEN).length;
  const paidCount = invoices.filter((i) => i.status === INVOICE_STATUS.PAID).length;
  const expiredCount = invoices.filter((i) => i.status === INVOICE_STATUS.EXPIRED).length;
  const total = Math.max(invoices.length, 1);

  const statusBreakdown = [
    {
      label: "Open",
      count: openCount,
      percentage: Math.round((openCount / total) * 100),
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      label: "Paid",
      count: paidCount,
      percentage: Math.round((paidCount / total) * 100),
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Expired",
      count: expiredCount,
      percentage: Math.round((expiredCount / total) * 100),
      color: "bg-gray-500",
      lightColor: "bg-gray-50",
      textColor: "text-gray-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Status Breakdown
              </h3>
              <p className="text-sm text-gray-500">Invoice distribution</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {statusBreakdown.map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl ${item.lightColor} border border-gray-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  {item.label}
                </span>
                <span className={`text-sm font-semibold ${item.textColor}`}>
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-700`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1.5">
                {item.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500">Latest invoice events</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading activity...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No activity yet.</div>
        ) : (
          <div className="p-6 space-y-3">
            {activities.map((activity) => {
              let Icon = FileText;
              let iconColor = "text-blue-600";

              if (
                activity.eventType.includes("settlement") ||
                activity.eventType.includes("paid")
              ) {
                Icon = CheckCircle2;
                iconColor = "text-green-600";
              } else if (
                activity.eventType.includes("expired") ||
                activity.eventType.includes("failed")
              ) {
                Icon = AlertCircle;
                iconColor = "text-amber-600";
              } else if (activity.eventType.includes("cancel")) {
                Icon = XCircle;
                iconColor = "text-red-600";
              } else if (activity.eventType.includes("sync")) {
                Icon = Clock;
                iconColor = "text-gray-600";
              }

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium">
                      {activity.eventType.replaceAll("_", " ")}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {activity.entityType} #{activity.entityId}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {createdLabel(activity.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
