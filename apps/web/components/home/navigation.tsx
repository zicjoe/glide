import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeNavigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/glide-logo.png"
              alt="Glide - Treasury Automation"
              width={160}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <a
            href="#features"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            aria-label="View features"
          >
            Features
          </a>
          <a
            href="#product"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            aria-label="View product overview"
          >
            Product
          </a>
          <a
            href="#docs"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            aria-label="Read documentation"
          >
            Documentation
          </a>
          <Button
            className="bg-blue-600 text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
            aria-label="Sign in to dashboard"
            asChild
          >
            <Link href="/dashboard">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}