import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ExperienceGrid.module.css";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { askFamilyHref, type Season } from "./content";

/**
 * Bento grid for one season: a large feature card, the rest in a 3-column
 * grid, and an "ask the family" tile that fills whatever is left of the last row.
 * On phones it becomes a swipeable row of cards.
 */
export function ExperienceGrid({ season }: { season: Season }) {
  const { experiences, plan } = season;
  // Feature takes 2×2, the next two stack beside it, the rest fill rows of three.
  const usedInLastRow = Math.max(0, experiences.length - 3) % 3;
  const planSpan = usedInLastRow === 0 ? styles.span3 : usedInLastRow === 1 ? styles.span2 : undefined;
  // On tablets (two columns, feature full width) an odd number of other cards
  // leaves a gap in the last row: the tile fills it instead of taking a row.
  const planFillsTabletRow = (experiences.length - 1) % 2 === 1;

  return (
    <>
      <p className={styles.swipeHint} aria-hidden="true">
        Swipe for more <span className={styles.swipeArrow}>&rarr;</span>
      </p>
      <ul className={styles.grid} aria-label={`${season.label} experiences`}>
        {experiences.map((item, i) => (
          <li key={item.title} className={cx(styles.card, i === 0 && styles.feature)}>
            <div className={styles.media}>
              <Photo
                src={item.image.src}
                alt={item.image.alt}
                position={item.image.position}
                sizes={
                  i === 0
                    ? "(max-width: 640px) 86vw, (max-width: 980px) 100vw, 66vw"
                    : "(max-width: 640px) 86vw, (max-width: 980px) 50vw, 33vw"
                }
              />
            </div>
            <div className={styles.shade} aria-hidden="true" />
            <p className={styles.chip}>
              <span>{item.season}</span>
              <span className={styles.chipDot} aria-hidden="true" />
              <span>{item.duration}</span>
            </p>
            <div className={styles.body}>
              <h3 className={styles.name}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
              {item.link && (
                <Link href={item.link.href} className={styles.link}>
                  {item.link.label} <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
              <PhotoCredit credit={item.image.credit} className={styles.credit} />
            </div>
          </li>
        ))}

        <li className={cx(styles.plan, planSpan, planFillsTabletRow && styles.planHalf)}>
          <p className={styles.planKicker}>Local advice</p>
          <h3 className={styles.planTitle}>{plan.title}</h3>
          <p className={styles.planText}>{plan.text}</p>
          <Link href={askFamilyHref} className={cx(ui.btnGold, styles.planButton)}>
            Write to the family
          </Link>
        </li>
      </ul>
    </>
  );
}
