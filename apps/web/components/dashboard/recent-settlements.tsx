"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ArrowUpRight, AlertCircle } from "lucide-react";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedSettlements } from "@/hooks/use-indexed-settlements";
import {
  ASSET,
  SETTLEMENT_STATUS,
  assetLabel,
} from "@/lib/contracts/constants";

function createdLabel(createdAt: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - createdAt;

  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
}

export function RecentSettlements() {
  const { merchantId } = useMerchantSession();
  const { settlements, loading, error } = useIndexedSettlements(merchantId);

  const recent = settlements.slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Recent Settlements
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track payment settlements and their status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/settlements"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium transition-colors group"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/executor"
              className="rounded-xl border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div className="text-sm font-semibold text-gray-900">Executor Ops</div>
              <div className="text-xs text-gray-600 mt-1">
                Verify payments and trigger settlements
              </div>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Loading settlements...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">{error}</div>
      ) : recent.length === 0 ? (
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
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {recent.map((settlement) => (
                <tr
                  key={settlement.settlementId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Settlement #{settlement.settlementId}
                      </div>
                      <div className="text-xs text-gray-500">
                        Invoice #{settlement.invoiceId}
                      </div>
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
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {settlement.netAmount} {assetLabel(settlement.asset)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Fee {settlement.feeAmount}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {settlement.status === SETTLEMENT_STATUS.COMPLETED ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            Completed
                          </span>
                        </>
                      ) : settlement.status === SETTLEMENT_STATUS.FAILED ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">
                            Failed
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-700">
                            Processing
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {createdLabel(settlement.createdAt)}
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
