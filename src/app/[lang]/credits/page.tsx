import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/content/PageIntro";
import { SourceList } from "@/components/content/SourceList";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { photoAlt } from "@/components/ui/PhotoFigure";
import { businesses, places, recordPath } from "@/content";
import { allSources } from "@/content/sources";
import type { Photo } from "@/content/types";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

import styles from "./credits.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/credits">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/credits", title: t.credits.title, description: t.credits.intro });
}

export default async function CreditsPage({ params }: PageProps<"/[lang]/credits">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);

  // Every photo in use, with the pages it appears on — collected from the content.
  const used = new Map<string, { photo: Photo; pages: { label: string; path: string }[] }>();
  const add = (photo: Photo, label: string, path: string) => {
    const entry = used.get(photo.src) ?? { photo, pages: [] };
    if (!entry.pages.some((p) => p.path === path)) entry.pages.push({ label, path });
    used.set(photo.src, entry);
  };
  for (const p of places) for (const photo of p.photos) add(photo, loc(p.name, lang), recordPath("place", p.slug));
  for (const b of businesses) for (const photo of b.photos) add(photo, b.name, recordPath("business", b.slug));
  const all = [...used.values()];
  const free = all.filter((x) => x.photo.rights === "free-licence");
  const owner = all.filter((x) => x.photo.rights !== "free-licence");

  const list = (items: typeof all) => (
    <ul className={styles.list}>
      {items.map(({ photo, pages }) => (
        <li key={photo.src} className={styles.item}>
          <PhotoCredit credit={photo.credit} pending={photo.rights === "owner-pending"} t={t} />
          <p className={styles.alt}>{photoAlt(photo, lang)}</p>
          <p className={styles.used}>
            {t.credits.usedOn}:{" "}
            {pages.map((p, i) => (
              <span key={p.path}>
                {i > 0 && ", "}
                <Link href={href(lang, p.path)} className={ui.textLink}>
                  {p.label}
                </Link>
              </span>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <PageIntro lang={lang} t={t} title={t.credits.title} lead={t.credits.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.narrow}>
        <section className={ui.section} aria-labelledby="photos">
          <h2 id="photos" className={ui.h2}>
            {t.credits.photos} · Wikimedia Commons
          </h2>
          {list(free)}
          <h2 className={ui.h2} style={{ marginTop: 32 }}>
            {t.credits.photos} · ROSI ({t.common.rightsPending})
          </h2>
          {list(owner)}
        </section>
        <section className={ui.sectionTight} aria-labelledby="map-data">
          <h2 id="map-data" className={ui.h2}>
            {t.credits.mapData}
          </h2>
          <p className={ui.prose}>
            ©{" "}
            <a href="https://www.openstreetmap.org/copyright" className={ui.textLink} target="_blank" rel="noopener noreferrer">
              OpenStreetMap
            </a>{" "}
            contributors (ODbL). Leaflet (BSD-2-Clause). MapLibre GL (BSD-3-Clause). Elevation: Mapzen terrain tiles (SRTM and others) via AWS Open
            Data. Businesses marked “open data”:{" "}
            <a href="https://overturemaps.org" className={ui.textLink} target="_blank" rel="noopener noreferrer">
              Overture Maps Foundation
            </a>{" "}
            places (CDLA Permissive 2.0), with records from Meta, Microsoft and others.
          </p>
          <h2 className={ui.h2}>{t.credits.model}</h2>
          <p className={ui.prose}>{t.credits.modelText}</p>
        </section>
        <section className={ui.section} aria-labelledby="sources">
          <h2 id="sources" className={ui.h2}>
            {t.credits.sourcesTitle}
          </h2>
          <SourceList ids={allSources.map((s) => s.id)} lang={lang} t={t} />
        </section>
      </div>
    </>
  );
}
