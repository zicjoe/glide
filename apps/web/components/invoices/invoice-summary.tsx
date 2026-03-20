"use client";

import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { INVOICE_STATUS } from "@/lib/contracts/constants";

function withinLast30Days(timestamp: number) {
  const now = Math.floor(Date.now() / 1000);
  const thirtyDays = 30 * 24 * 60 * 60;
  return now - timestamp <= thirtyDays;
}

export function InvoiceSummary() {
  const { merchantId } = useMerchantSession();
  const { invoices, loading, error } = useIndexedInvoices(merchantId);

  const totalInvoices = invoices.length;

  const openInvoices = invoices.filter(
    (invoice) => invoice.status === INVOICE_STATUS.OPEN,
  );
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === INVOICE_STATUS.PAID,
  );
  const expiredOrCancelled = invoices.filter(
    (invoice) =>
      invoice.status === INVOICE_STATUS.EXPIRED ||
      invoice.status === INVOICE_STATUS.CANCELLED,
  );

  const openAmount = openInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const paidLast30Days = paidInvoices.filter((invoice) =>
    withinLast30Days(invoice.createdAt),
  ).length;

  const expiredCancelledLast30Days = expiredOrCancelled.filter((invoice) =>
    withinLast30Days(invoice.createdAt),
  ).length;

  const summaryCards = [
    {
      title: "Total Invoices",
      value: loading ? "..." : error ? "—" : String(totalInvoices),
      subValue: "Indexed invoices",
      icon: FileText,
      iconColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
    {
      title: "Open Invoices",
      value: loading ? "..." : error ? "—" : String(openInvoices.length),
      subValue: loading || error ? "Awaiting payment" : `${openAmount} pending`,
      icon: Clock,
      iconColor: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-100",
    },
    {
      title: "Paid Invoices",
      value: loading ? "..." : error ? "—" : String(paidInvoices.length),
      subValue:
        loading || error ? "Indexed paid invoices" : `Last 30 days: ${paidLast30Days}`,
      icon: CheckCircle2,
      iconColor: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconBorder: "border-green-100",
    },
    {
      title: "Expired / Cancelled",
      value: loading ? "..." : error ? "—" : String(expiredOrCancelled.length),
      subValue:
        loading || error
          ? "Closed invoices"
          : `Last 30 days: ${expiredCancelledLast30Days}`,
      icon: XCircle,
      iconColor: "from-gray-600 to-gray-700",
      iconBg: "bg-gray-50",
      iconBorder: "border-gray-200",
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