import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";

export default function ReconciliationPage() {
  return (
    <div>
      <AppHeader
        title="Reconciliation"
        description="Compare expected invoice amounts against actual settlement outcomes."
      />

      <div className="p-8">
        <SectionCard
          title="Reconciliation records"
          description="Matched and mismatched payment records will be shown here."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No reconciliation records yet.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}