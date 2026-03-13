import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";

export default function YieldPage() {
  return (
    <div>
      <AppHeader
        title="Yield"
        description="Track idle-balance policies and active deployed positions."
      />

      <div className="grid gap-6 p-8 lg:grid-cols-2">
        <SectionCard
          title="Deployment overview"
          description="Bucket-level deployment visibility will appear here."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No active positions yet.
          </div>
        </SectionCard>

        <SectionCard
          title="Strategy status"
          description="Strategy selection and deployment status will be added later."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No strategy data yet.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}