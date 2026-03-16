"use client";

import { useMerchant } from "@/hooks/use-merchant";
import { useTreasury } from "@/hooks/use-treasury";
import { TreasuryHeader } from "@/components/treasury/treasury-header";
import { SettlementDefaults } from "@/components/treasury/settlement-defaults";
import { PayoutDestinations } from "@/components/treasury/payout-destinations";
import { TreasuryBuckets } from "@/components/treasury/treasury-buckets";
import { PolicyStatus } from "@/components/treasury/policy-status";

export default function TreasuryPage() {
  const merchantOwner = process.env.NEXT_PUBLIC_GLIDE_MERCHANT_OWNER || null;

  const {
    merchant,
    merchantId,
    loading: merchantLoading,
    error: merchantError,
  } = useMerchant({
    owner: merchantOwner,
    enabled: Boolean(merchantOwner),
  });

  const {
    policy,
    destinations,
    buckets,
    policyValid,
    loading: treasuryLoading,
    error: treasuryError,
    refetch,
  } = useTreasury({
    merchantId,
    enabled: Boolean(merchantId),
  });

  const loading = merchantLoading || treasuryLoading;
  const error = merchantError || treasuryError;

  return (
    <div className="min-h-full">
      <TreasuryHeader />

      <div className="px-8 py-6 space-y-6">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600">Loading treasury data...</div>
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-red-700 mb-2">
              Failed to load treasury
            </div>
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <button
              onClick={() => void refetch()}
              className="px-4 py-2 text-sm rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !merchantId || !merchant ? (
          <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-amber-800 mb-2">
              Merchant not found
            </div>
            <div className="text-sm text-amber-700">
              Check your NEXT_PUBLIC_GLIDE_MERCHANT_OWNER value or register the merchant onchain first.
            </div>
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