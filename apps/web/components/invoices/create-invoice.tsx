import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateInvoice() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Create Invoice</h3>
            <p className="text-sm text-gray-500">Generate a new payment request with checkout link</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Invoice Reference
                </Label>
                <Input type="text" placeholder="INV-2848" className="text-sm" />
                <p className="text-xs text-gray-500 mt-1.5">
                  Unique identifier for this invoice
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Amount
                </Label>
                <Input
                  type="text"
                  placeholder="0.0234"
                  className="text-sm font-mono"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Payment amount requested
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-3 block">
                Settlement Asset
              </Label>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 border-2 border-blue-600 bg-blue-50 rounded-lg text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100">
                  sBTC
                </button>
                <button className="flex-1 px-4 py-3 border-2 border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300">
                  USDCx
                </button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                Description
              </Label>
              <Textarea
                placeholder="Payment for services rendered, order #12345..."
                className="text-sm resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Customer-facing payment description
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                Expiry
              </Label>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400">
                  24 hours
                </button>
                <button className="px-4 py-2.5 border-2 border-blue-600 bg-blue-50 rounded-lg text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100">
                  7 days
                </button>
                <button className="px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400">
                  30 days
                </button>
                <button className="px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400">
                  Custom
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Invoice will expire after this period
              </p>
            </div>

            <div className="pt-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 text-sm shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all font-medium w-full">
                <Plus className="mr-2 h-4 w-4" />
                Generate Invoice & Checkout Link
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
                  <div className="text-sm font-semibold text-gray-900">INV-2848</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Amount</div>
                  <div className="text-lg font-semibold text-gray-900">0.0234 sBTC</div>
                  <div className="text-xs text-gray-600">≈ $1,426.50</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Description</div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    Payment for services rendered...
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
                  <div className="text-xs text-gray-700">7 days from creation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}