import { Wallet, Plus, MoreVertical, TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const buckets = [
  {
    id: 1,
    name: "Operating",
    allocation: 60,
    destination: "Operating Wallet",
    destinationType: "Hot Wallet",
    idleMode: "HOLD" as const,
    enabled: true,
    color: "blue",
  },
  {
    id: 2,
    name: "Reserves",
    allocation: 30,
    destination: "Cold Storage Reserve",
    destinationType: "Multi-sig",
    idleMode: "HOLD" as const,
    enabled: true,
    color: "gray",
  },
  {
    id: 3,
    name: "Yield Pool",
    allocation: 10,
    destination: "Yield Pool Address",
    destinationType: "DeFi Contract",
    idleMode: "EARN" as const,
    enabled: true,
    color: "green",
  },
];

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  gray: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    icon: "from-gray-600 to-gray-700",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "from-green-500 to-green-600",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
};

export function TreasuryBuckets() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Treasury Buckets
              </h3>
              <p className="text-sm text-gray-500">
                Configure allocation and idle balance behavior
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-9 px-4 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Bucket
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {buckets.map((bucket) => {
          const colors = colorConfig[bucket.color as keyof typeof colorConfig];

          return (
            <div
              key={bucket.id}
              className={`p-5 rounded-xl border ${colors.border} ${colors.bg} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-sm flex-shrink-0`}
                  >
                    <Wallet className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-gray-900">
                        {bucket.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colors.badge}`}
                      >
                        {bucket.allocation}%
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      → {bucket.destination}{" "}
                      <span className="text-gray-400">
                        ({bucket.destinationType})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {bucket.idleMode === "EARN" ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 border border-green-200 rounded-md">
                          <TrendingUp className="h-3.5 w-3.5 text-green-700" />
                          <span className="text-xs font-semibold text-green-700">
                            EARN Mode
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-md">
                          <Lock className="h-3.5 w-3.5 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-600">
                            HOLD Mode
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium text-gray-600">
                      Enabled
                    </Label>
                    <Switch defaultChecked={bucket.enabled} />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50">
                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">
                    Allocation %
                  </Label>
                  <Input
                    type="number"
                    defaultValue={bucket.allocation}
                    className="text-sm h-9"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">
                    Idle Balance Behavior
                  </Label>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        bucket.idleMode === "HOLD"
                          ? "border-2 border-gray-600 bg-gray-100 text-gray-700"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      HOLD
                    </button>
                    <button
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        bucket.idleMode === "EARN"
                          ? "border-2 border-green-600 bg-green-100 text-green-700"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      EARN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}