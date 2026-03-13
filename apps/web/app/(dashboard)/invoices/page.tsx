import { AppHeader } from "@/components/shared/app-header";
import { SectionCard } from "@/components/shared/section-card";

export default function InvoicesPage() {
  return (
    <div>
      <AppHeader
        title="Invoices"
        description="Create payment requests and monitor invoice lifecycle."
      />

      <div className="p-8">
        <SectionCard
          title="Invoice workspace"
          description="Invoice creation and listing will be added in the next implementation pass."
        >
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-sm text-zinc-500">
            No invoice data yet.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}