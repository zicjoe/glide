import { Bitcoin, PieChart, TrendingUp } from "lucide-react";
import { SectionShell } from "./section-shell";

const features = [
  {
    icon: Bitcoin,
    title: "Settle in sBTC or USDCx",
    description:
      "Accept payments and settle directly in Bitcoin-backed sBTC or stable settlement with USDCx inside a single merchant flow.",
  },
  {
    icon: PieChart,
    title: "Automated treasury splits",
    description:
      "Define allocation rules once and automatically route revenue into operating, reserve, and treasury buckets after settlement.",
  },
  {
    icon: TrendingUp,
    title: "Deploy idle balances into yield",
    description:
      "Mark eligible balances for yield routing and monitor queued versus active treasury deployment from one interface.",
  },
];

export function HomeFeatures() {
  return (
    <SectionShell
      id="features"
      className="relative bg-gradient-to-b from-white via-zinc-50 to-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.04),transparent_70%)]" />

      <div className="relative py-24">
        <div className="mb-16 text-center">
          <div className="mb-5 inline-block rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
              Core Capabilities
            </span>
          </div>

          <h2 className="mb-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Everything you need for treasury automation
          </h2>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600">
            Merchant settlement infrastructure built natively around Bitcoin
            workflows on Stacks.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-9 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/0 transition-all duration-500 group-hover:from-blue-50/60 group-hover:to-blue-50/30" />

                <div className="relative">
                  <div className="mb-7 flex h-[60px] w-[60px] items-center justify-center rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-500/10 to-blue-600/20 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>

                  <h3 className="mb-3.5 text-xl font-semibold text-zinc-900">
                    {feature.title}
                  </h3>

                  <p className="text-base leading-relaxed text-zinc-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}