import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export function InvoicesHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invoices</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Create payment requests, monitor invoice status, and manage checkout links for merchant settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-5 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm hover:shadow font-medium"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}