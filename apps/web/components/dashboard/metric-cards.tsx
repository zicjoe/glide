import {
    TrendingUp,
    TrendingDown,
    Wallet,
    FileText,
    DollarSign,
  } from "lucide-react";
  
  const metrics = [
    {
      title: "Total Settled",
      value: "1.2834 sBTC",
      usdValue: "$78,234.50",
      change: "+12.4%",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
    {
      title: "Liquid Balance",
      value: "0.8516 sBTC",
      usdValue: "$51,880.20",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Wallet,
      iconColor: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconBorder: "border-green-100",
    },
    {
      title: "Deployed Balance",
      value: "0.4318 sBTC",
      usdValue: "$26,294.30",
      change: "+15.7%",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      iconBorder: "border-purple-100",
    },
    {
      title: "Open Invoices",
      value: "18",
      usdValue: "$14,234.00 pending",
      change: "-3.1%",
      changeType: "negative" as const,
      icon: FileText,
      iconColor: "from-gray-600 to-gray-700",
      iconBg: "bg-gray-50",
      iconBorder: "border-gray-200",
    },
  ];
  
  export function MetricCards() {
    return (
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${metric.iconColor} ${metric.iconBg} border ${metric.iconBorder} flex items-center justify-center shadow-sm`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                    metric.changeType === "positive"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {metric.changeType === "positive" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </div>
              </div>
  
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  {metric.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-600">{metric.usdValue}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }