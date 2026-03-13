"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invoices", label: "Invoices" },
  { href: "/treasury", label: "Treasury" },
  { href: "/settlements", label: "Settlements" },
  { href: "/yield", label: "Yield" },
  { href: "/refunds", label: "Refunds" },
  { href: "/reconciliation", label: "Reconciliation" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-6 py-5">
        <Link href="/dashboard" className="text-lg font-semibold text-zinc-950">
          Glide
        </Link>
        <p className="mt-1 text-sm text-zinc-500">
          Merchant settlement and treasury automation
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}