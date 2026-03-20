"use client";

import { Activity, AlertCircle, User, Cpu } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";

export function ActivitySummary() {
  const { merchantId } = useMerchantSession();
  const { activities, loading, error } = useIndexedActivity(merchantId, 100);

  const totalEvents = activities.length;
  const criticalEvents = activities.filter(
    (a) => a.eventType.includes("failed") || a.eventType.includes("critical"),
  ).length;
  const userActions = activities.filter(
    (a) =>
      !a.eventType.includes("sync") &&
      !a.eventType.includes("vault") &&
      !a.eventType.includes("yield"),
  ).length;
  const systemActions = Math.max(totalEvents - userActions, 0);

  const summaryCards = [
    {
      title: "Total Events",
      value: loading ? "..." : error ? "—" : String(totalEvents),
      subValue: "Indexed merchant activity",
      icon: Activity,
      iconColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
    {
      title: "Critical Events",
      value: loading ? "..." : error ? "—" : String(criticalEvents),
      subValue: "Needs attention",
      icon: AlertCircle,
      iconColor: "from-red-500 to-red-600",
      iconBg: "bg-red-50",
      iconBorder: "border-red-100",
    },
    {
      title: "User Actions",
      value: loading ? "..." : error ? "—" : String(userActions),
      subValue: "Manual operations",
      icon: User,
      iconColor: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconBorder: "border-green-100",
    },
    {
      title: "System Actions",
      value: loading ? "..." : error ? "—" : String(systemActions),
      subValue: "Automated events",
      icon: Cpu,
      iconColor: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      iconBorder: "border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.iconColor} ${card.iconBg} border ${card.iconBorder} flex items-center justify-center shadow-sm`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {card.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600">{card.subValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
