"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedRefunds } from "@/hooks/use-indexed-refunds";
import { assetLabel } from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const date = new Date(createdAt * 1000);
  return date.toLocaleString();
}

export default function RefundDetailPage() {
  const params = useParams<{ id: string }>();
  const refundId = params.id;

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

  const {
    refunds,
    loading: refundsLoading,
    error: refundsError,
    refetch,
  } = useIndexedRefunds(merchantId);

  const loading = sessionLoading || refundsLoading;
  const error = sessionError || refundsError;

  if (loading) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading refund detail...</div>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900">Connect wallet</h1>
          <p className="text-sm text-gray-600">Connect your wallet to access refund details.</p>
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
            Failed to load refund detail
          </div>
          <div className="text-sm text-red-600 mb-4">{error}</div>
          <Button variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const refund = refunds.find((item) => item.refundId === refundId) ?? null;

  if (!refund) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{refundId}</h1>
          <p className="text-sm text-gray-600">Refund record not found in indexed data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{refund.refundId}</h1>
        <p className="text-sm text-gray-600">
          Indexed refund detail and operational status.
        </p>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="text-sm font-semibold text-gray-900">{refund.status}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Asset</div>
              <div className="text-sm font-semibold text-gray-900">
                {assetLabel(refund.asset)}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Amount</div>
              <div className="text-sm font-semibold text-gray-900">{refund.amount}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Requested By</div>
              <div className="text-sm font-semibold text-gray-900">
                {refund.requestedBy ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Invoice ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {refund.invoiceId ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Settlement ID</div>
              <div className="text-sm font-semibold text-gray-900">
                {refund.settlementId ?? "—"}
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-xs text-gray-500 mb-1">Destination</div>
              <div className="text-sm font-mono text-gray-900 break-all">
                {refund.destination}
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-xs text-gray-500 mb-1">Reason</div>
              <div className="text-sm text-gray-800">{refund.reason}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Created At</div>
              <div className="text-sm text-gray-900">{createdLabel(refund.createdAt)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Updated At</div>
              <div className="text-sm text-gray-900">{createdLabel(refund.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
