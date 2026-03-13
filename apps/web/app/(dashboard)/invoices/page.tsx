import { AppHeader } from "@/components/shared/app-header";
import { InvoicesClient } from "@/components/invoices/invoices-client";

export default function InvoicesPage() {
  return (
    <div>
      <AppHeader
        title="Invoices"
        description="Create payment requests, monitor invoice state, and open checkout links."
      />
      <InvoicesClient />
    </div>
  );
}