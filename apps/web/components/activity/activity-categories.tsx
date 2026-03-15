import {
    BarChart3,
    FileText,
    ArrowDownUp,
    Settings,
    TrendingUp,
    CheckSquare,
  } from "lucide-react";
  
  const categories = [
    {
      name: "Invoices",
      count: 234,
      percentage: 19,
      icon: FileText,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      name: "Settlements",
      count: 456,
      percentage: 37,
      icon: ArrowDownUp,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      name: "Treasury",
      count: 178,
      percentage: 14,
      icon: Settings,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      name: "Yield",
      count: 145,
      percentage: 12,
      icon: TrendingUp,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      name: "Reconciliation",
      count: 112,
      percentage: 9,
      icon: CheckSquare,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      name: "System",
      count: 122,
      percentage: 9,
      icon: Settings,
      color: "bg-gray-500",
      lightColor: "bg-gray-50",
      textColor: "text-gray-700",
    },
  ];
  
  export function ActivityCategories() {
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
      </div>
    );
  }