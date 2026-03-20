"use client";

import { Wallet, Plus, MoreVertical, TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PayoutDestination, TreasuryBucket } from "@/lib/contracts/types";
import { IDLE_MODE } from "@/lib/contracts/constants";

type TreasuryBucketsProps = {
  buckets: TreasuryBucket[];
  destinations: PayoutDestination[];
};

const colorConfig = {
  0: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  1: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: "from-gray-600 to-gray-700",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
  },
  2: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "from-green-500 to-green-600",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
} as const;

export function TreasuryBuckets({
  buckets,
  destinations,
}: TreasuryBucketsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Treasury Buckets</h3>
              <p className="text-sm text-gray-500">Configure allocation and idle balance behavior</p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled
            className="h-9 px-4 text-sm border-gray-300 text-gray-500 bg-white shadow-sm font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Bucket
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {buckets.length === 0 ? (
          <div className="text-sm text-gray-500">No treasury buckets found onchain yet.</div>
        ) : (
          buckets.map((bucket, index) => {
            const colors = colorConfig[(index % 3) as keyof typeof colorConfig];
            const destination = destinations.find(
              (item) => item.destinationId === bucket.destinationId,
            );

            return (
              <div
                key={bucket.bucketId}
                className={`p-5 rounded-xl border ${colors.border} ${colors.bg} transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-sm flex-shrink-0`}>
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-semibold text-gray-900">{bucket.name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colors.badge}`}>
                          {(bucket.allocationBps / 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        → {destination?.label ?? "Unknown destination"}{" "}
                        <span className="text-gray-400">
                          ({destination?.destination ?? "Unresolved"})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bucket.idleMode === IDLE_MODE.EARN ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 border border-green-200 rounded-md">
                            <TrendingUp className="h-3.5 w-3.5 text-green-700" />
                            <span className="text-xs font-semibold text-green-700">EARN Mode</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-md">
                            <Lock className="h-3.5 w-3.5 text-gray-600" />
                            <span className="text-xs font-semibold text-gray-600">HOLD Mode</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-medium text-gray-600">Enabled</Label>
                      <Switch checked={bucket.enabled} disabled />
                    </div>
                    <button
                      type="button"
                      disabled
                      className="text-gray-300 cursor-default"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-2 block">
                      Allocation %
                    </Label>
                    <Input
                      type="number"
                      value={(bucket.allocationBps / 100).toFixed(0)}
                      readOnly
                      className="text-sm h-9 bg-gray-50"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-gray-600 mb-2 block">
                      Idle Balance Behavior
                    </Label>
                    <div className="flex gap-2">
                      <button
                        disabled
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-default ${
                          bucket.idleMode === IDLE_MODE.HOLD
                            ? "border-2 border-gray-600 bg-gray-100 text-gray-700"
                            : "border border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        HOLD
                      </button>
                      <button
                        disabled
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-default ${
                          bucket.idleMode === IDLE_MODE.EARN
                            ? "border-2 border-green-600 bg-green-100 text-green-700"
                            : "border border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        EARN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
