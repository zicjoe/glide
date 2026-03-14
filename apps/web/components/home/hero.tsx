import Link from "next/link";
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  Zap,
  Shield,
  TrendingUp,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "./section-shell";

function HeroCard({
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
    <div className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-lg transition-all hover:shadow-xl">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all group-hover:scale-105 ${tone}`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <SectionShell>
        <div className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Stacks-native treasury automation
              </span>
            </div>

            <h1 className="mb-7 text-[56px] font-semibold leading-[1.1] tracking-tight text-gray-900">
              Merchant settlement and treasury automation
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-gray-600">
              Accept payments and settle in sBTC or USDCx. Automatically split
              revenue into treasury buckets and route idle balances into yield
              from one merchant workflow.
            </p>

            <div className="mb-14 flex flex-wrap items-center gap-4">
              <Button className="h-12 bg-blue-600 px-7 text-base text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35">
                <Link href="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-12 border-gray-300 bg-white/50 px-7 text-base text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:border-gray-400 hover:bg-white"
              >
                <Link href="/invoices" className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Create Invoice
                </Link>
              </Button>
            </div>

            <div className="border-t border-gray-200/80 pt-8">
              <div className="flex items-center gap-10">
                <div>
                  <div className="mb-1.5 text-2xl font-semibold text-gray-900">
                    sBTC
                  </div>
                  <div className="text-sm text-gray-600">
                    Bitcoin settlement rail
                  </div>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div>
                  <div className="mb-1.5 text-2xl font-semibold text-gray-900">
                    USDCx
                  </div>
                  <div className="text-sm text-gray-600">
                    Stable settlement option
                  </div>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div>
                  <div className="mb-1.5 text-2xl font-semibold text-gray-900">
                    Rules
                  </div>
                  <div className="text-sm text-gray-600">
                    Treasury automation built in
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <HeroCard
              icon={<Zap className="h-6 w-6 text-white" />}
              title="Instant Settlement"
              description="Receive payments and settle in sBTC or USDCx within seconds."
              tone="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <HeroCard
              icon={<Layers className="h-6 w-6 text-white" />}
              title="Auto Treasury Split"
              description="Split revenue into custom buckets automatically on every payment."
              tone="bg-gradient-to-br from-gray-700 to-gray-800"
            />
            <HeroCard
              icon={<TrendingUp className="h-6 w-6 text-white" />}
              title="Yield Deployment"
              description="Route idle balances into yield strategies automatically."
              tone="bg-gradient-to-br from-green-500 to-green-600"
            />
            <HeroCard
              icon={<Shield className="h-6 w-6 text-white" />}
              title="Operational Control"
              description="Track settlement, reconciliation, refunds, and treasury state."
              tone="bg-gradient-to-br from-purple-500 to-purple-600"
            />
          </div>
        </div>
      </SectionShell>
    </section>
  );
}