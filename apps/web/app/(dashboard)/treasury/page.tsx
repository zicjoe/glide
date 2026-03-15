import { TreasuryHeader } from "@/components/treasury/treasury-header";
import { SettlementDefaults } from "@/components/treasury/settlement-defaults";
import { PayoutDestinations } from "@/components/treasury/payout-destinations";
import { TreasuryBuckets } from "@/components/treasury/treasury-buckets";
import { PolicyStatus } from "@/components/treasury/policy-status";

export default function TreasuryPage() {
  return (
    <div className="min-h-full">
      <TreasuryHeader />

      <div className="px-8 py-6 space-y-6">
        <SettlementDefaults />
        <PayoutDestinations />
        <TreasuryBuckets />
        <PolicyStatus />
      </div>
    </div>
  );
}