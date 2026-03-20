"use client";

import {
  Activity,
  FileText,
  ArrowDownUp,
  TrendingUp,
  CheckSquare,
  Settings,
  AlertCircle,
  CheckCircle2,
  Info,
  Wallet,
  RefreshCcw,
} from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

function categoryFor(entityType: string) {
  switch (entityType) {
    case "invoice":
      return "Invoices";
    case "settlement":
      return "Settlements";
    case "treasury":
    case "vault":
      return "Treasury";
    case "yield":
    case "strategy":
      return "Yield";
    case "invoice_payment_status":
      return "Reconciliation";
    case "refund":
      return "Refunds";
    default:
      return "System";
  }
}

const categoryIcons = {
  Invoices: FileText,
  Settlements: ArrowDownUp,
  Treasury: Settings,
  Yield: TrendingUp,
  Reconciliation: CheckSquare,
  Refunds: RefreshCcw,
  System: Activity,
};

function severityFor(eventType: string) {
  if (eventType.includes("failed")) return "critical";
  if (eventType.includes("expired") || eventType.includes("pending")) return "warning";
  if (eventType.includes("synced") || eventType.includes("created") || eventType.includes("completed")) return "success";
  return "info";
}

const severityConfig = {
  info: {
    icon: Info,
    label: "Info",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  success: {
    icon: CheckCircle2,
    label: "Success",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  warning: {
    icon: AlertCircle,
    label: "Warning",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  critical: {
    icon: AlertCircle,
    label: "Critical",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

export function ActivityFeed() {
  const { merchantId } = useMerchantSession();
  const { activities, loading, error } = useIndexedActivity(merchantId, 50);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Event Log</h3>
            <p className="text-sm text-gray-500">Operational activity and audit trail</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading activity...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : activities.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No activity events yet.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((event) => {
                  const category = categoryFor(event.entityType);
                  const CategoryIcon =
                    categoryIcons[category as keyof typeof categoryIcons] || Activity;
                  const severity = severityFor(event.eventType);
                  const severityConf = severityConfig[severity];
                  const SeverityIcon = severityConf.icon;

                  return (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          EVT-{event.id}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.eventType.replaceAll("_", " ")}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 max-w-md">
                          Merchant activity record
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          <CategoryIcon className="h-3.5 w-3.5" />
                          {category}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                          {event.entityType} #{event.entityId}
                        </code>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {event.payload?.actor || "System"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {createdLabel(event.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${severityConf.bgColor} border ${severityConf.borderColor}`}>
                          <SeverityIcon className={`h-3.5 w-3.5 ${severityConf.iconColor}`} />
                          <span className={`text-xs font-semibold ${severityConf.textColor}`}>
                            {severityConf.label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
  <div className="flex items-center justify-between">
    <div className="text-sm text-gray-600">
      Showing <span className="font-semibold text-gray-900">{activities.length}</span> indexed events
    </div>
    <div className="text-xs text-gray-500">Latest first</div>
  </div>
</div>
        </>
      )}
    </div>
  );
}
