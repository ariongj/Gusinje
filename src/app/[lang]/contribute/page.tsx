import type { Metadata } from "next";

import { PageIntro } from "@/components/content/PageIntro";
import { ContributeForms } from "@/components/contribute/ContributeForms";
import { businesses, places, sortByName } from "@/content";
import type { AreaId, BusinessCategory } from "@/content/types";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/contribute">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/contribute", title: t.contribute.title, description: t.contribute.intro });
}

const CATEGORIES: BusinessCategory[] = ["hotel", "guesthouse", "cabin", "campsite", "restaurant", "cafe", "shop", "guide", "activity", "transport", "rental"];
const AREAS: AreaId[] = ["gusinje", "vusanje", "grbaja", "ropojana", "plav"];

export default async function ContributePage({ params }: PageProps<"/[lang]/contribute">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.contribute.title} lead={t.contribute.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <ContributeForms
            businessOptions={sortByName(businesses, (b) => b.name, lang).map((b) => ({ value: b.slug, label: b.name }))}
            categoryOptions={CATEGORIES.map((c) => ({ value: c, label: t.businessCategory[c] }))}
            areaOptions={AREAS.map((a) => ({ value: a, label: t.area[a] }))}
            placeOptions={sortByName(places, (p) => loc(p.name, lang), lang).map((p) => ({ value: p.slug, label: loc(p.name, lang) }))}
          />
        </div>
      </div>
    </>
  );
}
