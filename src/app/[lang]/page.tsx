import type { Metadata } from "next";
import Link from "next/link";

import { BusinessCard, PlaceCard } from "@/components/content/cards";
import { HeroSlides, type HeroSlide } from "@/components/home/HeroSlides";
import { Ridgeline } from "@/components/home/Ridgeline";
import { ValleyShowcase } from "@/components/home/ValleyShowcase";
import { HuntProgress } from "@/components/hunt/HuntProgress";
import { Stamp } from "@/components/hunt/Stamp";
import { Photo } from "@/components/ui/Photo";
import { photoAlt } from "@/components/ui/PhotoFigure";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { brand } from "@/config/brand";
import { businesses, guides, inSection, itineraries, places, recordPath, routes, tours } from "@/content";
import { DEMO, demoEvents, illustration } from "@/content/demo";
import { commonsPhotos } from "@/content/photos";
import type { Photo as PhotoRecord, Place } from "@/content/types";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc, plural } from "@/i18n/localize";
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
  const featured = ["grlja", "ali-pashas-springs", "ropojana", "oko-skakavice", "grbaja"].map((s) => places.find((p) => p.slug === s)!);
  const gems = places.filter((p) => p.gem);
  const heritage = commonsPhotos.gusinjeHouses;
  const place = (slug: string) => places.find((p) => p.slug === slug)!;

  // The hero: one place per photo, each named and linked.
  const slideOf = (photo: PhotoRecord, p: Place): HeroSlide => ({
    src: photo.src,
    alt: photoAlt(photo, lang),
    position: photo.position,
    label: p.slug === p.area ? loc(p.name, lang) : `${loc(p.name, lang)} · ${t.area[p.area]}`,
    href: href(lang, recordPath("place", p.slug)),
    credit: photo.credit,
  });
  // Only photos whose originals are big enough to stay sharp full-screen.
  const heroSlides: [PhotoRecord, Place][] = [
    [HERO, place("gusinje")],
    [commonsPhotos.vusanjeVillage, place("vusanje")],
    [commonsPhotos.blueEye, place("oko-skakavice")],
    [commonsPhotos.ropojanaUpper, place("ropojana")],
    [commonsPhotos.grbajaUpper, place("grbaja")],
    [commonsPhotos.karanfilWest, place("karanfili")],
    [commonsPhotos.zlaKolataNorthEast, place("zla-kolata")],
  ];
  const tips = ["getting-here", "seasons-and-packing", "responsible-travel", "safety-and-emergencies"].map((s) => guides.find((g) => g.slug === s)!);
  const count = (section: Parameters<typeof inSection>[1]) => businesses.filter((b) => inSection(b, section)).length;

  // Ways to spend time in the valley, each with a landscape photo (never a business's own photo).
  const things: { label: string; meta: string; path: string; photo: PhotoRecord }[] = [
    { label: t.footer.hikes, meta: plural(lang, routes.length, t.common.results), path: "/hikes", photo: commonsPhotos.ropojanaHiker },
    { label: t.footer.tours, meta: plural(lang, tours.length, t.common.results), path: "/tours", photo: commonsPhotos.gusinjeAerial },
    { label: t.nav.stay, meta: plural(lang, count("stay"), t.common.results), path: "/stay", photo: commonsPhotos.vusanjeGuesthouses },
    { label: t.nav.eatDrink, meta: plural(lang, count("eat-drink"), t.common.results), path: "/eat-drink", photo: commonsPhotos.gusinjeHouses },
    { label: t.nav.guides, meta: plural(lang, count("guides-experiences"), t.common.results), path: "/guides-experiences", photo: commonsPhotos.karanfilWest },
    { label: t.footer.itineraries, meta: plural(lang, itineraries.length, t.common.results), path: "/plan", photo: commonsPhotos.vusanjePeaks },
  ];
  const shown = [...heroSlides.map(([photo]) => photo), ...featured.map((p) => p.photos[0]), ...things.map((x) => x.photo), heritage, ...gems.map((p) => p.photos[0])].filter(Boolean) as PhotoRecord[];
  const credited = shown.filter((photo, i) => shown.findIndex((other) => other.src === photo.src) === i);

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

      {/* ---------------------------------------------------------- hero */}
      <div className={styles.heroWrap}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <HeroSlides slides={heroSlides.map(([photo, p]) => slideOf(photo, p))} />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroInner}>
            <p className={styles.heroWelcome} lang="sq">
              {t.home.welcome}
            </p>
            <p className={styles.heroRegion}>{brand.region}</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              {t.home.heroTitle}
            </h1>
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
        <Ridgeline centre={place("vusanje")} labels={[place("zla-kolata"), place("ropojana"), place("karanfili")]} lang={lang} t={t} />
      </div>

      {/* --------------------------------------------------------- intro */}
      <section className={styles.intro} aria-label={brand.region}>
        <p className={styles.introText}>{t.home.intro}</p>
      </section>

      <div className={styles.motif} aria-hidden="true" />

      {/* ------------------------------------------------- treasure hunt */}
      <section className={styles.huntBand} aria-labelledby="hunt">
        <div className={`${styles.blockInner} ${styles.split}`}>
          <div className={styles.plan}>
            <p className={ui.kicker}>{t.hunt.kicker}</p>
            <h2 id="hunt" className={styles.h2}>
              {t.hunt.homeTitle}
            </h2>
            <p className={styles.lede}>{t.hunt.homeText}</p>
            <div className={ui.actions}>
              <Link href={href(lang, "/hunt")} className={ui.button}>
                {t.hunt.hunts}
              </Link>
              <Link href={href(lang, "/hunt/passport")} className={ui.textLink}>
                {t.hunt.myPassport}
              </Link>
            </div>
            <HuntProgress places={places.map((p) => p.slug)} large className={styles.huntProgress} />
          </div>
          <div className={styles.huntStamps} aria-hidden="true">
            <Stamp icon="drop" how="here" label="Ali Pasha" size={118} />
            <Stamp icon="waterfall" how="hand" label="Grlja" size={100} />
            <Stamp icon="mountain" how="here" label="2534 m" size={132} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- how long do you have */}
      <section className={styles.block} aria-labelledby="time">
        <div className={styles.head}>
          <div>
            <h2 id="time" className={styles.h2}>
              {t.home.timeTitle}
            </h2>
            <p className={styles.lede}>{t.home.timeIntro}</p>
          </div>
        </div>
        <ol className={styles.times}>
          {itineraries.map((it, i) => (
            <li key={it.slug} className={styles.time}>
              <span className={styles.timeStep} aria-hidden="true">
                <span className={styles.timeDot} style={{ ["--step" as string]: i }} />
              </span>
              <p className={styles.timeLength}>{t.plan.length[it.length]}</p>
              <h3 className={styles.timeTitle}>{loc(it.title, lang)}</h3>
              <p className={styles.timeText}>{loc(it.summary, lang)}</p>
              <div className={styles.timeActions}>
                <Link href={`${href(lang, "/explore")}/?tour=${it.slug}`} className={styles.timeFly} prefetch={false}>
                  {t.explore.flyJourney}
                </Link>
                <Link href={href(lang, recordPath("itinerary", it.slug))} className={ui.textLink} prefetch={false}>
                  {t.home.openPlan}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------- where to stay / eat (demo builds) */}
      {DEMO &&
        (
          [
            ["stay", t.home.stayTitle, t.home.stayIntro, "/stay"],
            ["eat-drink", t.home.eatTitle, t.home.eatIntro, "/eat-drink"],
          ] as const
        ).map(([section, title, intro, path]) => (
          <section key={section} className={styles.block} aria-labelledby={`home-${section}`}>
            <div className={styles.head}>
              <div>
                <h2 id={`home-${section}`} className={styles.h2}>
                  {title}
                </h2>
                <p className={styles.lede}>{intro}</p>
              </div>
              <Link href={href(lang, path)} className={styles.more}>
                {t.common.seeAll}
              </Link>
            </div>
            <div className={styles.row}>
              {businesses
                .filter((b) => inSection(b, section) && b.origin?.kind === "demo")
                .slice(0, 4)
                .map((b) => (
                  <BusinessCard key={b.slug} business={b} lang={lang} t={t} />
                ))}
            </div>
          </section>
        ))}

      {/* -------------------------------------------------------- places */}
      <section className={styles.block} aria-labelledby="places">
        <div className={styles.head}>
          <div>
            <h2 id="places" className={styles.h2}>
              {t.home.placesTitle}
            </h2>
            <p className={styles.lede}>{t.home.placesIntro}</p>
          </div>
          <Link href={href(lang, "/places")} className={styles.more}>
            {t.common.seeAll}
          </Link>
        </div>
        <ul className={styles.mosaic}>
          {featured.map((p, i) => {
            const photo = p.photos[0];
            return (
              <li key={p.slug} className={i === 0 ? styles.mosaicLead : undefined}>
                <Link href={href(lang, recordPath("place", p.slug))} className={styles.tile} prefetch={false}>
                  {photo && <Photo src={photo.src} alt={photoAlt(photo, lang)} sizes={i === 0 ? "(max-width: 700px) 86vw, 50vw" : "(max-width: 700px) 86vw, 25vw"} position={photo.position} className={styles.tilePhoto} />}
                  <span className={styles.tileText}>
                    <span className={styles.tileKicker}>
                      {t.placeCategory[p.category]} · {t.area[p.area]}
                    </span>
                    <span className={styles.tileTitle}>{loc(p.name, lang)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------- 3D band */}
      <ValleyShowcase />

      {/* ---------------------------------------------------- things to do */}
      <section className={styles.block} aria-labelledby="things">
        <div className={styles.head}>
          <div>
            <h2 id="things" className={styles.h2}>
              {t.home.thingsTitle}
            </h2>
            <p className={styles.lede}>{t.home.thingsIntro}</p>
          </div>
        </div>
        <ul className={styles.things}>
          {things.map((x) => (
            <li key={x.path}>
              <Link href={href(lang, x.path)} className={styles.thing} prefetch={false}>
                <Photo src={x.photo.src} alt="" sizes="(max-width: 700px) 100vw, 33vw" position={x.photo.position} className={styles.thingPhoto} />
                <span className={styles.thingText}>
                  <span className={styles.thingTitle}>{x.label}</span>
                  <span className={styles.thingMeta}>{x.meta}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------- taste of the valley (demo) */}
      {DEMO && (
        <section className={styles.tasteBand} aria-labelledby="taste">
          <div className={styles.blockInner}>
            <div className={styles.head}>
              <div>
                <h2 id="taste" className={styles.h2}>
                  {t.home.tasteTitle}
                </h2>
                <p className={styles.lede}>{t.home.tasteIntro}</p>
              </div>
            </div>
            <ul className={styles.taste}>
              {(["dish-flija", "dish-burek", "dish-trout", "dish-board"] as const).map((name, i) => {
                const picture = illustration(name);
                const [dish, ...rest] = t.home.taste[i].split(" — ");
                return (
                  <li key={name} className={styles.tasteItem}>
                    <div className={styles.tastePhoto}>
                      <Photo src={picture.src} alt={photoAlt(picture, lang)} sizes="(max-width: 700px) 80vw, 25vw" />
                    </div>
                    <h3 className={styles.tasteTitle}>{dish}</h3>
                    <p className={styles.tasteText}>{rest.join(" — ")}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* --------------------------------------------------- hidden gems */}
      <section className={styles.block} aria-labelledby="gems">
        <div className={styles.head}>
          <div>
            <h2 id="gems" className={styles.h2}>
              {t.home.gemsTitle}
            </h2>
            <p className={styles.lede}>{t.home.gemsIntro}</p>
          </div>
          <Link href={href(lang, "/places")} className={styles.more}>
            {t.common.seeAll}
          </Link>
        </div>
        <div className={ui.cards}>
          {gems.map((p) => (
            <PlaceCard key={p.slug} place={p} lang={lang} t={t} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ history & culture */}
      <section className={styles.historyBand} aria-labelledby="history">
        <div className={`${styles.blockInner} ${styles.historySplit}`}>
          <div className={styles.historyPhoto}>
            <Photo src={heritage.src} alt={photoAlt(heritage, lang)} sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div className={styles.historyText}>
            <h2 id="history" className={styles.h2}>
              {t.home.historyTitle}
            </h2>
            <p className={styles.lede}>{t.home.historyText}</p>
            <Link href={href(lang, "/about/history")} className={ui.button}>
              {t.home.historyCta}
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- what's on (demo) */}
      {DEMO && (
        <section className={styles.block} aria-labelledby="events">
          <div className={styles.head}>
            <div>
              <h2 id="events" className={styles.h2}>
                {t.home.eventsTitle} <span className={ui.badgeGold}>{t.common.demo}</span>
              </h2>
              <p className={styles.lede}>{t.home.eventsIntro}</p>
            </div>
          </div>
          <ul className={styles.events}>
            {demoEvents.map((e) => {
              const picture = illustration(e.picture);
              return (
                <li key={e.slug} className={styles.event}>
                  <div className={styles.eventPhoto}>
                    <Photo src={picture.src} alt={photoAlt(picture, lang)} sizes="(max-width: 700px) 80vw, 25vw" />
                  </div>
                  <p className={styles.eventWhen}>{loc(e.when, lang)}</p>
                  <h3 className={styles.eventTitle}>{loc(e.title, lang)}</h3>
                  <p className={styles.eventWhere}>{loc(e.where, lang)}</p>
                  <p className={styles.eventText}>{loc(e.text, lang)}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* --------------------------------------------------------- tours */}
      <section className={styles.toursBand} aria-labelledby="tours">
        <div className={styles.blockInner}>
          <div className={styles.head}>
            <h2 id="tours" className={styles.h2}>
              {t.home.toursTitle}
            </h2>
            <Link href={href(lang, "/tours")} className={styles.more}>
              {t.common.seeAll}
            </Link>
          </div>
          <ol className={styles.tours}>
            {tours.map((tour, i) => (
              <li key={tour.slug} className={styles.tour}>
                <span className={styles.tourNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.tourTitle}>{loc(tour.title, lang)}</h3>
                <p className={styles.tourText}>{loc(tour.intro, lang)}</p>
                <p className={styles.tourMeta}>{plural(lang, tour.stops.length, t.explore.stops)}</p>
                <Link href={`${href(lang, "/explore")}/?tour=${tour.slug}`} className={styles.tourLink} prefetch={false}>
                  {t.home.startTour}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------- before you go */}
      <section className={styles.block} aria-labelledby="tips">
        <div className={styles.head}>
          <h2 id="tips" className={styles.h2}>
            {t.home.tipsTitle}
          </h2>
          <div className={styles.moreLinks}>
            <Link href={href(lang, "/services")} className={styles.more}>
              {t.footer.services}
            </Link>
            <Link href={href(lang, "/travel-tips")} className={styles.more}>
              {t.common.seeAll}
            </Link>
          </div>
        </div>
        <ul className={styles.tips}>
          {tips.map((g) => (
            <li key={g.slug}>
              <Link href={href(lang, recordPath("guide", g.slug))} className={styles.tip} prefetch={false}>
                <span className={styles.tipTitle}>{loc(g.title, lang)}</span>
                <span className={styles.tipText}>{loc(g.summary, lang)}</span>
                <span className={styles.tipArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------- plan + how it works */}
      <section className={styles.planBand} aria-labelledby="plan">
        <div className={`${styles.blockInner} ${styles.split}`}>
          <div className={styles.plan}>
            <h2 id="plan" className={styles.h2}>
              {t.home.planTitle}
            </h2>
            <p className={styles.lede}>{t.home.planText}</p>
            <Link href={href(lang, "/plan")} className={ui.button}>
              {t.nav.plan}
            </Link>
          </div>
          <div className={styles.honesty}>
            <h2 className={styles.h3}>{t.home.honestyTitle}</h2>
            <ul>
              {t.home.honesty.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <Link href={href(lang, "/about/platform")} className={ui.textLink}>
              {t.footer.aboutPlatform}
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- photo credits */}
      <section className={styles.credits} aria-labelledby="photo-credits">
        <h2 id="photo-credits" className={styles.creditsTitle}>
          {t.home.photosOnPage}
        </h2>
        <ul className={styles.creditList}>
          {credited.map((photo) => (
            <li key={photo.src}>
              <PhotoCredit credit={photo.credit} t={t} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
