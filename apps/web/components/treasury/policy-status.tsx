"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import type {
  PayoutDestination,
  TreasuryBucket,
  TreasuryPolicy,
} from "@/lib/contracts/types";

type PolicyStatusProps = {
  buckets: TreasuryBucket[];
  destinations: PayoutDestination[];
  policy: TreasuryPolicy | null;
  policyValid: boolean | null;
};

export function PolicyStatus({
  buckets,
  destinations,
  policy,
  policyValid,
}: PolicyStatusProps) {
  const totalAllocation = buckets
    .filter((bucket) => bucket.enabled)
    .reduce((sum, bucket) => sum + bucket.allocationBps, 0);

  const activeDestinations = destinations.filter((item) => item.enabled).length;
  const isValid = policyValid ?? totalAllocation === 10000;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Policy Validation</h3>
            <p className="text-sm text-gray-500">Configuration status and validation</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className={`p-5 rounded-xl border ${
            isValid ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {isValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              <span className={`text-sm font-semibold ${
                isValid ? "text-green-900" : "text-amber-900"
              }`}>
                Total Allocation
              </span>
            </div>
            <div className={`text-3xl font-semibold mb-1 ${
              isValid ? "text-green-700" : "text-amber-700"
            }`}>
              {(totalAllocation / 100).toFixed(0)}%
            </div>
            <p className={`text-xs ${
              isValid ? "text-green-600" : "text-amber-600"
            }`}>
              {isValid ? "Enabled bucket allocation is balanced" : "Enabled buckets must total exactly 100%"}
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Active Destinations
              </span>
            </div>
            <div className="text-3xl font-semibold text-blue-700 mb-1">
              {activeDestinations} / {destinations.length}
            </div>
            <p className="text-xs text-blue-600">
              Indexed destinations currently enabled
            </p>
          </div>

          <div className={`p-5 rounded-xl border ${
            isValid ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {isValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Info className="h-5 w-5 text-gray-500" />
              )}
              <span className={`text-sm font-semibold ${
                isValid ? "text-green-900" : "text-gray-700"
              }`}>
                Policy Status
              </span>
            </div>
            <div className={`text-lg font-semibold mb-1 ${
              isValid ? "text-green-700" : "text-gray-600"
            }`}>
              {policy ? "Loaded from chain" : "Not yet written"}
            </div>
            <p className={`text-xs ${
              isValid ? "text-green-600" : "text-gray-500"
            }`}>
              {policy ? "Current policy is indexed and visible" : "Write a treasury policy to activate defaults"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${
            policy ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
          }`}>
            {policy ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className={`text-sm font-semibold mb-1 ${
                policy ? "text-green-900" : "text-gray-800"
              }`}>
                Settlement defaults
              </div>
              <div className={`text-xs ${
                policy ? "text-green-700" : "text-gray-600"
              }`}>
                {policy
                  ? "Settlement defaults are present and indexed"
                  : "No settlement policy has been written yet"}
              </div>
            </div>
          </div>

          <div className={`flex items-start gap-3 p-4 rounded-lg border ${
            buckets.length > 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
          }`}>
            {buckets.length > 0 ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className={`text-sm font-semibold mb-1 ${
                buckets.length > 0 ? "text-green-900" : "text-gray-800"
              }`}>
                Treasury buckets
              </div>
              <div className={`text-xs ${
                buckets.length > 0 ? "text-green-700" : "text-gray-600"
              }`}>
                {buckets.length > 0
                  ? "Treasury buckets are configured and indexed"
                  : "No treasury buckets configured yet"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-blue-900 mb-1">
                Yield deployment threshold
              </div>
              <div className="text-xs text-blue-700">
                {policy
                  ? `Current indexed threshold is ${policy.yieldThreshold}`
                  : "Threshold will appear after policy is loaded"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
