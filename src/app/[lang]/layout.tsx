import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { OfflineSupport } from "@/components/layout/OfflineSupport";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { brand } from "@/config/brand";
import { getMessages, resolveLocale } from "@/i18n";
import { I18nProvider } from "@/i18n/client";
import { locales } from "@/i18n/config";

import "../globals.css";

// Only what the design uses: upright Fraunces with optical sizing (no italic,
// no SOFT axis) keeps the font download small on phones.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return {
    metadataBase: new URL(`${brand.url}/`),
    title: { default: brand.name[lang], template: `%s · ${brand.name[lang]}` },
    description: t.meta.description,
    applicationName: brand.name[lang],
    formatDetection: { telephone: false },
    // Previews (e.g. GitHub Pages) stay out of search results until launch.
    ...(process.env.NEXT_PUBLIC_NOINDEX === "true" ? { robots: { index: false, follow: false } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: brand.themeColor,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <html lang={lang} className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          {t.meta.skipToContent}
        </a>
        <I18nProvider lang={lang} messages={t}>
          <SiteHeader />
          <main id="content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter lang={lang} />
        </I18nProvider>
        <RevealObserver />
        <OfflineSupport />
      </body>
    </html>
  );
}
