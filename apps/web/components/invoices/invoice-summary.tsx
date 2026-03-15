import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";

const summaryCards = [
  {
    title: "Total Invoices",
    value: "127",
    subValue: "All time",
    icon: FileText,
    iconColor: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-100",
  },
  {
    title: "Open Invoices",
    value: "18",
    subValue: "14,234.00 pending",
    icon: Clock,
    iconColor: "from-amber-500 to-amber-600",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
  },
  {
    title: "Paid Invoices",
    value: "94",
    subValue: "Last 30 days: 23",
    icon: CheckCircle2,
    iconColor: "from-green-500 to-green-600",
    iconBg: "bg-green-50",
    iconBorder: "border-green-100",
  },
  {
    title: "Expired / Cancelled",
    value: "15",
    subValue: "Last 30 days: 4",
    icon: XCircle,
    iconColor: "from-gray-600 to-gray-700",
    iconBg: "bg-gray-50",
    iconBorder: "border-gray-200",
  },
];

export function InvoiceSummary() {
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