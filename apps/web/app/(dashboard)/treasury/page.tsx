import { AppHeader } from "@/components/shared/app-header";
import { TreasurySettingsClient } from "@/components/treasury/treasury-settings-client";

export default function TreasuryPage() {
  return (
    <div>
      <AppHeader
        title="Treasury"
        description="Configure settlement policy, payout destinations, bucket allocation rules, and idle balance behavior."
      />
      <TreasurySettingsClient />
    </div>
  );
}