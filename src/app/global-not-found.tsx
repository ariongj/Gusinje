import "./globals.css";

import type { Metadata } from "next";

import { brand } from "@/config/brand";
import { cnr } from "@/i18n/messages/cnr";
import { en } from "@/i18n/messages/en";
import { sq } from "@/i18n/messages/sq";

export const metadata: Metadata = {
  title: `${en.notFound.title} · ${brand.name.en}`,
  robots: { index: false },
};

/** One 404 for the whole static site, in all three languages. */
export default function GlobalNotFound() {
  const items = [
    { lang: "en", t: en },
    { lang: "sq", t: sq },
    { lang: "cnr", t: cnr },
  ] as const;
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: 28, padding: "32px 16px", textAlign: "center" }}>
          <p style={{ margin: 0, font: "700 12px/1 system-ui, sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>
            404 · {brand.region}
          </p>
          {items.map(({ lang, t }) => (
            <section key={lang} lang={lang}>
              <h1 style={{ margin: "0 0 6px", font: "600 26px/1.2 Georgia, serif" }}>{t.notFound.title}</h1>
              <p style={{ margin: "0 0 8px", color: "var(--text)" }}>{t.notFound.text}</p>
              <a href={`${brand.basePath}/${lang}/`} style={{ fontWeight: 700, color: "var(--teal-2)", textDecoration: "underline" }}>
                {t.notFound.home}
              </a>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}
