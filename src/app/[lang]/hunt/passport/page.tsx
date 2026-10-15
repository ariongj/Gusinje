import type { Metadata } from "next";

import { PageIntro } from "@/components/content/PageIntro";
import { PassportView, type PassportHunt, type PassportPlace } from "@/components/hunt/PassportView";
import { hunts, places } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { placeIcon } from "@/lib/explore-data";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/hunt/passport">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/hunt/passport", title: t.hunt.passport, description: t.hunt.passportIntro, noindex: true });
}

/** The explorer's passport: stamps, badges and progress, all on this device. */
export default async function PassportPage({ params }: PageProps<"/[lang]/hunt/passport">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const list: PassportPlace[] = places.map((p) => ({
    slug: p.slug,
    name: loc(p.name, lang),
    categoryLabel: t.placeCategory[p.category],
    icon: placeIcon[p.category],
    href: href(lang, `/places/${p.slug}`),
    mapHref: p.location ? `${href(lang, "/explore")}/?place=${p.slug}` : null,
    gem: !!p.gem,
  }));
  const huntList: PassportHunt[] = hunts.map((h) => ({ slug: h.slug, title: loc(h.title, lang), icon: h.icon, places: h.clues.map((c) => c.place), href: href(lang, `/hunt/${h.slug}`) }));
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        kicker={t.hunt.title}
        title={t.hunt.passport}
        lead={t.hunt.passportIntro}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.hunt.title, href(lang, "/hunt")],
        ]}
      />
      <div className={ui.wrap}>
        <section className={ui.section} aria-label={t.hunt.passport}>
          <PassportView places={list} hunts={huntList} huntsHref={href(lang, "/hunt")} />
        </section>
      </div>
    </>
  );
}
