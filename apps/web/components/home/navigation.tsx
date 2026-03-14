import Image from "next/image";
import Link from "next/link";

export function HomeNavigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/glide-logo.png"
            alt="Glide"
            width={150}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
          >
            Features
          </a>
          <a
            href="#product"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
          >
            Product
          </a>
          <a
            href="#docs"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
          >
            Documentation
          </a>
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
          >
            Open App
          </Link>
        </div>
      </div>
    </nav>
  );
}