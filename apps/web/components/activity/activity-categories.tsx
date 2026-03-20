"use client";

import {
  BarChart3,
  FileText,
  ArrowDownUp,
  Settings,
  TrendingUp,
  CheckSquare,
  RefreshCcw,
  Activity,
} from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";

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

const categoryMeta = {
  Invoices: {
    icon: FileText,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  Settlements: {
    icon: ArrowDownUp,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
  },
  Treasury: {
    icon: Settings,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
  Yield: {
    icon: TrendingUp,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  Reconciliation: {
    icon: CheckSquare,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  Refunds: {
    icon: RefreshCcw,
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-700",
  },
  System: {
    icon: Activity,
    color: "bg-gray-500",
    lightColor: "bg-gray-50",
    textColor: "text-gray-700",
  },
} as const;

export function ActivityCategories() {
  const { merchantId } = useMerchantSession();
  const { activities, loading, error } = useIndexedActivity(merchantId, 100);

  const counts = activities.reduce<Record<string, number>>((acc, item) => {
    const category = categoryFor(item.entityType);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const total = Math.max(activities.length, 1);

  const categories = Object.entries(counts)
    .map(([name, count]) => {
      const meta =
        categoryMeta[name as keyof typeof categoryMeta] ?? categoryMeta.System;

      return {
        name,
        count,
        percentage: Math.round((count / total) * 100),
        icon: meta.icon,
        color: meta.color,
        lightColor: meta.lightColor,
        textColor: meta.textColor,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Event Categories</h3>
            <p className="text-sm text-gray-500">Distribution breakdown</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading categories...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : categories.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No activity categories yet.</div>
      ) : (
        <div className="p-6 space-y-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                className={`p-4 rounded-xl border border-gray-200 ${category.lightColor} hover:shadow-sm transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${category.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-600">{category.count} events</div>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${category.textColor}`}>
                    {category.percentage}%
                  </div>
                </div>

                <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className={`${category.color} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}