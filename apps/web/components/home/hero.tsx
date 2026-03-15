import Link from "next/link";
import { Button } from '../ui/button';
import { ArrowRight, FileText, LayoutDashboard, Zap, Shield, TrendingUp, Layers } from 'lucide-react';

export function HomeHero() {
  return (
    <section className="bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="max-w-7xl mx-auto px-8 py-24 relative">
        <div className="grid grid-cols-2 gap-20 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm text-gray-700 font-medium">Stacks-native treasury automation</span>
            </div>
            
            <h1 className="text-[56px] tracking-tight text-gray-900 mb-7 leading-[1.1] font-semibold">
              Merchant settlement and treasury automation
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Accept payments and settle in sBTC or USDCx. Automatically split revenue into treasury buckets and route idle balances into yield—all in one platform.
            </p>
            
            <div className="flex items-center gap-4 mb-14">
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-7 text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all font-medium"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 px-7 text-base border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow transition-all font-medium"
              >
                <Link href="/invoices">
                  <FileText className="mr-2 h-5 w-5" />
                  Create Invoice
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-gray-200/80">
              <div className="flex items-center gap-10">
                <div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1.5">$2.4M+</div>
                  <div className="text-sm text-gray-600">Settled volume</div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1.5">150+</div>
                  <div className="text-sm text-gray-600">Active merchants</div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1.5">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-600/25 group-hover:shadow-xl group-hover:shadow-blue-600/35 transition-all">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Settlement</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive payments and settle in sBTC or USDCx within seconds
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-5 shadow-lg shadow-gray-600/25 group-hover:shadow-xl group-hover:shadow-gray-600/35 transition-all">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto Treasury Split</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Split revenue into custom buckets automatically on every payment
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-5 shadow-lg shadow-green-600/25 group-hover:shadow-xl group-hover:shadow-green-600/35 transition-all">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Yield Deployment</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Route idle balances into yield strategies automatically
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-purple-600/25 group-hover:shadow-xl group-hover:shadow-purple-600/35 transition-all">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Multi-sig wallets and compliance-ready audit trails
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}