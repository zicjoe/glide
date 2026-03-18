"use client";

import {
  RefreshCcw,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Ban,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { IndexedRefund } from "@/hooks/use-indexed-refunds";
import { assetLabel } from "@/lib/contracts/constants";

type Props = {
  refunds: IndexedRefund[];
};

const statusConfig: Record<
  string,
  {
    icon: any;
    label: string;
    iconColor: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  PENDING: {
    icon: Clock,
    label: "Pending",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  APPROVED: {
    icon: CheckCircle2,
    label: "Approved",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  PROCESSING: {
    icon: Loader2,
    label: "Processing",
    iconColor: "text-purple-600",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  COMPLETED: {
    icon: CheckCircle2,
    label: "Completed",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  FAILED: {
    icon: XCircle,
    label: "Failed",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  REJECTED: {
    icon: Ban,
    label: "Rejected",
    iconColor: "text-gray-600",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
};

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function RefundRecords({ refunds }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <RefreshCcw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Refund Records</h3>
            <p className="text-sm text-gray-500">Payment reversal and payout status</p>
          </div>
        </div>
      </div>

      {refunds.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No refund records yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice / Settlement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refunds.map((refund) => {
                const config = statusConfig[refund.status] ?? statusConfig.PENDING;
                const StatusIcon = config.icon;

                return (
                  <tr key={refund.refundId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{refund.refundId}</div>
                        <div className="text-xs text-gray-500">{createdLabel(refund.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Invoice #{refund.invoiceId ?? "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Settlement #{refund.settlementId ?? "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                        {assetLabel(refund.asset)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {refund.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}>
                        <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor} ${refund.status === "PROCESSING" ? "animate-spin" : ""}`} />
                        <span className={`text-xs font-semibold ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{refund.requestedBy ?? "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/refunds/${refund.refundId}`}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 inline-flex"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
