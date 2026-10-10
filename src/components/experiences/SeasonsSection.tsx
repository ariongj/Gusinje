import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { ExperienceGrid } from "./ExperienceGrid";
import { SeasonSwitcher } from "./SeasonSwitcher";
import styles from "./SeasonsSection.module.css";
import { seasons, summer, winter } from "./content";

/** "Pick a season": the summer / winter switcher and its bento grids. */
export function SeasonsSection() {
  return (
    <section id="seasons" className={styles.section} aria-labelledby="seasons-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal="up">
          <p className={ui.eyebrow}>Things to do</p>
          <h2 id="seasons-title" className={cx(ui.h2, styles.title)}>
            Summer trails, <em>winter quiet</em>
          </h2>
        </div>
        <SeasonSwitcher
          options={seasons.map(({ key, label, intro }) => ({ key, label, intro }))}
          panels={{
            summer: <ExperienceGrid season={summer} />,
            winter: <ExperienceGrid season={winter} />,
          }}
        />
      </div>
    </section>
  );
}
