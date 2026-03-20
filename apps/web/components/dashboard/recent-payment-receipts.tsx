"use client";

import { useMerchantSession } from "@/hooks/use-merchant-session";
import { usePaymentReceipts } from "@/hooks/use-payment-receipts";
import { formatRailAmount } from "@/lib/contracts/constants";

function shortTxid(txid: string) {
  if (txid.length <= 16) return txid;
  return `${txid.slice(0, 8)}...${txid.slice(-8)}`;
}

function timeLabel(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString();
}

export function RecentPaymentReceipts() {
  const { merchantId } = useMerchantSession();
  const { receipts, loading, error, refetch } = usePaymentReceipts(merchantId);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Recent Incoming Payments
          </h3>
          <p className="text-sm text-gray-500">
            Deposits received across payment rails
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          className="text-sm text-blue-600 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading incoming payments...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : receipts.length === 0 ? (
          <div className="text-sm text-gray-500">
            No incoming payments recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {receipts.slice(0, 8).map((receipt) => (
              <div
                key={receipt.receiptId}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      +{formatRailAmount(receipt.amount, receipt.assetLabel)} {receipt.assetLabel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {receipt.invoiceReference
                        ? `Matched to ${receipt.invoiceReference}`
                        : "Unmatched incoming payment"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {timeLabel(receipt.createdAt)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">TXID</div>
                    <div className="text-xs text-gray-700 font-mono">
                      {shortTxid(receipt.txid)}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {receipt.status}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 break-all">
                  Address: {receipt.receiveAddress}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}