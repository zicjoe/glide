import { InvoicesHeader } from "@/components/invoices/invoices-header";
import { InvoiceSummary } from "@/components/invoices/invoice-summary";
import { CreateInvoice } from "@/components/invoices/create-invoice";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoiceActivity } from "@/components/invoices/invoice-activity";

export default function InvoicesPage() {
  return (
    <div className="min-h-full">
      <InvoicesHeader />

      <div className="px-8 py-6 space-y-6">
        <InvoiceSummary />
        <CreateInvoice />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <InvoiceList />
          </div>
          <div className="col-span-1">
            <InvoiceActivity />
          </div>
        </div>
      </div>
    </div>
  );
}