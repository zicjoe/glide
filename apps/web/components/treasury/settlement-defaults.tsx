"use client";

import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import type { Merchant, TreasuryPolicy } from "@/lib/contracts/types";
import { ASSET } from "@/lib/contracts/constants";

type SettlementDefaultsProps = {
  policy: TreasuryPolicy | null;
  
};

export function SettlementDefaults({
  policy,
}: SettlementDefaultsProps) {
  const settlementAsset = policy?.settlementAsset ?? ASSET.SBTC;
  const autoSplit = policy?.autoSplit ?? true;
  const idleYield = policy?.idleYield ?? true;
  const yieldThreshold = policy?.yieldThreshold ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Settlement Defaults</h3>
            <p className="text-sm text-gray-500">Default settlement behavior for incoming payments</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          Indexed onchain configuration. Editing actions can be enabled next.
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">
                Default Settlement Asset
              </Label>
              <div className="flex gap-3">
                <button
                  disabled
                  className={`flex-1 px-4 py-3 border-2 rounded-lg text-sm transition-all cursor-default ${
                    settlementAsset === ASSET.SBTC
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                      : "border-gray-200 bg-white text-gray-700 font-medium"
                  }`}
                >
                  sBTC
                </button>
                <button
                  disabled
                  className={`flex-1 px-4 py-3 border-2 rounded-lg text-sm transition-all cursor-default ${
                    settlementAsset === ASSET.USDCX
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                      : "border-gray-200 bg-white text-gray-700 font-medium"
                  }`}
                >
                  USDCx
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Default asset for settlement unless overridden per invoice
              </p>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-1 mr-4">
                <Label className="text-sm font-semibold text-gray-900 mb-1 block">
                  Auto Split on Settlement
                </Label>
                <p className="text-xs text-gray-600">
                  Automatically distribute settlements across treasury buckets
                </p>
              </div>
              <Switch checked={autoSplit} disabled />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-1 mr-4">
                <Label className="text-sm font-semibold text-gray-900 mb-1 block">
                  Deploy Idle Balance to Yield
                </Label>
                <p className="text-xs text-gray-600">
                  Route balances above threshold into yield strategies
                </p>
              </div>
              <Switch checked={idleYield} disabled />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">
                Yield Deployment Threshold
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={String(yieldThreshold)}
                  readOnly
                  className="pr-16 font-mono text-sm bg-gray-50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                  {settlementAsset === ASSET.SBTC ? "sBTC" : "USDCx"}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum indexed threshold before deploying to yield strategies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
