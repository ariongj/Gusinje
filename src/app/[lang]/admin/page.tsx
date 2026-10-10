import type { Metadata } from "next";
import Link from "next/link";

import { ModerationPreview } from "@/components/admin/ModerationPreview";
import { PageIntro } from "@/components/content/PageIntro";
import { Notice } from "@/components/ui/Notice";
import { businesses, guides, itineraries, places, recordPath, routes, tours } from "@/content";
import type { AnyRecord } from "@/content/types";
import { getMessages, resolveLocale } from "@/i18n";
import { formatDate, href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

import styles from "./admin.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/admin">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/admin", title: t.admin.title, description: t.admin.intro, noindex: true });
}

/** Practical fields still empty — what an editor should check next. */
function missing(r: AnyRecord): string[] {
  switch (r.kind) {
    case "place":
      return [
        !r.location && "coordinates",
        !r.access && "access",
        !r.accessibility && "accessibility",
        !r.seasonality && "season",
        !r.duration && "time needed",
        !r.fees && "fees",
        !r.hours && "opening times",
        r.photos.length === 0 && "photo",
      ].filter(Boolean) as string[];
    case "business":
      return [
        !r.location && !r.partOf && "coordinates",
        !r.contact.phones && !r.contact.email && !r.contact.website && "contact",
        !r.hours && "hours",
        !r.prices && "prices",
        r.photos.length === 0 && "photo",
        !r.claimed && "unclaimed",
        r.photos.some((p) => p.rights === "owner-pending") && "photo rights",
      ].filter(Boolean) as string[];
    case "route":
      return [
        !r.distanceKm && "distance",
        !r.ascentM && "ascent",
        !r.duration && "duration",
        !r.difficulty && "difficulty",
        !r.seasonality && "season",
        !r.equipment && "equipment",
        r.status !== "published" && "field check",
      ].filter(Boolean) as string[];
    case "guide":
      return r.sections.filter((s) => s.status === "needs-local-review").map((s) => `local review: ${s.heading.en}`);
    default:
      return [];
  }
}

export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const records: AnyRecord[] = [...places, ...businesses, ...routes, ...guides, ...tours, ...itineraries];
  const name = (r: AnyRecord) => (r.kind === "business" ? r.name : r.kind === "place" || r.kind === "route" ? loc(r.name, lang) : loc(r.title, lang));
  const counts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.verification.status] = (acc[r.verification.status] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.admin.title} lead={t.admin.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <section className={ui.section} aria-labelledby="status">
          <h2 id="status" className={ui.h2}>
            {t.verification.title}
          </h2>
          <p className={ui.chips}>
            {Object.entries(counts).map(([status, n]) => (
              <span key={status} className={ui.badge}>
                {t.verification.status[status as keyof typeof t.verification.status]}: {n}
              </span>
            ))}
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{t.admin.record}</th>
                  <th scope="col">{t.admin.kind}</th>
                  <th scope="col">{t.admin.status}</th>
                  <th scope="col">{t.admin.checked}</th>
                  <th scope="col">{t.admin.missing}</th>
                  <th scope="col">{t.admin.translations}</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={`${r.kind}:${r.slug}`}>
                    <th scope="row">
                      <Link href={href(lang, recordPath(r.kind, r.slug))} className={ui.textLink}>
                        {name(r)}
                      </Link>
                    </th>
                    <td>{t.search.kind[r.kind]}</td>
                    <td data-status={r.verification.status}>{t.verification.status[r.verification.status]}</td>
                    <td>{r.verification.lastChecked ? formatDate(r.verification.lastChecked, lang) : t.verification.neverChecked}</td>
                    <td className={styles.missing} lang="en">
                      {missing(r).join(", ") || "—"}
                    </td>
                    <td>
                      sq: {r.translations.sq ?? "—"}
                      <br />
                      cnr: {r.translations.cnr ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className={ui.section} aria-labelledby="moderation">
          <h2 id="moderation" className={ui.h2}>
            {t.admin.moderationTitle}
          </h2>
          <Notice tone="preview">{t.admin.moderationText}</Notice>
          <div style={{ marginTop: 14 }}>
            <ModerationPreview />
          </div>
        </section>
      </div>
    </>
  );
}
