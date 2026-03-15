import Image from "next/image";

export function HomeFooter() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-5 gap-16 mb-16">
          <div className="col-span-2">
            <Image
              src="/glide-logo.png"
              alt="Glide"
              width={150}
              height={40}
              className="h-8 w-auto mb-5"
            />
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-6">
              Merchant settlement and treasury automation built natively on
              Stacks. Accept payments in sBTC and USDCx with automated treasury
              management.
            </p>
            <div className="text-xs text-gray-500">
              © 2026 Glide. Built on Stacks.
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#product"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Platform
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Developers
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#docs"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Integration Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  SDKs
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Compliance
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              All Systems Operational
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              Changelog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}