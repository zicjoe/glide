import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Monitor settlement activity, track treasury allocation across buckets, and manage idle balance deployment into yield strategies.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 px-5 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm hover:shadow font-medium"
          >
            <Link href="/invoices">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>

          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all font-medium"
          >
            <Link href="/settlements">
              <Plus className="mr-2 h-4 w-4" />
              New Settlement
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}