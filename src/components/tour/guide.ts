import type { ViewId } from "@/components/resort3d/resortEngine";
import { contactHref } from "@/lib/contact-link";

/** One stop of the guided tour: a view of the 3D valley map. */
export type GuideStop = {
  kind: "map";
  view: ViewId;
  kicker: string;
  title: string;
  /** Narration, shown on the guide card and read aloud when voice is on. */
  text: string;
  link?: { label: string; href: string };
};

/** Facts as in the project fact sheet; see the place list in resort3d/pois.ts. */
export const guideStops: readonly GuideStop[] = [
  {
    kind: "map",
    view: "overview",
    kicker: "Gusinje & Vusanje, Montenegro",
    title: "Welcome to the valley",
    text: "This is the valley of Gusinje and Vusanje, at the foot of the Prokletije — the Accursed Mountains. I'll show you around: press next whenever you like, or just let the tour play.",
  },
  {
    kind: "map",
    view: "hotel",
    kicker: "Stay in town",
    title: "Hotel ROSI",
    text: "The family's hotel stands on the road into Gusinje: a 3-star hotel with Restaurant Rosi — pizza, Italian and local dishes — and a minimarket downstairs.",
    link: { label: "The hotel", href: "/hotel" },
  },
  {
    kind: "map",
    view: "gusinje",
    kicker: "The town",
    title: "Gusinje",
    text: "Gusinje lies about 920 metres up, where the Vruja and the Grnčar meet to form the Ljuča. It has been a stop on the old caravan road to Peć since the fourteenth century.",
  },
  {
    kind: "map",
    view: "springs",
    kicker: "Half an hour on foot",
    title: "Ali Pasha's Springs",
    text: "About two kilometres south of town, karst springs fill a broad, clear pool — named after Ali Pasha of Gusinje. It's around thirty minutes' walk from the hotel or the katun.",
  },
  {
    kind: "map",
    view: "katun",
    kicker: "Stay in Vusanje",
    title: "Eko Katun ROSI",
    text: "Further up the valley is the katun: wooden bungalows, family rooms and camping on a working mountain farm, with Restaurant ROSI Tradicional and sheep, horses and ponies on the meadow.",
    link: { label: "The eko katun", href: "/katun" },
  },
  {
    kind: "map",
    view: "tower",
    kicker: "At the katun",
    title: "The old stone tower",
    text: "The family's kula has stood for around three centuries and was last restored in 1981. Today it is a small living museum, with the first telephone and radio ever to reach the village.",
    link: { label: "The tower", href: "/katun#tower" },
  },
  {
    kind: "map",
    view: "grlja",
    kicker: "1.2 km from the katun",
    title: "Grlja waterfall",
    text: "A short walk from the katun, the Skakavica drops about fifteen metres into the Grlja canyon — with three more falls inside, the highest about twenty-five metres.",
  },
  {
    kind: "map",
    view: "blueEye",
    kicker: "The Blue Eye",
    title: "Oko Skakavice",
    text: "About a kilometre and a half on from Grlja is Oko Skakavice: the cold, clear spring pool where the Skakavica begins.",
  },
  {
    kind: "map",
    view: "ropojana",
    kicker: "Prokletije National Park",
    title: "The Ropojana valley",
    text: "Beyond Vusanje the Ropojana runs south to the Albanian border between limestone walls. The Peaks of the Balkans trail follows it towards Theth.",
    link: { label: "Hikes & routes", href: "/experiences#seasons" },
  },
  {
    kind: "map",
    view: "karanfili",
    kicker: "The Dolomites of Montenegro",
    title: "Karanfili",
    text: "West of the Ropojana rises Karanfili, a three-peak massif whose wall stands about eight hundred metres above the Grbaja valley.",
  },
  {
    kind: "map",
    view: "zlaKolata",
    kicker: "2,534 m",
    title: "Zla Kolata",
    text: "On the border to the south-east is Zla Kolata, the highest summit in Montenegro — about six and a half hours up from Vusanje. Go between June and September, with a local guide.",
    link: { label: "Hikes & routes", href: "/experiences#seasons" },
  },
  {
    kind: "map",
    view: "hero",
    kicker: "Thank you for visiting",
    title: "See you in the valley",
    text: "That's the valley. Send your dates to the family — there are no booking fees, and they'll reply with availability and the price.",
    link: { label: "Send a request", href: `${contactHref()}#write` },
  },
];

/** How long a stop stays up when the tour plays without voice. */
export function stopDuration(stop: GuideStop): number {
  const words = stop.text.split(/\s+/).length;
  return Math.min(13000, Math.max(8000, 5200 + words * 260));
}

/** Whole guided tour without voice, rounded to the minute (at least one). */
export const guideMinutes = Math.max(1, Math.round(guideStops.reduce((ms, stop) => ms + stopDuration(stop), 0) / 60000));
