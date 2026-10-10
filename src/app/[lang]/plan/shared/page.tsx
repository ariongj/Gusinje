import type { Metadata } from "next";

import { PageIntro } from "@/components/content/PageIntro";
import { SharedTrip } from "@/components/plan/SharedTrip";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { catalogue } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/plan/shared">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/plan/shared", title: t.plan.sharedTitle, description: t.plan.sharedIntro, noindex: true });
}

export default async function SharedPage({ params }: PageProps<"/[lang]/plan/shared">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        title={t.plan.sharedTitle}
        lead={t.plan.sharedIntro}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.plan, href(lang, "/plan")],
        ]}
      />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <SharedTrip catalogue={catalogue(lang)} />
        </div>
      </div>
    </>
  );
}
