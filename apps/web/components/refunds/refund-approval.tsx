"use client";

import { ClipboardCheck, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { IndexedRefund } from "@/hooks/use-indexed-refunds";
import { assetLabel } from "@/lib/contracts/constants";

type Props = {
  refunds: IndexedRefund[];
};

const priorityConfig = {
  high: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    badgeBorder: "border-red-300",
  },
  medium: {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-300",
  },
  low: {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-300",
  },
};

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

function priorityFor(refund: IndexedRefund): keyof typeof priorityConfig {
  if (refund.amount >= 100000) return "high";
  if (refund.amount >= 10000) return "medium";
  return "low";
}

export function RefundApproval({ refunds }: Props) {
  const pendingRefunds = refunds.filter((r) => r.status === "PENDING");

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Refund Approval Queue</h3>
              <p className="text-sm text-gray-500">Items awaiting review and approval</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{pendingRefunds.length}</span> pending
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {pendingRefunds.length === 0 ? (
          <div className="text-sm text-gray-600">No pending refund approvals.</div>
        ) : (
          pendingRefunds.map((refund) => {
            const priority = priorityFor(refund);
            const config = priorityConfig[priority];

            return (
              <div
                key={refund.refundId}
                className={`p-5 rounded-xl border ${config.borderColor} ${config.bgColor}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Flag className={`h-5 w-5 ${config.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{refund.refundId}</span>
                        <span className="text-xs text-gray-500">
                          • Invoice #{refund.invoiceId ?? "—"}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}>
                          {priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 mb-2">{refund.reason}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="h-3.5 w-3.5" />
                        {refund.requestedBy ?? "Unknown"}
                        <span className="text-gray-400">•</span>
                        {createdLabel(refund.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Asset</div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                      {assetLabel(refund.asset)}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Refund Amount</div>
                    <div className="text-sm font-semibold text-gray-900">{refund.amount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Destination</div>
                    <div className="text-sm font-semibold text-gray-900 break-all">{refund.destination}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button disabled className="h-9 px-4 text-sm bg-green-600 text-white shadow-sm font-medium flex-1 opacity-60">
                    Approve
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    className="h-9 px-4 text-sm border-gray-300 text-gray-700 shadow-sm font-medium flex-1 opacity-60"
                  >
                    Reject
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-9 px-4 text-sm border-gray-300 text-gray-700 shadow-sm font-medium"
                  >
                    <Link href={`/refunds/${refund.refundId}`}>View Detail</Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
