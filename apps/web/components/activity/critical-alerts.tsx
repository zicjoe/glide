"use client";

import { AlertTriangle, Clock, Info } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function CriticalAlerts() {
  const { merchantId } = useMerchantSession();
  const { activities, loading, error } = useIndexedActivity(merchantId, 30);

  const alerts = activities
    .filter(
      (a) =>
        a.eventType.includes("failed") ||
        a.eventType.includes("expired") ||
        a.eventType.includes("mismatch"),
    )
    .slice(0, 5);

  function typeFor(eventType: string) {
    if (eventType.includes("failed")) return "critical";
    if (eventType.includes("expired") || eventType.includes("mismatch")) return "warning";
    return "info";
  }

  const typeConfig = {
    critical: {
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Recent Alerts</h3>
            <p className="text-sm text-gray-500">Important notifications</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {loading ? (
          <div className="text-sm text-gray-600">Loading alerts...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : alerts.length === 0 ? (
          <div className="text-sm text-gray-600">No recent alerts.</div>
        ) : (
          alerts.map((alert) => {
            const type = typeFor(alert.eventType);
            const config = typeConfig[type];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-4 w-4 ${config.iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {alert.eventType.replaceAll("_", " ")}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {alert.entityType} #{alert.entityId}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {createdLabel(alert.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
  <button
    type="button"
    disabled
    className="w-full text-sm text-gray-400 bg-gray-50 py-2 rounded-lg cursor-default"
  >
    Alert archive coming next
  </button>
</div>
    </div>
  );
}
