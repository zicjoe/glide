import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glide",
  description: "Stacks-native merchant settlement and treasury automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-950 antialiased">{children}</body>
    </html>
  );
}