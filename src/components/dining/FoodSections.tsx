import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { ownerPhotos as P } from "@/lib/stay/photos";
import ui from "@/styles/ui.module.css";

import styles from "./FoodSections.module.css";

const breakfastPhotos = [P.katunSpread, P.katunBreadCheese, P.katunPie];

/** Breakfast at both places, as guests describe it. */
export function Breakfast() {
  return (
    <section id="breakfast" className={cx(ui.section, styles.breakfast)}>
      <div className={cx(ui.container, styles.split)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Breakfast
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            A proper <em>mountain breakfast</em>
          </p>
          <p className={cx(ui.lead, styles.mt24)} data-reveal="up" data-delay="120">
            Pies and flatbread, white cheese, kajmak and yoghurt, eggs, jams and pancakes, fresh juice and a real
            coffee — eaten on the terrace whenever the weather allows. At the katun guests remember the home-made
            cheese and the elderberry juice; at the hotel, the view from the glass-walled terrace.
          </p>
          <p className={styles.note} data-reveal="up" data-delay="160">
            Setting off early? Ask for breakfast to go or a picnic pack for the trail the evening before.
          </p>
        </div>
        <div className={styles.photos} data-reveal="scale">
          {breakfastPhotos.map((photo) => (
            <div key={photo.src} className={styles.photo}>
              <Photo src={photo.src} alt={photo.alt} sizes="(max-width: 900px) 33vw, 220px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Dishes of the region — not a menu; ask what's cooking today. */
const dishes = [
  { name: "Kačamak", text: "A warming cornmeal dish served with cheese and kajmak — mountain comfort food." },
  { name: "Cicvara", text: "Cornmeal cooked slowly in cream and cheese until rich and golden." },
  { name: "Flija", text: "Thin layers of batter baked one by one under the sač, the iron bell of the hearth." },
  { name: "Pies", text: "Pita with cheese, meat or greens, baked in a round tray and cut in wedges." },
  { name: "Cheese & kajmak", text: "Fresh white cheese and kajmak, the thick clotted cream of the mountain dairies." },
  { name: "Wild blueberries", text: "Picked on the slopes in summer and turned into juices and desserts." },
];

export function RegionalFood() {
  return (
    <section id="regional" className={cx(ui.section, styles.regional)}>
      <div className={ui.container}>
        <div className={styles.head}>
          <div>
            <h2 className={cx(ui.eyebrowLight, styles.m0)} data-reveal="up">
              Food of the Prokletije
            </h2>
            <p className={cx(ui.h2Light, styles.mt18)} data-reveal="up" data-delay="80">
              What&apos;s on <em>the mountain table</em>
            </p>
          </div>
          <p className={cx(ui.leadLight, styles.headLead)} data-reveal="up" data-delay="120">
            Dishes you&apos;ll meet across the valleys of Gusinje and Plav. Not a menu — ask what the kitchen is cooking
            today.
          </p>
        </div>
        <ul className={styles.dishes}>
          {dishes.map((dish, i) => (
            <li key={dish.name} className={styles.dish} data-reveal="up" data-delay={String((i % 3) * 70)}>
              <h3 className={styles.dishName}>{dish.name}</h3>
              <p className={styles.dishText}>{dish.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Groups() {
  return (
    <section id="groups" className={cx(ui.section, styles.groups)}>
      <div className={cx(ui.container, styles.groupsCard)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)}>Groups & tables</h2>
          <p className={cx(styles.groupsTitle)}>Coming with a group, or just for a meal?</p>
          <p className={styles.groupsText}>
            Hiking groups, family get-togethers and travellers passing through are all welcome. Tell us how many you are
            and when, and the family will set a table — the hotel also has a room for meetings and banquets.
          </p>
        </div>
        <Link href={contactHref({ topic: "restaurant" })} className={ui.btnGold}>
          Ask about a table
        </Link>
      </div>
    </section>
  );
}
