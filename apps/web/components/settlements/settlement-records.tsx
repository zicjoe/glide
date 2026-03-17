"use client";

import type { IndexedSettlement } from "@/hooks/use-indexed-settlements";
import {
  ASSET,
  SETTLEMENT_STATUS,
  assetLabel,
  settlementStatusLabel,
} from "@/lib/contracts/constants";

type Props = {
  settlements: IndexedSettlement[];
};

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

function statusTone(status: number) {
  switch (status) {
    case SETTLEMENT_STATUS.COMPLETED:
      return "bg-green-50 text-green-700 border-green-200";
    case SETTLEMENT_STATUS.FAILED:
      return "bg-red-50 text-red-700 border-red-200";
    case SETTLEMENT_STATUS.PROCESSING:
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export function SettlementRecords({ settlements }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Settlement Records
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Indexed settlement execution and status
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">No settlements yet.</div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settlement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {settlements.map((settlement) => (
                <tr
                  key={settlement.settlementId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      #{settlement.settlementId}
                    </div>
                    <div className="text-xs text-gray-500">
                      Merchant #{settlement.merchantId}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      #{settlement.invoiceId}
                    </div>
                    <div className="text-xs text-gray-500">
                      Gross {settlement.grossAmount}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        settlement.asset === ASSET.SBTC
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {assetLabel(settlement.asset)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {settlement.netAmount}
                    </div>
                    <div className="text-xs text-gray-500">
                      Fee {settlement.feeAmount}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-semibold ${statusTone(
                        settlement.status,
                      )}`}
                    >
                      {settlementStatusLabel(settlement.status)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {createdLabel(settlement.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {settlement.executor}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}