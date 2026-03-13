import type { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}