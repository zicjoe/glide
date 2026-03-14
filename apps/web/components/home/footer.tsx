import Image from "next/image";
import { SectionShell } from "./section-shell";

export function HomeFooter() {
  return (
    <footer
      id="docs"
      className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50"
    >
      <SectionShell>
        <div className="py-20">
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <Image
                src="/glide-logo.png"
                alt="Glide"
                width={150}
                height={40}
                className="mb-5 h-8 w-auto"
              />
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-600">
                Merchant settlement and treasury automation built natively on
                Stacks. Accept payments in sBTC and USDCx with automated
                treasury management.
              </p>
              <div className="text-xs text-gray-500">
                © 2026 Glide. Built on Stacks.
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#product" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Platform</a></li>
                <li><a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a></li>
                <li><a href="/invoices" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Invoices</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Developers</h4>
              <ul className="space-y-3">
                <li><a href="#docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Documentation</a></li>
                <li><a href="/settlements" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Settlement Flow</a></li>
                <li><a href="/reconciliation" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Reconciliation</a></li>
                <li><a href="/activity" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Activity</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">Company</h4>
              <ul className="space-y-3">
                <li><a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Support</a></li>
                <li><a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Security</a></li>
                <li><a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-gray-200 pt-8 text-xs text-gray-500 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <a href="/" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="/" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="/" className="hover:text-gray-900 transition-colors">Compliance</a>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Demo environment active
              </span>
              <a href="/activity" className="hover:text-gray-900 transition-colors">Changelog</a>
            </div>
          </div>
        </div>
      </SectionShell>
    </footer>
  );
}