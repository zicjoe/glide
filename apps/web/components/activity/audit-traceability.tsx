import { Shield, CheckCircle2, Database, Upload, Clock } from "lucide-react";

const auditMetrics = [
  {
    label: "Immutable Logs",
    status: "Active",
    icon: Shield,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    label: "Export Ready",
    status: "Available",
    icon: Upload,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    label: "Retention",
    status: "12 months",
    icon: Clock,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

export function AuditTraceability() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Audit Traceability</h3>
            <p className="text-sm text-gray-500">Compliance & retention</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {auditMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className={`p-4 rounded-xl border ${metric.borderColor} ${metric.bgColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                  <div className="text-sm font-semibold text-gray-900">{metric.label}</div>
                </div>
                <CheckCircle2 className={`h-4 w-4 ${metric.iconColor}`} />
              </div>
              <div className="text-xs text-gray-600">{metric.status}</div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">Storage</span>
          </div>
          <span className="text-xs text-gray-600">234.5 MB</span>
        </div>
        <div className="w-full bg-white rounded-full h-2 overflow-hidden shadow-inner">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "34%" }} />
        </div>
        <div className="text-xs text-gray-600 mt-2">
          34% of 1 GB allocated
        </div>
      </div>
    </div>
  );
}