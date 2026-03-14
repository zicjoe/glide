import Link from "next/link";
import { ArrowRight, FileText, LayoutDashboard, Layers, Shield, TrendingUp, Zap } from "lucide-react";
import { SectionShell } from "./section-shell";

function HeroValueCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div
        className={[
          "mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all group-hover:scale-105",
          tone,
        ].join(" ")}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-600">{description}</p>
    </div>
  );
}

export function HomeHero() {
  return (
    <SectionShell className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(59,130,246,0.06),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative grid gap-14 py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-24">
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="text-sm font-medium text-zinc-700">
              Bitcoin-native merchant operations on Stacks
            </span>
          </div>

          <h1 className="mb-7 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl sm:leading-[1.05]">
            Merchant settlement and treasury automation
          </h1>

          <p className="mb-10 text-xl leading-relaxed text-zinc-600">
            Accept payments and settle in sBTC or USDCx. Automatically split
            revenue into treasury buckets and route eligible idle balances into
            yield from one merchant workflow.
          </p>

          <div className="mb-14 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center rounded-xl bg-blue-600 px-7 text-base font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="/invoices"
              className="inline-flex h-12 items-center rounded-xl border border-zinc-300 bg-white/70 px-7 text-base font-medium text-zinc-700 shadow-sm backdrop-blur-sm transition-all hover:border-zinc-400 hover:bg-white"
            >
              <FileText className="mr-2 h-5 w-5" />
              Create Invoice
            </Link>
          </div>

          <div className="border-t border-zinc-200/80 pt-8">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div>
                <div className="mb-1 text-2xl font-semibold text-zinc-900">
                  sBTC
                </div>
                <div className="text-sm text-zinc-600">Bitcoin settlement rail</div>
              </div>

              <div className="hidden h-10 w-px bg-zinc-200 sm:block" />

              <div>
                <div className="mb-1 text-2xl font-semibold text-zinc-900">
                  USDCx
                </div>
                <div className="text-sm text-zinc-600">Stable settlement option</div>
              </div>

              <div className="hidden h-10 w-px bg-zinc-200 sm:block" />

              <div>
                <div className="mb-1 text-2xl font-semibold text-zinc-900">
                  Rules
                </div>
                <div className="text-sm text-zinc-600">Treasury automation built in</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <HeroValueCard
            icon={<Zap className="h-6 w-6 text-white" />}
            title="Instant Settlement"
            description="Receive payments and settle directly in sBTC or USDCx within a single merchant workflow."
            tone="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <HeroValueCard
            icon={<Layers className="h-6 w-6 text-white" />}
            title="Auto Treasury Split"
            description="Distribute revenue into operating, reserve, and treasury buckets automatically."
            tone="bg-gradient-to-br from-zinc-700 to-zinc-800"
          />
          <HeroValueCard
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            title="Yield Deployment"
            description="Route eligible idle balances into yield strategies based on treasury policy."
            tone="bg-gradient-to-br from-green-500 to-green-600"
          />
          <HeroValueCard
            icon={<Shield className="h-6 w-6 text-white" />}
            title="Operational Control"
            description="Track settlement, reconciliation, refunds, and treasury state from one place."
            tone="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>
      </div>
    </SectionShell>
  );
}