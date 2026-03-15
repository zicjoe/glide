import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";

export function TreasuryHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Treasury
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Configure settlement policy, payout destinations, treasury bucket
            allocation, and idle balance deployment behavior.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-5 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm hover:shadow font-medium"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Changes
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all font-medium">
            <Save className="mr-2 h-4 w-4" />
            Save Policy
          </Button>
        </div>
      </div>
    </div>
  );
}