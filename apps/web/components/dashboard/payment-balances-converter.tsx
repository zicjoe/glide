"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Copy, RefreshCw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";
import { useIndexedYield } from "@/hooks/use-indexed-yield";
import { useIndexedConversions } from "@/hooks/use-indexed-conversions";
import {
  createConversionRecord,
  getConversionQuote,
  updateConversionStatus,
} from "@/lib/api/indexer";
import { formatAssetAmount, formatRailAmount } from "@/lib/contracts/constants";

function fromBaseUnits(amount: number, decimals: number) {
  return Number(amount) / Math.pow(10, decimals);
}

function toBaseUnits(value: string, decimals: number) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;

  const [whole, fraction = ""] = trimmed.split(".");
  if (fraction.length > decimals) return null;

  const padded = (fraction + "0".repeat(decimals)).slice(0, decimals);
  const normalized = `${whole}${padded}`.replace(/^0+$/, "0");
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? null : parsed;
}

function formatUsd(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function copyText(value: string) {
  return navigator.clipboard.writeText(value);
}

export function PaymentBalancesConverter() {
  const { merchantId, rails } = useMerchantSession();
  const { balances, loading, refetch } = useIndexedYield(merchantId);
  const {
    conversions,
    loading: conversionsLoading,
    refetch: refetchConversions,
  } = useIndexedConversions(merchantId);

  const [fromAsset, setFromAsset] = useState<"STX" | "SBTC">("STX");
  const [fromAmount, setFromAmount] = useState("");
  const [quotedToAmount, setQuotedToAmount] = useState<number | null>(null);
  const [quoteRate, setQuoteRate] = useState<number | null>(null);
  const [quoteMode, setQuoteMode] = useState<string | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toAsset = fromAsset === "STX" ? "SBTC" : "STX";

  const tracked = useMemo(() => {
    const sbtcBase = balances
      .filter((row) => row.asset === 0)
      .reduce((sum, row) => sum + row.available + row.queued + row.deployed, 0);

    const usdcxBase = balances
      .filter((row) => row.asset === 1)
      .reduce((sum, row) => sum + row.available + row.queued + row.deployed, 0);

    const sbtc = fromBaseUnits(sbtcBase, 8);
    const usdcx = fromBaseUnits(usdcxBase, 6);

    return {
      sbtcBase,
      usdcxBase,
      sbtc,
      usdcx,
      totalUsd: usdcx + sbtc * 0, // keep neutral until real aggregate pricing is wired
    };
  }, [balances]);

  const fromAmountBase = useMemo(() => {
    return toBaseUnits(fromAmount, fromAsset === "STX" ? 6 : 8);
  }, [fromAmount, fromAsset]);

  useEffect(() => {
    async function runQuote() {
      if (!fromAmountBase || fromAmountBase <= 0) {
        setQuotedToAmount(null);
        setQuoteRate(null);
        setQuoteMode(null);
        return;
      }

      try {
        setQuoting(true);
        const result = await getConversionQuote({
          fromAsset,
          toAsset,
          fromAmount: fromAmountBase,
        });

        setQuotedToAmount(Number(result.quote.toAmount));
        setQuoteRate(Number(result.quote.rate));
        setQuoteMode(String(result.quote.mode));
      } catch {
        setQuotedToAmount(null);
        setQuoteRate(null);
        setQuoteMode(null);
      } finally {
        setQuoting(false);
      }
    }

    void runQuote();
  }, [fromAmountBase, fromAsset, toAsset]);

  async function submitConversion() {
    if (!merchantId) {
      setMessage("Merchant not ready.");
      return;
    }

    if (!fromAmountBase || !quotedToAmount || !quoteRate) {
      setMessage("Enter a valid amount first.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("Recording conversion...");

      const sourceAddress = rails.stacksAddress || null;
      const destinationAddress = rails.stacksAddress || null;

      await createConversionRecord({
        merchantId,
        fromAsset,
        toAsset,
        fromAmount: fromAmountBase,
        toAmount: quotedToAmount,
        quoteRate,
        sourceAddress,
        destinationAddress,
        status: "requested",
        metadata: {
          mode: quoteMode ?? "unknown",
          execution: "manual_for_now",
        },
      });

      setMessage("Conversion recorded.");
      setFromAmount("");
      setQuotedToAmount(null);
      setQuoteRate(null);
      setQuoteMode(null);
      await refetchConversions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to record conversion");
    } finally {
      setSubmitting(false);
    }
  }

  async function markCompleted(conversionId: number) {
    try {
      await updateConversionStatus(conversionId, {
        status: "completed",
      });
      await refetchConversions();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update conversion");
    }
  }

  const rows = [
    {
      label: "STX",
      amount: "0",
      address: rails.stacksAddress || "Not connected",
      note: "Uses merchant Stacks address",
    },
    {
      label: "BTC",
      amount: "0",
      address: rails.btcAddress || "Not connected",
      note: "Uses merchant BTC address",
    },
    {
      label: "sBTC",
      amount: formatAssetAmount(tracked.sbtcBase, 0),
      address: rails.stacksAddress || "Not connected",
      note: "Tracked from Glide vault balances",
    },
    {
      label: "USDCx",
      amount: formatAssetAmount(tracked.usdcxBase, 1),
      address: rails.stacksAddress || "Not connected",
      note: "Tracked from Glide vault balances",
    },
    {
      label: "USDC",
      amount: "0",
      address: "Not wired yet",
      note: "External rail not wired yet",
    },
  ];

  const receiveDisplay =
    quotedToAmount == null
      ? "0"
      : formatRailAmount(
          quotedToAmount,
          toAsset === "SBTC" ? "sBTC" : "STX",
        );

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Payment Balances
            </h3>
            <p className="text-sm text-gray-500">
              Receive rails and Glide tracked balances
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="text-xs text-blue-700 mb-1">Total Estimated Value</div>
            <div className="text-2xl font-semibold text-blue-950">
              ${formatUsd(tracked.totalUsd)}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Dashboard total is conservative until full wallet balance sync is wired
            </div>
          </div>

          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {row.label}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {row.amount} {row.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{row.note}</div>
                  </div>

                  <div className="max-w-[55%] text-right">
                    <div className="text-xs text-gray-500 mb-1">Receive address</div>
                    <div className="text-xs text-gray-700 break-all">
                      {row.address}
                    </div>
                    {row.address !== "Not connected" && row.address !== "Not wired yet" ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => void copyText(row.address)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Recent conversions
            </div>

            {conversionsLoading ? (
              <div className="text-sm text-gray-500">Loading conversions...</div>
            ) : conversions.length === 0 ? (
              <div className="text-sm text-gray-500">No conversions recorded yet.</div>
            ) : (
              <div className="space-y-3">
                {conversions.slice(0, 5).map((item) => (
                  <div key={item.conversionId} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-gray-900">
                        #{item.conversionId} {item.fromAsset} → {item.toAsset}
                      </div>
                      <div className="text-xs text-gray-500">{item.status}</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatRailAmount(item.fromAmount, item.fromAsset)} {item.fromAsset} →{" "}
                      {formatRailAmount(item.toAmount, item.toAsset === "SBTC" ? "sBTC" : item.toAsset)}{" "}
                      {item.toAsset === "SBTC" ? "sBTC" : item.toAsset}
                    </div>
                    {item.status !== "completed" ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => void markCompleted(item.conversionId)}
                      >
                        Mark completed
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">
              STX ⇄ sBTC Converter
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Live backend quote and recorded conversion flow
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">From</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFromAsset("STX")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm ${
                  fromAsset === "STX"
                    ? "bg-blue-50 border-2 border-blue-600 text-blue-700 font-semibold"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                STX
              </button>
              <button
                type="button"
                onClick={() => setFromAsset("SBTC")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm ${
                  fromAsset === "SBTC"
                    ? "bg-blue-50 border-2 border-blue-600 text-blue-700 font-semibold"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                sBTC
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">Amount</div>
            <input
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder={fromAsset === "STX" ? "100" : "0.01"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs text-gray-500 mb-1">You receive</div>
            <div className="text-xl font-semibold text-gray-900">
              {quoting ? "Quoting..." : `${receiveDisplay} ${toAsset === "SBTC" ? "sBTC" : toAsset}`}
            </div>
            {quoteRate != null ? (
              <div className="text-xs text-gray-500 mt-2">
                Rate: 1 {fromAsset === "SBTC" ? "sBTC" : fromAsset} = {quoteRate.toFixed(6)}{" "}
                {toAsset === "SBTC" ? "sBTC" : toAsset}
              </div>
            ) : null}
            {quoteMode ? (
              <div className="text-xs text-gray-500 mt-1">
                Quote mode: {quoteMode}
              </div>
            ) : null}
          </div>

          {message ? <div className="text-sm text-gray-700">{message}</div> : null}

          <Button
            type="button"
            className="w-full"
            onClick={() => void submitConversion()}
            disabled={submitting || quoting || !fromAmountBase || !quotedToAmount}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {submitting ? "Recording..." : "Create conversion record"}
          </Button>
        </div>
      </div>
    </div>
  );
}