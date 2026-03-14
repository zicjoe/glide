import { ArrowUpRight, BarChart3, CheckCircle2, Clock, Wallet } from "lucide-react";
import { SectionShell } from "./section-shell";

function SettlementRow({
  id,
  amount,
  status,
  time,
  usd,
}: {
  id: string;
  amount: string;
  status: "completed" | "processing";
  time: string;
  usd: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-4 transition-all hover:bg-zinc-50">
      <div className="flex items-center gap-4">
        {status === "completed" ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
        )}

        <div>
          <div className="text-sm font-medium text-zinc-900">{id}</div>
          <div className="text-xs text-zinc-500">{time}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-semibold text-zinc-900">{amount}</div>
        <div className="text-xs text-zinc-500">{usd}</div>
      </div>
    </div>
  );
}

function TreasuryBucket({
  name,
  percentage,
  amount,
  barClassName,
  surfaceClassName,
}: {
  name: string;
  percentage: number;
  amount: string;
  barClassName: string;
  surfaceClassName: string;
}) {
  return (
    <div className={["rounded-lg border p-4", surfaceClassName].join(" ")}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-900">{name}</span>
        <span className="text-sm font-semibold text-zinc-700">{percentage}%</span>
      </div>

      <div className="mb-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white shadow-inner">
        <div
          className={["h-2.5 rounded-full shadow-sm", barClassName].join(" ")}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="text-xs font-medium text-zinc-600">{amount}</div>
    </div>
  );
}

export function ProductPreview() {
  return (
    <SectionShell
      id="product"
      className="relative overflow-hidden border-y border-zinc-700/60 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950"
    >
      <div className="absolute left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/12 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative py-24">
        <div className="mb-16 text-center">
          <div className="mb-5 inline-block rounded-full border border-zinc-700/60 bg-zinc-800/90 px-4 py-2 shadow-lg backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-300">
              Platform Overview
            </span>
          </div>

          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Built for merchant operations
          </h2>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-400">
            Real-time settlement tracking, treasury management, and yield
            automation for Bitcoin-native merchant workflows.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 border-b border-zinc-200 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Total Balance
                </h3>
                <div className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  Demo State
                </div>
              </div>

              <div className="mb-1 text-3xl font-semibold leading-none text-zinc-900">
                1.2834 sBTC
              </div>
              <div className="text-sm text-zinc-500">≈ $78,234.50 USD</div>
            </div>

            <div className="flex gap-3">
              <button className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50">
                Export
              </button>
              <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35">
                New Settlement
              </button>
            </div>
          </div>

          <div className="grid gap-6 bg-gradient-to-br from-white via-zinc-50/40 to-white p-8 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="h-5 w-5 text-zinc-600" />
                  <h4 className="text-base font-semibold text-zinc-900">
                    Recent Settlements
                  </h4>
                </div>

                <a
                  href="/settlements"
                  className="group flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  View all
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="space-y-1">
                <SettlementRow
                  id="INV-2847"
                  amount="0.0234 sBTC"
                  status="completed"
                  time="2 hours ago"
                  usd="$1,426"
                />
                <SettlementRow
                  id="INV-2846"
                  amount="0.0567 sBTC"
                  status="completed"
                  time="5 hours ago"
                  usd="$3,454"
                />
                <SettlementRow
                  id="INV-2845"
                  amount="120.30 USDCx"
                  status="processing"
                  time="1 day ago"
                  usd="$120"
                />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
                  <Wallet className="h-4.5 w-4.5 text-blue-600" />
                </div>
                <h4 className="text-base font-semibold text-zinc-900">
                  Treasury Split
                </h4>
              </div>

              <div className="space-y-5">
                <TreasuryBucket
                  name="Operating"
                  percentage={60}
                  amount="0.7700 sBTC"
                  barClassName="bg-blue-600"
                  surfaceClassName="border-blue-200/50 bg-blue-50"
                />
                <TreasuryBucket
                  name="Reserves"
                  percentage={30}
                  amount="0.3850 sBTC"
                  barClassName="bg-zinc-700"
                  surfaceClassName="border-zinc-200/50 bg-zinc-100"
                />
                <TreasuryBucket
                  name="Yield Pool"
                  percentage={10}
                  amount="0.1284 sBTC"
                  barClassName="bg-green-600"
                  surfaceClassName="border-green-200/50 bg-green-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}