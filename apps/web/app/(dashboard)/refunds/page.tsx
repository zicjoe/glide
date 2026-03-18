"use client";

import { Button } from "@/components/ui/button";
import { RefundsHeader } from "@/components/refunds/refunds-header";
import { RefundSummary } from "@/components/refunds/refund-summary";
import { RefundRecords } from "@/components/refunds/refund-records";
import { RefundApproval } from "@/components/refunds/refund-approval";
import { RefundHealth } from "@/components/refunds/refund-health";
import { RefundActivity } from "@/components/refunds/refund-activity";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedRefunds } from "@/hooks/use-indexed-refunds";

export default function RefundsPage() {
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
          <div className="text-sm text-gray-600">Loading refunds...</div>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-4 max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900">Connect wallet</h1>
          <p className="text-sm text-gray-600">Connect your wallet to access Glide refunds.</p>
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
      <RefundsHeader />

      <div className="px-8 py-6 space-y-6">
        {error ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-red-700 mb-2">
              Failed to load refunds
            </div>
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <RefundSummary refunds={refunds} />

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <RefundRecords refunds={refunds} />
                <RefundApproval refunds={refunds} />
              </div>

              <div className="col-span-1 space-y-6">
                <RefundHealth refunds={refunds} />
                <RefundActivity refunds={refunds} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
