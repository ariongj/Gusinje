import type { Metadata } from "next";
import Link from "next/link";

import { PlaceCard, TipCard, TourCard } from "@/components/content/cards";
import { Photo } from "@/components/ui/Photo";
import { photoAlt } from "@/components/ui/PhotoFigure";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { brand } from "@/config/brand";
import { businesses, guides, inSection, places, tours } from "@/content";
import { commonsPhotos } from "@/content/photos";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { plural } from "@/i18n/localize";
import { jsonLd, pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

import styles from "./home.module.css";

const HERO = commonsPhotos.gusinjeValley;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return { ...pageMetadata({ lang, path: "/", title: brand.name[lang], description: t.meta.description, image: HERO }), title: { absolute: brand.name[lang] } };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const featured = ["grlja", "ali-pashas-springs", "ropojana", "oko-skakavice", "grbaja", "vusanje"].map((s) => places.find((p) => p.slug === s)!);
  const tips = ["getting-here", "seasons-and-packing", "responsible-travel", "safety-and-emergencies"].map((s) => guides.find((g) => g.slug === s)!);
  const count = (section: Parameters<typeof inSection>[1]) => businesses.filter((b) => inSection(b, section)).length;
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name[lang],
    inLanguage: lang,
    url: `${brand.url}${href(lang)}/`,
    publisher: { "@type": "Organization", name: "ROSI", url: brand.creator.website },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(website)} />
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Photo src={HERO.src} alt={photoAlt(HERO, lang)} eager sizes="100vw" position="50% 60%" />
        </div>
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.heroRegion}>{brand.region}</p>
          <h1 className={styles.heroTitle}>{t.home.heroTitle}</h1>
          <p className={styles.heroText}>{t.meta.tagline}</p>
          <div className={ui.actions}>
            <Link href={href(lang, "/explore")} className={styles.heroPrimary}>
              {t.home.exploreCta}
            </Link>
            <Link href={href(lang, "/places")} className={styles.heroSecondary}>
              {t.home.placesCta}
            </Link>
          </div>
        </div>
      </section>
      <div className={ui.wrap}>
        <PhotoCredit credit={HERO.credit} t={t} className={styles.heroCredit} />
      </div>

      <div className={ui.wrap}>
        <section className={ui.section} aria-labelledby="places">
          <div className={ui.sectionHead}>
            <div>
              <h2 id="places" className={ui.h2}>
                {t.home.placesTitle}
              </h2>
              <p className={ui.muted}>{t.home.placesIntro}</p>
            </div>
            <Link href={href(lang, "/places")} className={ui.textLink}>
              {t.common.seeAll}
            </Link>
          </div>
          <div className={ui.cards}>
            {featured.map((p) => (
              <PlaceCard key={p.slug} place={p} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section className={ui.sectionTight} aria-labelledby="tours">
          <div className={ui.sectionHead}>
            <h2 id="tours" className={ui.h2}>
              {t.home.toursTitle}
            </h2>
            <Link href={href(lang, "/tours")} className={ui.textLink}>
              {t.common.seeAll}
            </Link>
          </div>
          <div className={ui.cards}>
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section className={ui.section} aria-labelledby="directory">
          <h2 id="directory" className={ui.h2}>
            {t.home.directoryTitle}
          </h2>
          <p className={ui.muted}>{t.home.directoryText}</p>
          <ul className={styles.tiles}>
            {(
              [
                ["stay", t.nav.stay, "/stay"],
                ["eat-drink", t.nav.eatDrink, "/eat-drink"],
                ["guides-experiences", t.nav.guides, "/guides-experiences"],
              ] as const
            ).map(([section, label, path]) => (
              <li key={path}>
                <Link href={href(lang, path)} className={styles.tile}>
                  <span className={styles.tileTitle}>{label}</span>
                  <span className={styles.tileMeta}>{plural(lang, count(section), t.common.results)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={ui.sectionTight} aria-labelledby="tips">
          <div className={ui.sectionHead}>
            <h2 id="tips" className={ui.h2}>
              {t.home.tipsTitle}
            </h2>
            <Link href={href(lang, "/travel-tips")} className={ui.textLink}>
              {t.common.seeAll}
            </Link>
          </div>
          <div className={ui.cards}>
            {tips.map((g) => (
              <TipCard key={g.slug} guide={g} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section className={`${ui.section} ${styles.split}`} aria-labelledby="plan">
          <div className={styles.planCard}>
            <h2 id="plan" className={ui.h2}>
              {t.home.planTitle}
            </h2>
            <p className={ui.muted}>{t.home.planText}</p>
            <Link href={href(lang, "/plan")} className={ui.button}>
              {t.nav.plan}
            </Link>
          </div>
          <div className={styles.honesty}>
            <h2 className={ui.h2}>{t.home.honestyTitle}</h2>
            <ul>
              {t.home.honesty.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <Link href={href(lang, "/about/platform")} className={ui.textLink}>
              {t.footer.aboutPlatform}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
