import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";

export default function SettlementsPage() {
  return (
    <div>
      <AppHeader
        title="Settlements"
        description="Review payment execution, settlement outcomes, and allocation records."
      />

      <div className="p-8">
        <SectionCard
          title="Settlement records"
          description="Detailed settlement results will be rendered here."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No settlement records yet.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}