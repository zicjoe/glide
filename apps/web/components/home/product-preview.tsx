import { ArrowUpRight, CheckCircle2, Clock, Wallet, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ProductPreview() {
  return (
    <section
      id="product"
      className="bg-gradient-to-b from-gray-900 via-gray-850 to-gray-900 border-y border-gray-700/60 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/12 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-7xl mx-auto px-8 py-28 relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-5 px-4 py-2 bg-gray-800/90 backdrop-blur-sm border border-gray-700/60 rounded-full shadow-lg">
            <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">
              Platform Overview
            </span>
          </div>
          <h2 className="text-[44px] text-white mb-5 tracking-tight font-semibold leading-tight">
            Built for merchant operations
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-time settlement tracking, treasury management, and yield
            automation
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
          <div className="border-b border-gray-200 px-8 py-6 flex items-center justify-between bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Total Balance
                </h3>
                <div className="px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 font-semibold">
                  +12.4%
                </div>
              </div>
              <div className="text-[32px] text-gray-900 font-semibold mb-1 leading-none">
                1.2834 sBTC
              </div>
              <div className="text-sm text-gray-500">≈ $78,234.50 USD</div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow font-medium text-gray-700">
                Export
              </button>
              <button className="px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 font-medium">
                New Settlement
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-3 gap-6 bg-gradient-to-br from-white via-gray-50/40 to-white">
            <Card className="col-span-2 p-6 border-gray-200 shadow-lg bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <h4 className="text-base text-gray-900 font-semibold">
                    Recent Settlements
                  </h4>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium transition-colors group"
                >
                  View all
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <div className="space-y-1">
                {[
                  {
                    id: "INV-2847",
                    amount: "0.0234 sBTC",
                    status: "completed",
                    time: "2 hours ago",
                    usd: "$1,426",
                  },
                  {
                    id: "INV-2846",
                    amount: "0.0567 sBTC",
                    status: "completed",
                    time: "5 hours ago",
                    usd: "$3,454",
                  },
                  {
                    id: "INV-2845",
                    amount: "0.1203 USDCx",
                    status: "processing",
                    time: "1 day ago",
                    usd: "$120",
                  },
                ].map((settlement) => (
                  <div
                    key={settlement.id}
                    className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {settlement.status === "completed" ? (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50 flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 flex items-center justify-center shadow-sm">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-900 font-medium">
                          {settlement.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {settlement.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900 font-semibold">
                        {settlement.amount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {settlement.usd}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-gray-200 shadow-lg bg-white">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 flex items-center justify-center shadow-sm">
                  <Wallet className="h-4.5 w-4.5 text-blue-600" />
                </div>
                <h4 className="text-base text-gray-900 font-semibold">
                  Treasury Split
                </h4>
              </div>

              <div className="space-y-5">
                {[
                  {
                    name: "Operating",
                    percentage: 60,
                    amount: "0.7700 sBTC",
                    color: "bg-blue-600",
                    lightColor: "bg-blue-50",
                    borderColor: "border-blue-200/50",
                  },
                  {
                    name: "Reserves",
                    percentage: 30,
                    amount: "0.3850 sBTC",
                    color: "bg-gray-700",
                    lightColor: "bg-gray-100",
                    borderColor: "border-gray-200/50",
                  },
                  {
                    name: "Yield Pool",
                    percentage: 10,
                    amount: "0.1284 sBTC",
                    color: "bg-green-600",
                    lightColor: "bg-green-50",
                    borderColor: "border-green-200/50",
                  },
                ].map((bucket) => (
                  <div
                    key={bucket.name}
                    className={`p-4 rounded-lg ${bucket.lightColor} border ${bucket.borderColor}`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm text-gray-900 font-semibold">
                        {bucket.name}
                      </span>
                      <span className="text-sm text-gray-700 font-semibold">
                        {bucket.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5 mb-2.5 overflow-hidden shadow-inner">
                      <div
                        className={`${bucket.color} h-2.5 rounded-full shadow-sm transition-all duration-700`}
                        style={{ width: `${bucket.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {bucket.amount}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}