import { ArrowUpRight, CheckCircle2, Clock, Wallet, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionShell } from "./section-shell";

export function ProductPreview() {
  return (
    <section
      id="product"
      className="relative overflow-hidden border-y border-gray-700/60 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
    >
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/12 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <SectionShell>
        <div className="relative py-24">
          <div className="mb-20 text-center">
            <div className="mb-5 inline-block rounded-full border border-gray-700/60 bg-gray-800/90 px-4 py-2 shadow-lg backdrop-blur-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                Platform Overview
              </span>
            </div>
            <h2 className="mb-5 text-[44px] font-semibold tracking-tight text-white">
              Built for merchant operations
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-400">
              Real-time settlement tracking, treasury management, and yield
              automation
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90 px-8 py-6">
              <div>
                <div className="mb-2.5 flex items-center gap-2.5">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Balance
                  </h3>
                  <div className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    Demo State
                  </div>
                </div>
                <div className="mb-1 text-[32px] font-semibold leading-none text-gray-900">
                  1.2834 sBTC
                </div>
                <div className="text-sm text-gray-500">≈ $78,234.50 USD</div>
              </div>

              <div className="flex gap-3">
                <button className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50">
                  Export
                </button>
                <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35">
                  New Settlement
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 bg-gradient-to-br from-white via-gray-50/40 to-white p-8 lg:grid-cols-3">
              <Card className="col-span-2 border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="h-5 w-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-gray-900">
                      Recent Settlements
                    </h4>
                  </div>
                  <a
                    href="/settlements"
                    className="group flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    View all
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

                <div className="space-y-1">
                  {[
                    { id: "INV-2847", amount: "0.0234 sBTC", status: "completed", time: "2 hours ago", usd: "$1,426" },
                    { id: "INV-2846", amount: "0.0567 sBTC", status: "completed", time: "5 hours ago", usd: "$3,454" },
                    { id: "INV-2845", amount: "120.30 USDCx", status: "processing", time: "1 day ago", usd: "$120" },
                  ].map((settlement) => (
                    <div
                      key={settlement.id}
                      className="flex items-center justify-between rounded-lg px-4 py-4 transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        {settlement.status === "completed" ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm">
                            <Clock className="h-5 w-5 text-amber-600" />
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {settlement.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {settlement.time}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
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

              <Card className="border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
                    <Wallet className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">
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
                      surface: "bg-blue-50 border-blue-200/50",
                    },
                    {
                      name: "Reserves",
                      percentage: 30,
                      amount: "0.3850 sBTC",
                      color: "bg-gray-700",
                      surface: "bg-gray-100 border-gray-200/50",
                    },
                    {
                      name: "Yield Pool",
                      percentage: 10,
                      amount: "0.1284 sBTC",
                      color: "bg-green-600",
                      surface: "bg-green-50 border-green-200/50",
                    },
                  ].map((bucket) => (
                    <div
                      key={bucket.name}
                      className={`rounded-lg border p-4 ${bucket.surface}`}
                    >
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {bucket.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {bucket.percentage}%
                        </span>
                      </div>
                      <div className="mb-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white shadow-inner">
                        <div
                          className={`h-2.5 rounded-full shadow-sm ${bucket.color}`}
                          style={{ width: `${bucket.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        {bucket.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}