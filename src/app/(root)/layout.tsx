import type { Metadata } from "next";
import type { ReactNode } from "react";

import { brand } from "@/config/brand";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${brand.url}/`),
  title: brand.name.en,
  description: "Gusinje · Vusanje · Prokletije — choose your language.",
  ...(process.env.NEXT_PUBLIC_NOINDEX === "true" ? { robots: { index: false, follow: false } } : {}),
};

/** The bare site root only picks a language. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
