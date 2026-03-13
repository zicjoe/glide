import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}