// src/app/layout.tsx
//
// The App Router's root layout — wraps EVERY page in the app, and
// persists across navigation rather than remounting on each page change.
// This is where the <html>/<body> shell lives, once, instead of every
// individual page needing its own.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daycare Management",
  description: "Daycare administration app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
