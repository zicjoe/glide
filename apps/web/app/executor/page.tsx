"use client";

import { Button } from "@/components/ui/button";
import { useInvoicesPageSession } from "@/hooks/use-invoices-page-session";
import { useExecutorOps } from "@/hooks/use-executor-ops";
import { INVOICE_STATUS, assetLabel } from "@/lib/contracts/constants";

export default function ExecutorPage() {
  const {
    connected,
    address,
    merchant,
    merchantId,
    loading,
    connecting,
    creatingMerchant,
    error,
    connect,
    disconnect,
    createMerchant,
    invoices,
    settlements,
    refreshAfterWrite,
  } = useInvoicesPageSession();

  const { submitting, message, createSettlement } = useExecutorOps();

  async function handleCreateSettlement(invoiceId: number, grossAmount: number) {
    if (!merchantId) return;

    const ok = await createSettlement({
      merchantId,
      invoiceId,
      grossAmount,
      feeAmount: 0,
    });

    if (ok) {
      await refreshAfterWrite();
    }
  }

  if (loading) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading executor workspace...</div>
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
            Connect an executor wallet to operate settlement actions.
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

  const openInvoices = invoices.filter((invoice) => invoice.status === INVOICE_STATUS.OPEN);

  return (
    <div className="min-h-full px-8 py-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Executor Operations</h1>
        <p className="text-sm text-gray-600 mt-2">
          Internal settlement tooling for Merchant #{merchantId}
        </p>
      </div>

      {message ? (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-sm text-gray-700">
          {message}
        </div>
      ) : null}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Open invoices awaiting action</h2>
        </div>

        {openInvoices.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No open invoices available.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {openInvoices.map((invoice) => (
              <div
                key={invoice.invoiceId}
                className="p-6 flex items-center justify-between gap-6"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {invoice.reference}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Invoice #{invoice.invoiceId} • {invoice.amount} {assetLabel(invoice.asset)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {invoice.description}
                  </div>
                </div>

                <Button
                  onClick={() => void handleCreateSettlement(invoice.invoiceId, invoice.amount)}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Create Settlement"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Recent settlements</h2>
        </div>

        {settlements.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No settlements yet.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {settlements.slice(0, 10).map((settlement) => (
              <div key={settlement.settlementId} className="p-6">
                <div className="text-sm font-semibold text-gray-900">
                  Settlement #{settlement.settlementId}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Invoice #{settlement.invoiceId} • Net {settlement.netAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}