import { DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const summaryCards = [
  {
    title: "Total Settled",
    value: "1.8934 sBTC",
    subValue: "≈ $115,234.50",
    icon: DollarSign,
    iconColor: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-100",
  },
  {
    title: "Completed Settlements",
    value: "142",
    subValue: "Last 30 days",
    icon: CheckCircle2,
    iconColor: "from-green-500 to-green-600",
    iconBg: "bg-green-50",
    iconBorder: "border-green-100",
  },
  {
    title: "Processing",
    value: "7",
    subValue: "Awaiting confirmation",
    icon: Clock,
    iconColor: "from-amber-500 to-amber-600",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
  },
  {
    title: "Failed / Flagged",
    value: "3",
    subValue: "Requires attention",
    icon: AlertTriangle,
    iconColor: "from-red-500 to-red-600",
    iconBg: "bg-red-50",
    iconBorder: "border-red-100",
  },
];

export function SettlementSummary() {
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