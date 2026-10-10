/**
 * Copy and imagery for the home page. Owner photos come from the properties'
 * Booking.com listings; destination photos are from Wikimedia Commons and
 * keep their credit line (see src/lib/stay/photos.ts).
 */

import { commonsPhotos as C, ownerPhotos as P, type SitePhoto } from "@/lib/stay/photos";

export const hero = {
  kicker: "Gusinje · Vusanje · Montenegro",
  lead: "A family-run eco katun with wooden bungalows in Vusanje, and our hotel in Gusinje — at the foot of the Prokletije, the Accursed Mountains. Fly over the valley in 3D, or let us show you around.",
};

/** "Life on the katun" — three things guests remember. */
export const katunLife: { title: string; text: string; image: SitePhoto }[] = [
  {
    title: "An old stone tower",
    text: "Around 300 years old and last restored in 1981, the family's stone tower is kept as a small museum of mountain life — with the first telephone and the first radio ever to reach Vuthaj.",
    image: P.katunMuseumRoom,
  },
  {
    title: "Animals on the meadow",
    text: "Sheep, horses and ponies wander past the bungalows in the morning. Children love them; so do most grown-ups.",
    image: P.katunPony,
  },
  {
    title: "Home cooking",
    text: "Restaurant ROSI Tradicional cooks the mountain way — pies, cheese, kajmak, slow-roasted meat — and packs picnics for the trail.",
    image: P.katunFeast,
  },
];

/** Places a short walk or drive from the katun (distances are approximate). */
export const nearby: { name: string; distance: string; text: string; image: SitePhoto }[] = [
  {
    name: "Grlja waterfall",
    distance: "about 1.2 km from the katun",
    text: "The Skakavica river drops about 15 m into a deep blue pool at the mouth of the Grlja canyon.",
    image: C.grlja,
  },
  {
    name: "Ali Pasha's Springs",
    distance: "about 2 km · 30 min on foot",
    text: "Karst springs south of Gusinje feeding a clear, shallow pool — a favourite summer meeting place.",
    image: C.aliPashaSprings,
  },
  {
    name: "Oko Skakavice",
    distance: "about 2.2 km from the katun",
    text: "The “Blue Eye”: a deep, cold spring pool where the Skakavica river begins.",
    image: C.blueEye,
  },
  {
    name: "Ropojana valley",
    distance: "starts about 2.5 km away",
    text: "A long glacial valley running south to the Albanian border, walled by limestone peaks.",
    image: C.ropojanaMeadow,
  },
];

export const galleryFilters = [
  { key: "all", label: "All" },
  { key: "katun", label: "Eko Katun" },
  { key: "hotel", label: "Hotel" },
  { key: "valley", label: "The valley" },
] as const;

export type GalleryKey = Exclude<(typeof galleryFilters)[number]["key"], "all">;

export const gallery: { category: GalleryKey; ratio: string; image: SitePhoto }[] = [
  { category: "katun", ratio: "4 / 3", image: P.katunAerial },
  { category: "valley", ratio: "3 / 4", image: C.grlja },
  { category: "katun", ratio: "1 / 1", image: P.katunBungalow },
  { category: "hotel", ratio: "4 / 3", image: P.hotelBuilding },
  { category: "katun", ratio: "3 / 4", image: P.katunBlueHour },
  { category: "valley", ratio: "4 / 3", image: C.gusinjeValley },
  { category: "katun", ratio: "4 / 3", image: P.katunSheep },
  { category: "hotel", ratio: "4 / 3", image: P.hotelDouble },
  { category: "katun", ratio: "1 / 1", image: P.katunTerrace },
  { category: "valley", ratio: "4 / 3", image: C.karanfili },
  { category: "hotel", ratio: "4 / 3", image: P.hotelMoonView },
  { category: "katun", ratio: "3 / 4", image: P.katunPergola },
];

