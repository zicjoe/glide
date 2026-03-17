"use client";

import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import { SettlementsHeader } from "@/components/settlements/settlements-header";
import { SettlementSummary } from "@/components/settlements/settlement-summary";
import { SettlementRecords } from "@/components/settlements/settlement-records";
import { AllocationDetail } from "@/components/settlements/allocation-detail";

export default function SettlementsPage() {
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
    settlements,
    allocations,
    loading: settlementsLoading,
    error: settlementsError,
    refetch,
  } = useIndexedSettlements(merchantId);

  const loading = sessionLoading || settlementsLoading;
  const error = sessionError || settlementsError;

  if (loading) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading settlements...</div>
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
            Connect your wallet to access Glide settlements.
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
      <SettlementsHeader />

      <div className="px-8 py-6 space-y-6">
        {error ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-red-700 mb-2">
              Failed to load settlements
            </div>
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <SettlementSummary settlements={settlements} />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <SettlementRecords settlements={settlements} />
              </div>
              <div className="col-span-1">
                <AllocationDetail
                  settlements={settlements}
                  allocations={allocations}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}