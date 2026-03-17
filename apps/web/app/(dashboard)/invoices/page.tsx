"use client";

import { Button } from "@/components/ui/button";
import { InvoicesHeader } from "@/components/invoices/invoices-header";
import { InvoiceSummary } from "@/components/invoices/invoice-summary";
import { CreateInvoice } from "@/components/invoices/create-invoice";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoiceActivity } from "@/components/invoices/invoice-activity";
import { useInvoicesPageSession } from "@/hooks/use-invoices-page-session";

export default function InvoicesPage() {
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
    invoicesLoading,
    invoicesError,
    refreshAfterWrite,
  } = useInvoicesPageSession();

  if (loading) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading merchant session...</div>
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
            Connect your wallet to access Glide invoices.
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

  return (
    <div className="min-h-full">
      <InvoicesHeader />

      <div className="px-8 py-6 space-y-6">
        <InvoiceSummary />
        <CreateInvoice
          merchantId={merchantId}
          onCreated={async () => {
            await refreshAfterWrite();
          }}
        />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <InvoiceList
              invoices={invoices}
              loading={invoicesLoading}
              error={invoicesError}
            />
          </div>
          <div className="col-span-1">
            <InvoiceActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
