"use client";

import { useMemo, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { writeCreateInvoice } from "@/lib/contracts/writers";
import { ASSET, assetLabel } from "@/lib/contracts/constants";

function futureTs(days: number) {
  return Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;
}

type CreateInvoiceProps = {
  merchantId: number | null;
  onCreated?: () => Promise<void> | void;
};

export function CreateInvoice({
  merchantId,
  onCreated,
}: CreateInvoiceProps) {
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<0 | 1>(ASSET.SBTC);
  const [description, setDescription] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const parsedAmount = Number(amount || 0);
  const expiryAt = useMemo(() => futureTs(expiryDays), [expiryDays]);

  async function onSubmit() {
    if (!merchantId) {
      setMessage("Merchant is not ready yet.");
      return;
    }

    if (!reference.trim()) {
      setMessage("Invoice reference is required.");
      return;
    }

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    if (!description.trim()) {
      setMessage("Description is required.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("Submitting invoice transaction...");

      await writeCreateInvoice({
        merchantId,
        reference: reference.trim(),
        asset,
        amount: parsedAmount,
        description: description.trim(),
        expiryAt,
      });

      setMessage("Invoice submitted. Waiting for indexer refresh...");

      if (onCreated) {
        await onCreated();
      }

      setMessage("Invoice created and list refreshed.");
      setReference("");
      setAmount("");
      setDescription("");
      setExpiryDays(7);
      setAsset(ASSET.SBTC);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to create invoice",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Create Invoice</h3>
            <p className="text-sm text-gray-500">Generate a new payment request onchain</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            <div className="text-xs text-gray-500">
              Merchant ID: {merchantId ?? "Not found"}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Invoice Reference
                </Label>
                <Input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="INV-2848"
                  className="text-sm"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Amount
                </Label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100000"
                  className="text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">
                Settlement Asset
              </Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAsset(ASSET.SBTC)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm transition-all ${
                    asset === ASSET.SBTC
                      ? "border-2 border-blue-600 bg-blue-50 font-semibold text-blue-700"
                      : "border-2 border-gray-200 bg-white font-medium text-gray-700"
                  }`}
                >
                  sBTC
                </button>
                <button
                  type="button"
                  onClick={() => setAsset(ASSET.USDCX)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm transition-all ${
                    asset === ASSET.USDCX
                      ? "border-2 border-blue-600 bg-blue-50 font-semibold text-blue-700"
                      : "border-2 border-gray-200 bg-white font-medium text-gray-700"
                  }`}
                >
                  USDCx
                </button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment for services rendered..."
                className="text-sm resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                Expiry
              </Label>
              <div className="flex gap-3">
                {[1, 7, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExpiryDays(days)}
                    className={`px-4 py-2.5 rounded-lg text-sm transition-all ${
                      expiryDays === days
                        ? "border-2 border-blue-600 bg-blue-50 font-semibold text-blue-700"
                        : "border border-gray-300 bg-white font-medium text-gray-700"
                    }`}
                  >
                    {days === 1 ? "24 hours" : `${days} days`}
                  </button>
                ))}
              </div>
            </div>

            {message ? <div className="text-sm text-gray-700">{message}</div> : null}

            <div className="pt-2">
              <Button
                type="button"
                onClick={onSubmit}
                disabled={submitting || !merchantId}
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 text-sm shadow-lg shadow-blue-600/20 transition-all font-medium w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                {submitting ? "Submitting..." : "Generate Invoice"}
              </Button>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Preview
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Reference</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {reference || "Not set"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Amount</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {amount || "0"} {assetLabel(asset)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Description</div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    {description || "No description"}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-300">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-amber-200 rounded-md">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">
                      Pending Creation
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Expires</div>
                  <div className="text-xs text-gray-700">
                    {expiryDays} day{expiryDays > 1 ? "s" : ""} from creation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>      </div>
    </div>
  );
}
