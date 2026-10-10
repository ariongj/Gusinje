"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Notice } from "@/components/ui/Notice";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import type { CatalogueEntry } from "@/lib/catalogue";
import { decodeTrip, itemKey, type Trip } from "@/lib/trip";
import ui from "@/styles/ui.module.css";

import { AddTemplateButton } from "./AddTemplateButton";
import styles from "./TripPlanner.module.css";

/** A read-only trip decoded from the link's #fragment. Nothing is fetched or stored. */
export function SharedTrip({ catalogue }: { catalogue: Record<string, CatalogueEntry> }) {
  const { t } = useI18n();
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  useEffect(() => {
    const read = () => setTrip(decodeTrip(window.location.hash.slice(1)));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (trip === undefined) return <p className={ui.muted}>{t.common.loading}</p>;
  if (trip === null) return <Notice tone="warning">{t.plan.sharedInvalid}</Notice>;

  const groups = [
    ...Array.from({ length: trip.days }, (_, i) => ({ day: (i + 1) as number | null, items: trip.items.filter((x) => x.day === i + 1) })),
    { day: null as number | null, items: trip.items.filter((x) => x.day === null) },
  ].filter((g) => g.items.length);

  return (
    <div className={styles.planner} data-testid="shared-trip">
      {groups.map((group) => (
        <section key={group.day ?? "u"} className={styles.day}>
          <h2 className={styles.dayTitle}>{group.day ? fill(t.plan.day, { n: group.day }) : t.plan.unscheduled}</h2>
          <ol className={styles.items}>
            {group.items.map((item) => {
              const entry = catalogue[itemKey(item)];
              return (
                <li key={itemKey(item)} className={styles.item}>
                  <p className={styles.kind}>{entry?.kindLabel}</p>
                  {entry ? (
                    <Link href={entry.href} className={styles.itemTitle}>
                      {entry.title}
                    </Link>
                  ) : (
                    <span className={styles.itemTitle}>{t.plan.unknownItem}</span>
                  )}
                  {item.note && <p className={ui.small}>{item.note}</p>}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <AddTemplateButton trip={trip} label={t.plan.copyToMine} />
    </div>
  );
}
