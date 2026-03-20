"use client";

import {
  TrendingUp,
  Wallet,
  FileText,
  DollarSign,
} from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { INVOICE_STATUS, assetLabel } from "@/lib/contracts/constants";

export function MetricCards() {
  const { merchantId } = useMerchantSession();

  const { invoices, loading: invoicesLoading, error: invoicesError } =
    useIndexedInvoices(merchantId);
  const { settlements, loading: settlementsLoading, error: settlementsError } =
    useIndexedSettlements(merchantId);
  const { balances, loading: yieldLoading, error: yieldError } =
    useIndexedYield(merchantId);

  const loading = invoicesLoading || settlementsLoading || yieldLoading;
  const error = invoicesError || settlementsError || yieldError;

  const totalSettled = settlements.reduce((sum, item) => sum + item.netAmount, 0);

  const liquidBalance = balances.reduce(
    (sum, item) => sum + item.available,
    0,
  );

  const deployedBalance = balances.reduce(
    (sum, item) => sum + item.deployed,
    0,
  );

  const openInvoices = invoices.filter(
    (invoice) => invoice.status === INVOICE_STATUS.OPEN,
  );
  const openInvoiceCount = openInvoices.length;
  const openInvoiceAmount = openInvoices.reduce((sum, item) => sum + item.amount, 0);

  const primarySettlementAsset =
    settlements.length > 0 ? assetLabel(settlements[0].asset) : "units";

  const metrics = [
    {
      title: "Total Settled",
      value: loading ? "..." : error ? "—" : `${totalSettled}`,
      subValue: loading || error ? "Indexed settlements" : `${primarySettlementAsset} net settled`,
      icon: DollarSign,
      iconColor: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
    {
      title: "Liquid Balance",
      value: loading ? "..." : error ? "—" : `${liquidBalance}`,
      subValue: "Available vault balance",
      icon: Wallet,
      iconColor: "from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconBorder: "border-green-100",
    },
    {
      title: "Deployed Balance",
      value: loading ? "..." : error ? "—" : `${deployedBalance}`,
      subValue: "Actively deployed to yield",
      icon: TrendingUp,
      iconColor: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      iconBorder: "border-purple-100",
    },
    {
      title: "Open Invoices",
      value: loading ? "..." : error ? "—" : `${openInvoiceCount}`,
      subValue: loading || error ? "Awaiting payment" : `${openInvoiceAmount} pending`,
      icon: FileText,
      iconColor: "from-gray-600 to-gray-700",
      iconBg: "bg-gray-50",
      iconBorder: "border-gray-200",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${metric.iconColor} ${metric.iconBg} border ${metric.iconBorder} flex items-center justify-center shadow-sm`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {metric.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {metric.value}
              </p>
              <p className="text-sm text-gray-600">{metric.subValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
