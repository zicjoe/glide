import { TrendingUp, Clock, Target, Percent } from "lucide-react";

const summaryCards = [
  {
    title: "Total Deployed",
    value: "0.4523 sBTC",
    subValue: "≈ $27,564.30",
    icon: TrendingUp,
    iconColor: "from-green-500 to-green-600",
    iconBg: "bg-green-50",
    iconBorder: "border-green-100",
  },
  {
    title: "Queued Balance",
    value: "0.0847 sBTC",
    subValue: "Awaiting deployment",
    icon: Clock,
    iconColor: "from-amber-500 to-amber-600",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
  },
  {
    title: "Active Strategies",
    value: "4",
    subValue: "All healthy",
    icon: Target,
    iconColor: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-100",
  },
  {
    title: "Average APY",
    value: "6.8%",
    subValue: "Est. annual yield",
    icon: Percent,
    iconColor: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-50",
    iconBorder: "border-purple-100",
  },
];

export function YieldSummary() {
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
                {card.value}
              </p>
              <p className="text-sm text-gray-600">
                {card.subValue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}