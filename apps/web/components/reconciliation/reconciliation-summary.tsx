"use client";

import { FileText, CheckCircle2, AlertTriangle, Target } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { INVOICE_STATUS } from "@/lib/contracts/constants";

export function ReconciliationSummary() {
  const { merchantId } = useMerchantSession();
  const { invoices, loading: invoicesLoading, error: invoicesError } =
    useIndexedInvoices(merchantId);
  const { settlements, loading: settlementsLoading, error: settlementsError } =
    useIndexedSettlements(merchantId);

  const loading = invoicesLoading || settlementsLoading;
  const error = invoicesError || settlementsError;

  const paidInvoices = invoices.filter((invoice) => invoice.status === INVOICE_STATUS.PAID);
  const matchedCount = paidInvoices.filter((invoice) =>
    settlements.some(
      (settlement) =>
        settlement.invoiceId === invoice.invoiceId ||
        settlement.settlementId === invoice.settlementId,
    ),
  ).length;

  const mismatchedCount = Math.max(paidInvoices.length - matchedCount, 0);

  const totalVariance = paidInvoices.reduce((sum, invoice) => {
    const settlement = settlements.find(
      (item) =>
        item.invoiceId === invoice.invoiceId ||
        item.settlementId === invoice.settlementId,
    );
    if (!settlement) return sum;
    return sum + Math.max(invoice.amount - settlement.netAmount, 0);
  }, 0);

  const summaryCards = [
    {
      title: "Total Records",
      value: loading ? "..." : error ? "—" : String(paidInvoices.length),
      subValue: "Paid invoices under reconciliation",
      icon: FileText,
      iconColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
    {
      title: "Matched Records",
      value: loading ? "..." : error ? "—" : String(matchedCount),
      subValue:
        loading || error || paidInvoices.length === 0
          ? "Indexed match count"
          : `${Math.round((matchedCount / paidInvoices.length) * 100)}% accuracy`,
      icon: CheckCircle2,
      iconColor: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconBorder: "border-green-100",
    },
    {
      title: "Mismatched Records",
      value: loading ? "..." : error ? "—" : String(mismatchedCount),
      subValue: "Requires review",
      icon: AlertTriangle,
      iconColor: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-100",
    },
    {
      title: "Total Variance",
      value: loading ? "..." : error ? "—" : String(totalVariance),
      subValue: "Invoice amount minus net settlement",
      icon: Target,
      iconColor: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      iconBorder: "border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.iconColor} ${card.iconBg} border ${card.iconBorder} flex items-center justify-center shadow-sm`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {card.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600">{card.subValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
