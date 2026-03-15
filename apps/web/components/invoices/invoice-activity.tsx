import {
    Activity,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
  } from "lucide-react";
  
  const activities = [
    {
      id: 1,
      type: "paid" as const,
      message: "INV-2846 marked as paid",
      timestamp: "5 hours ago",
      amount: "0.0567 sBTC",
    },
    {
      id: 2,
      type: "created" as const,
      message: "INV-2847 created",
      timestamp: "2 hours ago",
      amount: "0.0234 sBTC",
    },
    {
      id: 3,
      type: "expired" as const,
      message: "INV-2843 expired",
      timestamp: "2 days ago",
      amount: "0.0892 sBTC",
    },
    {
      id: 4,
      type: "paid" as const,
      message: "INV-2844 marked as paid",
      timestamp: "1 day ago",
      amount: "0.1203 sBTC",
    },
    {
      id: 5,
      type: "created" as const,
      message: "INV-2845 created",
      timestamp: "1 day ago",
      amount: "120.34 USDCx",
    },
  ];
  
  const statusBreakdown = [
    {
      label: "Open",
      count: 18,
      percentage: 14,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      label: "Paid",
      count: 94,
      percentage: 74,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Expired",
      count: 15,
      percentage: 12,
      color: "bg-gray-500",
      lightColor: "bg-gray-50",
      textColor: "text-gray-700",
    },
  ];
  
  export function InvoiceActivity() {
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
  
          <div className="p-6 space-y-3">
            {activities.map((activity) => {
              let icon;
              let iconColor;
  
              switch (activity.type) {
                case "paid":
                  icon = CheckCircle2;
                  iconColor = "text-green-600";
                  break;
                case "created":
                  icon = FileText;
                  iconColor = "text-blue-600";
                  break;
                case "expired":
                  icon = Clock;
                  iconColor = "text-gray-600";
                  break;
                default:
                  icon = XCircle;
                  iconColor = "text-red-600";
              }
  
              const Icon = icon;
  
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium">
                      {activity.message}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500">
                        {activity.timestamp}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">
                        {activity.amount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }