import {
    Clock,
    CheckCircle2,
    XCircle,
    Ban,
    FileText,
    AlertTriangle,
  } from "lucide-react";
  
  const recentActivities = [
    {
      id: 1,
      type: "completed" as const,
      message: "RFD-2847 refund completed",
      timestamp: "2 hours ago",
      amount: "0.0567 sBTC",
      detail: "Payout to customer wallet",
    },
    {
      id: 2,
      type: "processing" as const,
      message: "RFD-2846 processing started",
      timestamp: "5 hours ago",
      amount: "0.1203 sBTC",
      detail: "Approval confirmed",
    },
    {
      id: 3,
      type: "pending" as const,
      message: "RFD-2845 created",
      timestamp: "1 day ago",
      amount: "0.0234 sBTC",
      detail: "Awaiting approval",
    },
    {
      id: 4,
      type: "failed" as const,
      message: "RFD-2843 payout failed",
      timestamp: "2 days ago",
      amount: "0.0892 sBTC",
      detail: "Route error",
    },
    {
      id: 5,
      type: "rejected" as const,
      message: "RFD-2842 rejected",
      timestamp: "3 days ago",
      amount: "0.0345 sBTC",
      detail: "Insufficient justification",
    },
  ];
  
  const reversalNotes = [
    {
      id: 1,
      refundId: "RFD-2847",
      note: "Reversal executed successfully. Customer notified via email.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      refundId: "RFD-2843",
      note: "Payout failed due to route error. Retry scheduled.",
      timestamp: "2 days ago",
    },
    {
      id: 3,
      refundId: "RFD-2842",
      note: "Request rejected - customer unable to provide valid justification.",
      timestamp: "3 days ago",
    },
  ];
  
  export function RefundActivity() {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest refund events</p>
              </div>
            </div>
          </div>
  
          <div className="p-6 space-y-3">
            {recentActivities.map((activity) => {
              let icon;
              let iconColor;
  
              switch (activity.type) {
                case "completed":
                  icon = CheckCircle2;
                  iconColor = "text-green-600";
                  break;
                case "processing":
                  icon = Clock;
                  iconColor = "text-purple-600";
                  break;
                case "pending":
                  icon = Clock;
                  iconColor = "text-amber-600";
                  break;
                case "failed":
                  icon = XCircle;
                  iconColor = "text-red-600";
                  break;
                case "rejected":
                  icon = Ban;
                  iconColor = "text-gray-600";
                  break;
                default:
                  icon = FileText;
                  iconColor = "text-gray-600";
              }
  
              const Icon = icon;
  
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium">{activity.message}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{activity.detail}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                      <div className="text-xs font-semibold text-gray-700">{activity.amount}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
  
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reversal Notes</h3>
                <p className="text-sm text-gray-500">Audit trail entries</p>
              </div>
            </div>
          </div>
  
          <div className="p-6 space-y-3">
            {reversalNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <code className="text-xs text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">
                    {note.refundId}
                  </code>
                </div>
                <div className="text-xs text-gray-700 leading-relaxed mb-2">
                  {note.note}
                </div>
                <div className="text-xs text-gray-500">{note.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }