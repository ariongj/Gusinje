/**
 * Copy and imagery for the Explore page — the Prokletije around Gusinje and
 * Vusanje. Facts come from the Gusinje municipality, Prokletije National
 * Park, montenegro.travel, the Peaks of the Balkans and Wikipedia (see the
 * project fact sheet); distances are approximate. Landscape photos are from
 * Wikimedia Commons and must keep their credit line.
 */

import type { Credit as PhotoCredit } from "@/components/ui/PhotoCredit";
import { contactHref } from "@/lib/contact-link";
import { commonsPhotos as C } from "@/lib/stay/photos";

export type { PhotoCredit };

/** Every "ask the family" link opens the contact form on the guides & transfers topic. */
export const askFamilyHref = contactHref({ topic: "transfer" });

export type ExperienceImage = {
  src: string;
  alt: string;
  /** CSS object-position for the crop. */
  position?: string;
  credit?: PhotoCredit;
};

export type Experience = {
  title: string;
  /** One line — what you do there. */
  text: string;
  /** Chip: when, and roughly how long. */
  season: string;
  duration: string;
  image: ExperienceImage;
  link?: { label: string; href: string };
};

export type SeasonKey = "summer" | "winter";

export type Season = {
  key: SeasonKey;
  label: string;
  /** Line under the switcher while this season is selected. */
  intro: string;
  /** "Ask the family" tile at the end of the grid. */
  plan: { title: string; text: string };
  /** The first experience is the large feature card. */
  experiences: readonly Experience[];
};

export const heroImage: ExperienceImage = { ...C.ropojanaUpper, position: "50% 60%" };

/** Big numbers in the valley introduction. */
export const lakeStats = [
  { value: "2,534 m", label: "Zla Kolata — Montenegro's highest peak", accent: true },
  { value: "2009", label: "Prokletije National Park founded" },
  { value: "192 km", label: "Peaks of the Balkans, through three countries" },
  { value: "≈2 km", label: "From Gusinje to Ali Pasha's Springs" },
];

const plavWinter: ExperienceImage = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Plav_Lake_Winter_Aerial_View_2.jpg/1280px-Plav_Lake_Winter_Aerial_View_2.jpg",
  alt: "Lake Plav from the air in winter, snow on the mountains around it",
  credit: {
    author: "Albinfo",
    license: "CC0",
    href: "https://commons.wikimedia.org/wiki/File:Plav_Lake_Winter_Aerial_View_2.jpg",
  },
};

export const summer: Season = {
  key: "summer",
  label: "Summer",
  intro: "June to September is the hiking season: snow lingers on the high ground into early summer, and the springs run full.",
  plan: {
    title: "Not sure where to start?",
    text: "Tell the family how far you like to walk — they'll suggest a route, pack you a picnic and help with a ride to the trailhead.",
  },
  experiences: [
    {
      title: "Grlja waterfall & the Blue Eye",
      text: "A short walk from the katun, the Skakavica river drops about 15 m into the Grlja canyon. A little further up, Oko Skakavice — the Blue Eye — is the cold spring pool where it begins.",
      season: "From the katun",
      duration: "1–2 hours",
      image: C.grlja,
    },
    {
      title: "Ali Pasha's Springs",
      text: "Karst springs about 2 km south of Gusinje feeding a broad, shallow pool — named after Ali Pasha of Gusinje, and busy with a big gathering every August.",
      season: "Summer",
      duration: "30 min on foot",
      image: C.aliPashaSprings,
    },
    {
      title: "The Ropojana valley",
      text: "A long glacial valley running from Vusanje to the Albanian border between limestone walls. The national park's bike route from Gusinje to Lake Ropojana and back is about 23 km; the lake dries up in high summer.",
      season: "Summer",
      duration: "Half day",
      image: C.ropojanaMeadow,
    },
    {
      title: "Grbaja & Karanfili",
      text: "The “Dolomites of Montenegro”: Karanfili's wall rises about 800 m above the Grbaja valley, some 7 km from Gusinje. The Grbaja – Volušnica loop is a classic day hike.",
      season: "Summer",
      duration: "Day hike",
      image: C.karanfili,
    },
    {
      title: "Zla Kolata",
      text: "Montenegro's highest summit, 2,534 m, on the Albanian border — about 6.5 hours up from Vusanje via Grlata. Go between June and September, with a local guide.",
      season: "June – September",
      duration: "Long day",
      image: { ...C.zlaKolataSummit, position: "40% 50%" },
    },
    {
      title: "Peaks of the Balkans to Theth",
      text: "Vusanje is a stage on the 192 km trail through three countries. The day to Theth in Albania is about 21 km over Qafa e Pejës; border permits must be arranged in advance.",
      season: "Summer",
      duration: "1 day",
      image: C.ropojanaHiker,
    },
    {
      title: "Lake Plav",
      text: "Montenegro's largest glacial lake, about 11 km from Gusinje: swims from the shore, kayaks and pedal boats in summer.",
      season: "Summer",
      duration: "20 min by car",
      image: C.lakePlavLilies,
    },
  ],
};

export const winter: Season = {
  key: "winter",
  label: "Winter",
  intro: "Winters are long and snowy in the high Prokletije, while the roads to Gusinje and Plav stay open — a quiet, white time in the valley.",
  plan: {
    title: "Coming in winter?",
    text: "Ask the family about road conditions, what's open and how to warm up after a day in the snow.",
  },
  experiences: [
    {
      title: "Snow on the Prokletije",
      text: "In the national park the snow can lie for 90 to 210 days a year. From the valley, the white walls of Karanfili and the Ropojana are a sight on their own.",
      season: "Winter",
      duration: "Any day",
      image: C.karanfilWinter,
    },
    {
      title: "Snowshoes & a frozen lake",
      text: "In deep winter Lake Plav freezes over. Above it, on Kofiljača, the marked Paljevi trail is made for snowshoes — ask the family about a local guide.",
      season: "Deep winter",
      duration: "20 min by car",
      image: plavWinter,
    },
    {
      title: "Spring snow on the peaks",
      text: "Snow lies on the high peaks long after the valley turns green — sheep on the meadows below Gusinje, white walls above.",
      season: "Spring",
      duration: "Any day",
      image: C.gusinjeValley,
    },
  ],
};

export const seasons: readonly Season[] = [summer, winter];

/** What the family can help with — the closing call to action. */
export const familyHelps = [
  { title: "Routes & advice", text: "Which trail, how long, what the weather is doing — ask before you set off." },
  { title: "Rides & transfers", text: "Shuttles to trailheads and the airport on request (extra charge)." },
  { title: "Food for the trail", text: "Packed lunches and breakfast to go, ready the evening before." },
] as const;
