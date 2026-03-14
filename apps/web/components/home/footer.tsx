import Image from "next/image";
import { SectionShell } from "./section-shell";

export function HomeFooter() {
  return (
    <footer id="docs" className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
      <SectionShell>
        <div className="py-20">
          <div className="mb-16 grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <Image
                src="/glide-logo.png"
                alt="Glide"
                width={150}
                height={40}
                className="mb-5 h-8 w-auto"
              />

              <p className="mb-6 max-w-sm text-sm leading-relaxed text-zinc-600">
                Merchant settlement and treasury automation built natively on
                Stacks. Accept payments in sBTC and USDCx with automated
                treasury management.
              </p>

              <div className="text-xs text-zinc-500">
                © 2026 Glide. Built on Stacks.
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-zinc-900">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#product" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Platform
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/invoices" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Invoices
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-zinc-900">
                Developers
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#docs" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/settlements" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Settlement Flow
                  </a>
                </li>
                <li>
                  <a href="/reconciliation" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Reconciliation
                  </a>
                </li>
                <li>
                  <a href="/activity" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Activity
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-zinc-900">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Support
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Security
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-zinc-200 pt-8 text-xs text-zinc-500 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <a href="/" className="transition-colors hover:text-zinc-900">
                Privacy Policy
              </a>
              <a href="/" className="transition-colors hover:text-zinc-900">
                Terms of Service
              </a>
              <a href="/" className="transition-colors hover:text-zinc-900">
                Compliance
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Demo environment active
              </span>
              <a href="/activity" className="transition-colors hover:text-zinc-900">
                Changelog
              </a>
            </div>
          </div>
        </div>
      </SectionShell>
    </footer>
  );
}