import type { ReactNode } from "react";

interface SectionShellProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function SectionShell({
  id,
  className = "",
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </section>
  );
}