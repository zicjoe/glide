"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedInvoices } from "@/hooks/use-indexed-invoices";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { assetLabel } from "@/lib/contracts/constants";

export default function ReconciliationDetailPage() {
  const params = useParams<{ id: string }>();
  const reconciliationId = params.id;

  const {
    connected,
    address,
    merchant,
    merchantId,
    loading: sessionLoading,
    connecting,
    creatingMerchant,
    error: sessionError,
    connect,
    disconnect,
    createMerchant,
  } = useMerchantSession();

  const { invoices, loading: invoicesLoading, error: invoicesError } =
    useIndexedInvoices(merchantId);
  const { settlements, loading: settlementsLoading, error: settlementsError } =
    useIndexedSettlements(merchantId);

  const loading = sessionLoading || invoicesLoading || settlementsLoading;
  const error = sessionError || invoicesError || settlementsError;

  if (loading) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading reconciliation detail...</div>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900">Connect wallet</h1>
          <p className="text-sm text-gray-600">
            Connect your wallet to access reconciliation details.
          </p>
          <Button onClick={() => void connect()} disabled={connecting}>
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    );
  }

  if (!merchantId || !merchant) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900">Create merchant account</h1>
          <p className="text-sm text-gray-600">
            Wallet connected: <span className="font-medium text-gray-900">{address}</span>
          </p>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="flex gap-3">
            <Button onClick={() => void createMerchant()} disabled={creatingMerchant}>
              {creatingMerchant ? "Creating..." : "Create Merchant Account"}
            </Button>
            <Button variant="outline" onClick={() => void disconnect()}>
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm font-semibold text-red-700 mb-2">
            Failed to load reconciliation detail
          </div>
          <div className="text-sm text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  const recordId = reconciliationId.replace("REC-", "");
  const invoiceId = Number(recordId);
  const invoice = invoices.find((item) => item.invoiceId === invoiceId) ?? null;
  const settlement = invoice
    ? settlements.find((item) => item.invoiceId === invoice.invoiceId) ??
      settlements.find((item) => item.settlementId === invoice.settlementId) ??
      null
    : null;

  if (!invoice) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{reconciliationId}</h1>
          <p className="text-sm text-gray-600">Reconciliation record not found in indexed data.</p>
        </div>
      </div>
    );
  }

  const variance = settlement ? Math.max(invoice.amount - settlement.netAmount, 0) : invoice.amount;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{reconciliationId}</h1>
        <p className="text-sm text-gray-600">
          Indexed reconciliation detail derived from invoice and settlement data.
        </p>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">Invoice Reference</div>
              <div className="text-sm font-semibold text-gray-900">{invoice.reference}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Asset</div>
              <div className="text-sm font-semibold text-gray-900">
                {assetLabel(invoice.asset)}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Expected Amount</div>
              <div className="text-sm font-semibold text-gray-900">{invoice.amount}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Actual Amount</div>
              <div className="text-sm font-semibold text-gray-900">
                {settlement ? settlement.netAmount : "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Fee Amount</div>
              <div className="text-sm font-semibold text-gray-900">
                {settlement ? settlement.feeAmount : "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Variance</div>
              <div className="text-sm font-semibold text-gray-900">{variance}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Settlement ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {settlement ? settlement.settlementId : "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Invoice Status</div>
              <div className="text-sm font-semibold text-gray-900">{invoice.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
