"use client";

import {
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  FileText,
  AlertTriangle,
} from "lucide-react";
import type { IndexedRefund } from "@/hooks/use-indexed-refunds";

type Props = {
  refunds: IndexedRefund[];
};

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function RefundActivity({ refunds }: Props) {
  const recent = refunds.slice(0, 5);

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
          {recent.length === 0 ? (
            <div className="text-sm text-gray-600">No refund activity yet.</div>
          ) : (
            recent.map((refund) => {
              let Icon = FileText;
              let iconColor = "text-gray-600";
              let detail = refund.reason;

              switch (refund.status) {
                case "COMPLETED":
                  Icon = CheckCircle2;
                  iconColor = "text-green-600";
                  detail = "Refund completed";
                  break;
                case "PROCESSING":
                  Icon = Clock;
                  iconColor = "text-purple-600";
                  detail = "Processing started";
                  break;
                case "PENDING":
                  Icon = Clock;
                  iconColor = "text-amber-600";
                  detail = "Awaiting approval";
                  break;
                case "FAILED":
                  Icon = XCircle;
                  iconColor = "text-red-600";
                  detail = "Refund failed";
                  break;
                case "REJECTED":
                  Icon = Ban;
                  iconColor = "text-gray-600";
                  detail = "Refund rejected";
                  break;
              }

              return (
                <div
                  key={refund.refundId}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium">
                      {refund.refundId} {refund.status.toLowerCase()}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{detail}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">{createdLabel(refund.createdAt)}</div>
                      <div className="text-xs font-semibold text-gray-700">{refund.amount}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
              <p className="text-sm text-gray-500">Indexed refund reasons</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {recent.length === 0 ? (
            <div className="text-sm text-gray-600">No reversal notes yet.</div>
          ) : (
            recent.map((refund) => (
              <div key={refund.refundId} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <code className="text-xs text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">
                    {refund.refundId}
                  </code>
                </div>
                <div className="text-xs text-gray-700 leading-relaxed mb-2">
                  {refund.reason}
                </div>
                <div className="text-xs text-gray-500">{createdLabel(refund.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
