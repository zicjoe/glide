"use client";

import { TrendingUp, Clock, Target, Percent } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";

export function YieldSummary() {
  const { merchantId } = useMerchantSession();
  const { strategies, queueItems, positions, loading, error } = useIndexedYield(merchantId);

  const totalDeployed = positions.reduce((sum, item) => sum + item.amount, 0);
  const totalQueued = queueItems.reduce((sum, item) => sum + item.amount, 0);
  const activeStrategies = strategies.filter((s) => s.active).length;

  const avgRisk =
    strategies.length === 0
      ? 0
      : strategies.reduce((sum, s) => sum + s.riskLevel, 0) / strategies.length;

  const avgApyDisplay =
    avgRisk <= 0 ? "5.0%" : avgRisk <= 1 ? "6.5%" : "8.0%";

  const summaryCards = [
    {
      title: "Total Deployed",
      value: String(totalDeployed),
      subValue: "Indexed deployed amount",
      icon: TrendingUp,
      iconColor: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconBorder: "border-green-100",
    },
    {
      title: "Queued Balance",
      value: String(totalQueued),
      subValue: "Awaiting deployment",
      icon: Clock,
      iconColor: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-100",
    },
    {
      title: "Active Strategies",
      value: String(activeStrategies),
      subValue: "Registry active",
      icon: Target,
      iconColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
    {
      title: "Indicative APY",
      value: avgApyDisplay,
      subValue: "Risk-based display",
      icon: Percent,
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
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : error ? "—" : card.value}
              </p>
              <p className="text-sm text-gray-600">{card.subValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
