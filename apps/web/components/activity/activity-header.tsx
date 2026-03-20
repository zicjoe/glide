"use client";

import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedActivity } from "@/hooks/use-indexed-activity";

export function ActivityHeader() {
  const { merchantId } = useMerchantSession();
  const { refetch, loading } = useIndexedActivity(merchantId, 50);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Activity</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Review indexed operational events, treasury actions, settlement updates, and audit history across merchant operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled
            className="h-10 px-5 text-sm border-gray-300 text-gray-500 bg-white shadow-sm font-medium"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            disabled
            className="h-10 px-5 text-sm border-gray-300 text-gray-500 bg-white shadow-sm font-medium"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => void refetch()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all font-medium"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
    </div>
  );
}