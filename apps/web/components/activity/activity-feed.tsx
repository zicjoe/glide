import {
    Activity,
    FileText,
    ArrowDownUp,
    TrendingUp,
    CheckSquare,
    Settings,
    AlertCircle,
    CheckCircle2,
    Info,
  } from "lucide-react";
  
  const events = [
    {
      id: "EVT-8374",
      eventType: "Settlement Completed",
      category: "Settlements",
      entityRef: "STL-2847",
      description: "Settlement executed and allocated to treasury buckets",
      actor: "System",
      timestamp: "2 min ago",
      severity: "success" as const,
    },
    {
      id: "EVT-8373",
      eventType: "Invoice Created",
      category: "Invoices",
      entityRef: "INV-2847",
      description: "New payment request generated for 0.0234 sBTC",
      actor: "admin@glide.co",
      timestamp: "15 min ago",
      severity: "info" as const,
    },
    {
      id: "EVT-8372",
      eventType: "Yield Deployed",
      category: "Yield",
      entityRef: "YLD-2345",
      description: "Idle balance deployed to Stacks Yield Optimizer",
      actor: "System",
      timestamp: "32 min ago",
      severity: "success" as const,
    },
    {
      id: "EVT-8371",
      eventType: "Reconciliation Mismatch",
      category: "Reconciliation",
      entityRef: "REC-2844",
      description: "Variance detected: expected 0.0450 sBTC, actual 0.0439 sBTC",
      actor: "System",
      timestamp: "1 hour ago",
      severity: "warning" as const,
    },
    {
      id: "EVT-8370",
      eventType: "Treasury Policy Updated",
      category: "Treasury",
      entityRef: "POL-142",
      description: "Allocation percentages modified: Operating 60%, Reserves 30%, Yield 10%",
      actor: "admin@glide.co",
      timestamp: "2 hours ago",
      severity: "info" as const,
    },
    {
      id: "EVT-8369",
      eventType: "Settlement Failed",
      category: "Settlements",
      entityRef: "STL-2843",
      description: "Route error during settlement execution",
      actor: "System",
      timestamp: "3 hours ago",
      severity: "critical" as const,
    },
    {
      id: "EVT-8368",
      eventType: "Destination Added",
      category: "Treasury",
      entityRef: "DST-45",
      description: "New payout destination configured: Operating Wallet",
      actor: "admin@glide.co",
      timestamp: "5 hours ago",
      severity: "info" as const,
    },
    {
      id: "EVT-8367",
      eventType: "Invoice Paid",
      category: "Invoices",
      entityRef: "INV-2846",
      description: "Payment received for 0.0567 sBTC",
      actor: "System",
      timestamp: "6 hours ago",
      severity: "success" as const,
    },
  ];
  
  const categoryIcons = {
    Invoices: FileText,
    Settlements: ArrowDownUp,
    Treasury: Settings,
    Yield: TrendingUp,
    Reconciliation: CheckSquare,
    System: Activity,
  };
  
  const severityConfig = {
    info: {
      icon: Info,
      label: "Info",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    success: {
      icon: CheckCircle2,
      label: "Success",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    warning: {
      icon: AlertCircle,
      label: "Warning",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    critical: {
      icon: AlertCircle,
      label: "Critical",
      iconColor: "text-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };
  
  export function ActivityFeed() {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Event Log</h3>
              <p className="text-sm text-gray-500">Operational activity and audit trail</p>
            </div>
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => {
                const CategoryIcon =
                  categoryIcons[event.category as keyof typeof categoryIcons] || Activity;
                const severityConf = severityConfig[event.severity];
                const SeverityIcon = severityConf.icon;
  
                return (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{event.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{event.eventType}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-md">{event.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        <CategoryIcon className="h-3.5 w-3.5" />
                        {event.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {event.entityRef}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{event.actor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{event.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${severityConf.bgColor} border ${severityConf.borderColor}`}>
                        <SeverityIcon className={`h-3.5 w-3.5 ${severityConf.iconColor}`} />
                        <span className={`text-xs font-semibold ${severityConf.textColor}`}>
                          {severityConf.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">1-8</span> of{" "}
              <span className="font-semibold text-gray-900">1,247</span> events
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }