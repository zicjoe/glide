"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  ArrowDownUp,
  TrendingUp,
  CheckSquare,
  Activity,
  RefreshCcw,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMerchantSession } from "@/hooks/use-merchant-session";

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Invoices", icon: FileText, href: "/invoices" },
  { name: "Treasury", icon: Wallet, href: "/treasury" },
  { name: "Settlements", icon: ArrowDownUp, href: "/settlements" },
  { name: "Yield", icon: TrendingUp, href: "/yield" },
  { name: "Reconciliation", icon: CheckSquare, href: "/reconciliation" },
  { name: "Activity", icon: Activity, href: "/activity" },
  { name: "Refunds", icon: RefreshCcw, href: "/refunds" },
];

function shortAddress(address: string) {
  if (address.length <= 18) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { merchantId, merchant, address, disconnect } = useMerchantSession();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center">
          <Image
            src="/glide-logo.png"
            alt="Glide"
            width={150}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Merchant ID</div>
            <div className="text-sm font-semibold text-gray-900">
              {merchantId ?? "Not created"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Wallet</div>
            <div className="text-xs text-gray-700 break-all">
              {merchant?.owner
                ? shortAddress(merchant.owner)
                : address
                  ? shortAddress(address)
                  : "Not connected"}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void disconnect()}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}