import Link from "next/link";

import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./AskFamilyCta.module.css";
import { familyHelps, askFamilyHref } from "./content";

export function AskFamilyCta() {
  return (
    <section className={styles.section} aria-labelledby="ask-family-title">
      <div className={styles.panel} data-reveal="up">
        <div className={styles.copy}>
          <p className={ui.eyebrowLight}>Ask the family</p>
          <h2 id="ask-family-title" className={cx(ui.h2Light, styles.title)}>
            Local knowledge, <em>one message away</em>
          </h2>
          <p className={cx(ui.leadLight, styles.lead)}>
            The family has lived in these valleys for generations. Tell them what you&rsquo;d like to see and how far
            you like to walk, and they&rsquo;ll help with the rest.
          </p>
          <div className={styles.actions}>
            <Link href={askFamilyHref} className={ui.btnGold}>
              Ask about routes & rides
            </Link>
            <Link href="/tour" className={ui.btnOutlineLight}>
              Fly the valley in 3D
            </Link>
          </div>
        </div>

        <ul className={styles.helps}>
          {familyHelps.map((help, i) => (
            <li key={help.title} className={styles.help}>
              <span className={styles.helpNumber} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.helpTitle}>{help.title}</h3>
                <p className={styles.helpText}>{help.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
