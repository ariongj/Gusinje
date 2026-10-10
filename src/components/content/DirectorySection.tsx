import Link from "next/link";
import type { ReactNode } from "react";

import { businesses, sortByName, type DirectorySection as Section, inSection } from "@/content";
import type { Business } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/config";
import { fill, plural } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import { businessItem } from "@/lib/explore-data";
import ui from "@/styles/ui.module.css";

import { BusinessCard } from "./cards";
import { FilterGrid } from "./FilterGrid";
import { Notice } from "@/components/ui/Notice";

type Props = {
  lang: Locale;
  t: Messages;
  /** Which listings; all when omitted. */
  sections?: Section[];
  empty: ReactNode;
  /** Extra notes under the coverage notice (official lists etc.). */
  notes?: ReactNode;
};

/** A directory list: honest coverage note, A–Z cards with type/area filters, and a map view. */
export function DirectorySection({ lang, t, sections, empty, notes }: Props) {
  const list: Business[] = sortByName(
    businesses.filter((b) => !sections || sections.some((s) => inSection(b, s))),
    (b) => b.name,
    lang,
  );
  const categories = [...new Set(list.flatMap((b) => b.categories))];
  const areas = [...new Set(list.map((b) => b.area ?? "unknown"))];
  return (
    <div className={ui.stack}>
      <Notice tone="info" title={plural(lang, businesses.length, t.directory.coverage)}>
        <p>{t.directory.order}</p>
        {businesses.some((b) => b.origin) && <p>{fill(t.directory.openDataCoverage, { n: businesses.filter((b) => b.origin).length })}</p>}
        {notes}
        <p>
          <Link href={href(lang, "/contribute")} className={ui.textLink}>
            {t.directory.submit}
          </Link>
        </p>
      </Notice>
      <FilterGrid
        withMap
        facets={[
          { key: "type", label: t.directory.filterType, allLabel: t.directory.allTypes, options: categories.map((c) => ({ value: c, label: t.businessCategory[c] })) },
          { key: "area", label: t.directory.filterArea, allLabel: t.directory.allAreas, options: areas.map((a) => ({ value: a, label: t.area[a] })) },
        ]}
        entries={list.map((b) => ({
          id: b.slug,
          facets: { type: b.categories, area: [b.area ?? "unknown"] },
          node: <BusinessCard business={b} lang={lang} t={t} headingLevel={2} />,
          mapItem: businessItem(b, lang),
        }))}
        empty={empty}
      />
    </div>
  );
}
