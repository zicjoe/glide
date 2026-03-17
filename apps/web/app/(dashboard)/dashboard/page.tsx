"use client";

import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { RecentSettlements } from "@/components/dashboard/recent-settlements";
import { TreasuryAllocation } from "@/components/dashboard/treasury-allocation";
import { YieldDeployment } from "@/components/dashboard/yield-deployment";
import { ReconciliationStatus } from "@/components/dashboard/reconciliation-status";

export default function DashboardPage() {
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
  } = useMerchantSession();

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
            Connect your wallet to access Glide and initialize your merchant workspace.
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
          <p className="text-sm text-gray-600">
            This wallet does not have a Glide merchant account yet.
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
      <DashboardHeader />

      <div className="px-8 py-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-600">
            Merchant #{merchantId} connected to{" "}
            <span className="font-medium text-gray-900">{merchant.owner}</span>
          </div>
        </div>

        <MetricCards />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <RecentSettlements />
          </div>

          <div className="col-span-1">
            <TreasuryAllocation />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <YieldDeployment />
          </div>

          <div className="col-span-1">
            <ReconciliationStatus />
          </div>
        </div>
      </div>
    </div>
  );
}