"use client";

import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedTreasury } from "@/hooks/use-indexed-treasury";
import { TreasuryHeader } from "@/components/treasury/treasury-header";
import { SettlementDefaults } from "@/components/treasury/settlement-defaults";
import { PayoutDestinations } from "@/components/treasury/payout-destinations";
import { TreasuryBuckets } from "@/components/treasury/treasury-buckets";
import { PolicyStatus } from "@/components/treasury/policy-status";
import { Button } from "@/components/ui/button";

export default function TreasuryPage() {
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
    policy,
    destinations,
    buckets,
    policyValid,
    loading: treasuryLoading,
    error: treasuryError,
    refetch,
  } = useIndexedTreasury(connected && merchant ? merchant.owner : null);

  const loading = sessionLoading || treasuryLoading;
  const error = sessionError || treasuryError;

  if (loading) {
    return (
      <div className="min-h-full px-8 py-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading treasury data...</div>
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
            Connect your wallet to access your Glide treasury workspace.
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
      <TreasuryHeader />

      <div className="px-8 py-6 space-y-6">
        {error ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-red-700 mb-2">
              Failed to load treasury
            </div>
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <SettlementDefaults policy={policy} merchant={merchant} />
            <PayoutDestinations destinations={destinations} />
            <TreasuryBuckets buckets={buckets} destinations={destinations} />
            <PolicyStatus
              buckets={buckets}
              destinations={destinations}
              policy={policy}
              policyValid={policyValid}
            />
          </>
        )}
      </div>
    </div>
  );
}
