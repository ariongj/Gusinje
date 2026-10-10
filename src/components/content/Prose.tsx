import type { ProseSection } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import ui from "@/styles/ui.module.css";

import { SourceList } from "./SourceList";
import styles from "./Prose.module.css";

/** Long-form sections, each with its sources tucked into a disclosure. */
export function Prose({ sections, lang, t }: { sections: ProseSection[]; lang: Locale; t: Messages }) {
  return (
    <div className={styles.prose}>
      {sections.map((s, i) => (
        <section key={i} aria-labelledby={`p${i}`} className={styles.section}>
          <h2 id={`p${i}`} className={ui.h2}>
            {loc(s.heading, lang)}
          </h2>
          <div className={ui.prose}>
            {loc(s.body, lang).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {s.sources && s.sources.length > 0 && (
            <details className={styles.sources}>
              <summary>{t.common.sources}</summary>
              <SourceList ids={s.sources} lang={lang} t={t} />
            </details>
          )}
        </section>
      ))}
    </div>
  );
}
