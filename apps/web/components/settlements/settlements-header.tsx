import { Button } from "@/components/ui/button";
import { Download, Filter, Plus } from "lucide-react";

export function SettlementsHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settlements</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Review payment execution, settlement outcomes, and treasury allocation records for merchant transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-5 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm hover:shadow font-medium"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            className="h-10 px-5 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm hover:shadow font-medium"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all font-medium">
            <Plus className="mr-2 h-4 w-4" />
            New Settlement
          </Button>
        </div>
      </div>
    </div>
  );
}