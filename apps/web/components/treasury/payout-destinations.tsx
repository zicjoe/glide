"use client";

import { MapPin, Plus, MoreVertical, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { PayoutDestination } from "@/lib/contracts/types";
import { ASSET, DESTINATION_TYPE } from "@/lib/contracts/constants";

type PayoutDestinationsProps = {
  destinations: PayoutDestination[];
};

function destinationTypeLabel(type: number): string {
  switch (type) {
    case DESTINATION_TYPE.HOT_WALLET:
      return "Hot Wallet";
    case DESTINATION_TYPE.MULTI_SIG:
      return "Multi-sig";
    case DESTINATION_TYPE.DEFI_CONTRACT:
      return "DeFi Contract";
    default:
      return `Unknown (${type})`;
  }
}

async function copyValue(value: string) {
  await navigator.clipboard.writeText(value);
}

export function PayoutDestinations({
  destinations,
}: PayoutDestinationsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Payout Destinations</h3>
              <p className="text-sm text-gray-500">Saved addresses for treasury bucket payouts</p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled
            className="h-9 px-4 text-sm border-gray-300 text-gray-500 bg-white shadow-sm font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Destination
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-sm text-gray-500 text-center">
                  No payout destinations found onchain yet.
                </td>
              </tr>
            ) : (
              destinations.map((destination) => (
                <tr key={destination.destinationId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{destination.label}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      destination.asset === ASSET.SBTC
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {destination.asset === ASSET.SBTC ? "sBTC" : "USDCx"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-600 font-mono max-w-[240px] truncate inline-block">
                        {destination.destination}
                      </code>
                      <button
                        type="button"
                        onClick={() => void copyValue(destination.destination)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {destinationTypeLabel(destination.destinationType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch checked={destination.enabled} disabled />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      disabled
                      className="text-gray-300 cursor-default"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
