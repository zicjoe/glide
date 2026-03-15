import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function PolicyStatus() {
  const totalAllocation = 100;
  const isValid = totalAllocation === 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Policy Validation
            </h3>
            <p className="text-sm text-gray-500">
              Configuration status and validation
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div
            className={`p-5 rounded-xl border ${
              isValid ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  isValid ? "text-green-900" : "text-amber-900"
                }`}
              >
                Total Allocation
              </span>
            </div>
            <div
              className={`text-3xl font-semibold mb-1 ${
                isValid ? "text-green-700" : "text-amber-700"
              }`}
            >
              {totalAllocation}%
            </div>
            <p
              className={`text-xs ${
                isValid ? "text-green-600" : "text-amber-600"
              }`}
            >
              {isValid ? "Allocation is balanced" : "Must equal exactly 100%"}
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Active Destinations
              </span>
            </div>
            <div className="text-3xl font-semibold text-blue-700 mb-1">3 / 4</div>
            <p className="text-xs text-blue-600">
              Destinations configured and enabled
            </p>
          </div>

          <div
            className={`p-5 rounded-xl border ${
              isValid ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Info className="h-5 w-5 text-gray-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  isValid ? "text-green-900" : "text-gray-700"
                }`}
              >
                Policy Status
              </span>
            </div>
            <div
              className={`text-lg font-semibold mb-1 ${
                isValid ? "text-green-700" : "text-gray-600"
              }`}
            >
              {isValid ? "Ready to Save" : "Pending Changes"}
            </div>
            <p
              className={`text-xs ${
                isValid ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isValid ? "Configuration is valid" : "Review configuration"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-green-900 mb-1">
                Settlement defaults configured
              </div>
              <div className="text-xs text-green-700">
                Default asset set to sBTC with auto-split enabled
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-green-900 mb-1">
                All buckets have valid destinations
              </div>
              <div className="text-xs text-green-700">
                Operating, Reserves, and Yield Pool are properly configured
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-blue-900 mb-1">
                Yield deployment threshold set
              </div>
              <div className="text-xs text-blue-700">
                Idle balances above 0.0500 sBTC will be deployed to yield strategies
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}