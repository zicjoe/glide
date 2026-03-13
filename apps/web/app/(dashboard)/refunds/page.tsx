import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";

export default function RefundsPage() {
  return (
    <div>
      <AppHeader
        title="Refunds"
        description="Track refund requests tied to failed or reversed settlement flows."
      />

      <div className="p-8">
        <SectionCard
          title="Refund queue"
          description="Refund requests and statuses will appear here."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No refund requests yet.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}