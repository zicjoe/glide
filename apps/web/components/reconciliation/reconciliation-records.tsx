"use client";

import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { INVOICE_STATUS, assetLabel } from "@/lib/contracts/constants";

const statusConfig = {
  matched: {
    icon: CheckCircle2,
    label: "Matched",
    iconColor: "text-green-600",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  mismatched: {
    icon: AlertTriangle,
    label: "Mismatched",
    iconColor: "text-red-600",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  review: {
    icon: Clock,
    label: "Review",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function ReconciliationRecords() {
  const { merchantId } = useMerchantSession();
  const { invoices, loading: invoicesLoading, error: invoicesError } =
    useIndexedInvoices(merchantId);
  const { settlements, loading: settlementsLoading, error: settlementsError } =
    useIndexedSettlements(merchantId);

  const loading = invoicesLoading || settlementsLoading;
  const error = invoicesError || settlementsError;

  const records = invoices
    .filter((invoice) => invoice.status === INVOICE_STATUS.PAID)
    .map((invoice) => {
      const settlement =
        settlements.find((item) => item.invoiceId === invoice.invoiceId) ??
        settlements.find((item) => item.settlementId === invoice.settlementId) ??
        null;

      const actualAmount = settlement ? settlement.netAmount : 0;
      const feeAmount = settlement ? settlement.feeAmount : 0;
      const variance = Math.max(invoice.amount - actualAmount, 0);

      let status: keyof typeof statusConfig = "review";
      if (settlement && variance === 0) status = "matched";
      else if (settlement && variance > 0) status = "mismatched";

      return {
        id: `REC-${invoice.invoiceId}`,
        invoiceRef: invoice.reference,
        settlementId: settlement ? `STL-${settlement.settlementId}` : "—",
        expectedAmount: invoice.amount,
        actualAmount,
        feeAmount,
        variance,
        asset: assetLabel(invoice.asset),
        status,
        createdTime: createdLabel(invoice.createdAt),
      };
    })
    .sort((a, b) => b.expectedAmount - a.expectedAmount);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reconciliation Records</h3>
            <p className="text-sm text-gray-500">Invoice and settlement matching results</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading reconciliation records...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : records.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No paid invoice records yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rec ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settlement ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => {
                const config = statusConfig[record.status];
                const StatusIcon = config.icon;
                const hasVariance = record.variance > 0;

                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{record.id}</div>
                        <div className="text-xs text-gray-500">{record.createdTime}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.invoiceRef}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.settlementId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {record.expectedAmount} {record.asset}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {record.actualAmount} {record.asset}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{record.feeAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-semibold ${
                          hasVariance ? "text-red-700" : "text-gray-400"
                        }`}
                      >
                        {hasVariance ? `+${record.variance}` : "0"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} border ${config.borderColor}`}
                      >
                        <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor}`} />
                        <span className={`text-xs font-semibold ${config.textColor}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/reconciliation/${record.id}`}
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
