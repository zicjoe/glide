import { Bitcoin, PieChart, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function HomeFeatures() {
  const features = [
    {
      icon: Bitcoin,
      title: "Settle in sBTC or USDCx",
      description:
        "Accept payments and settle directly in Bitcoin-backed sBTC or stablecoin USDCx. Keep value on-chain without relying on traditional payment processors.",
    },
    {
      icon: PieChart,
      title: "Automated treasury splits",
      description:
        "Define revenue allocation rules once. Every settlement automatically distributes funds across operating accounts, reserves, and yield pools according to your treasury strategy.",
    },
    {
      icon: TrendingUp,
      title: "Deploy idle balances into yield",
      description:
        "Route eligible treasury balances into vetted yield protocols. Monitor performance and withdraw anytime—all from a single interface.",
    },
  ];

  return (
    <section
      className="bg-gradient-to-b from-white via-gray-50 to-white relative"
      id="features"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.04),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-8 py-28 relative">
        <div className="text-center mb-20">
          <div className="inline-block mb-5 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-[44px] text-gray-900 mb-5 tracking-tight font-semibold leading-tight">
            Everything you need for treasury automation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            End-to-end merchant settlement infrastructure built natively on
            Stacks
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-9 border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 bg-white group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover:from-blue-50/60 group-hover:via-transparent group-hover:to-blue-50/30 transition-all duration-500" />

                <div className="relative">
                  <div className="h-[60px] w-[60px] bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-xl flex items-center justify-center mb-7 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 border border-blue-200/60">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3.5 font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}