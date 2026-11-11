import "./globals.css";

import type { Metadata } from "next";

import { brand } from "@/config/brand";
import { cnr } from "@/i18n/messages/cnr";
import { en } from "@/i18n/messages/en";
import { sq } from "@/i18n/messages/sq";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: `${en.notFound.title} · ${brand.name.en}`,
  robots: { index: false },
};

/** One 404 for the whole static site, in all three languages: off the map, with the way back. */
export default function GlobalNotFound() {
  const items = [
    { lang: "en", t: en },
    { lang: "sq", t: sq },
    { lang: "cnr", t: cnr },
  ] as const;
  return (
    <html lang="en">
      <body>
        <main className={styles.page}>
          <svg className={styles.compass} viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="#fbf6ec" stroke="#b8894a" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(168,119,58,0.45)" strokeDasharray="2 4" />
            {["N", "E", "S", "W"].map((letter, i) => (
              <text key={letter} x="100" y="42" textAnchor="middle" transform={`rotate(${i * 90} 100 100)`} fill="#0f3b3f" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
                {letter}
              </text>
            ))}
            <g className={styles.needle}>
              <path d="M100 30l11 70H89z" fill="#b03a2e" />
              <path d="M100 170l-11-70h22z" fill="#8fa3a2" />
            </g>
            <circle cx="100" cy="100" r="7" fill="#fbfaf7" stroke="#0f3b3f" strokeWidth="2.5" />
          </svg>
          <p className={styles.code}>404 · {brand.region}</p>
          <div className={styles.languages}>
            {items.map(({ lang, t }) => (
              <section key={lang} lang={lang} className={styles.card}>
                <p className={styles.kicker}>{t.notFound.kicker}</p>
                <h1 className={styles.title}>{t.notFound.title}</h1>
                <p className={styles.text}>{t.notFound.text}</p>
                <p className={styles.links}>
                  <a href={`${brand.basePath}/${lang}/`} className={styles.primary}>
                    {t.notFound.home}
                  </a>
                  <a href={`${brand.basePath}/${lang}/explore/`}>{t.nav.explore}</a>
                  <a href={`${brand.basePath}/${lang}/hunt/`}>{t.nav.hunt}</a>
                </p>
              </section>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
