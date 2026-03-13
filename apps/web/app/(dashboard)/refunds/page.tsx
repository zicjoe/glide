import { AppHeader } from "@/components/shared/app-header";
import { RefundsClient } from "@/components/refunds/refunds-client";

export default function RefundsPage() {
  return (
    <div>
      <AppHeader
        title="Refunds"
        description="Track refund requests tied to failed or reversed settlement flows."
      />
      <RefundsClient />
    </div>
  );
}