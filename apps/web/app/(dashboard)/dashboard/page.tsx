import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";

export default function DashboardPage() {
  return (
    <div>
      <AppHeader
        title="Dashboard"
        description="Monitor settlements, treasury activity, and idle balance deployment."
      />

      <div className="space-y-6 p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <SectionCard title="Total settled" description="Gross merchant settlement volume.">
            <p className="text-2xl font-semibold text-zinc-950">$0.00</p>
          </SectionCard>

          <SectionCard title="Liquid balance" description="Available balance across active buckets.">
            <p className="text-2xl font-semibold text-zinc-950">$0.00</p>
          </SectionCard>

          <SectionCard title="Deployed balance" description="Funds currently allocated to yield.">
            <p className="text-2xl font-semibold text-zinc-950">$0.00</p>
          </SectionCard>
        </div>

        <SectionCard
          title="Recent settlement activity"
          description="Settlements and allocation updates will appear here once payment flows are wired."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No settlement activity yet.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}