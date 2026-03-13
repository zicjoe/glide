import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
          Glide
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
          Merchant settlement and treasury automation on Stacks
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Accept payments, settle in sBTC or USDCx, split revenue by treasury
          rules, and manage idle balances with optional yield deployment.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Open dashboard
          </Link>
          <Link
            href="/checkout/demo-invoice"
            className="rounded-lg border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            View checkout
          </Link>
        </div>
      </div>
    </main>
  );
}