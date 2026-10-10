import { commonsPhotos as C, ownerPhotos as P, type SitePhoto } from "@/lib/stay/photos";

/** Places marked on the 3D valley map. */
export type PoiId =
  | "hotel"
  | "gusinje"
  | "springs"
  | "katun"
  | "tower"
  | "grlja"
  | "blueEye"
  | "ropojana"
  | "karanfili"
  | "zlaKolata";

export type Poi = {
  id: PoiId;
  name: string;
  /** Short line above the name, e.g. "Stay in town". */
  kind: string;
  blurb: string;
  link: { label: string; href: string };
  photo: SitePhoto;
};

/**
 * Facts from the project fact sheet (Gusinje municipality, Prokletije National
 * Park, SummitPost, the properties' own listings); distances are approximate.
 */
export const pois: readonly Poi[] = [
  {
    id: "hotel",
    name: "Hotel ROSI",
    kind: "Stay in town",
    blurb:
      "The family's 3-star hotel on the road into Gusinje, with Restaurant Rosi — pizza, Italian and local dishes — and a minimarket downstairs.",
    link: { label: "The hotel", href: "/hotel" },
    photo: P.hotelBuilding,
  },
  {
    id: "gusinje",
    name: "Gusinje",
    kind: "The town",
    blurb:
      "A small town about 920 m up, where the Vruja and the Grnčar meet to form the Ljuča — a caravan stop on the old road to Peć since the 14th century.",
    link: { label: "Explore the valley", href: "/experiences" },
    photo: C.gusinjeHouses,
  },
  {
    id: "springs",
    name: "Ali Pasha's Springs",
    kind: "2 km from town",
    blurb:
      "Karst springs about 2 km south of Gusinje, feeding a broad, clear pool — named after Ali Pasha of Gusinje. Around 30 minutes on foot from either place.",
    link: { label: "Things to do", href: "/experiences#seasons" },
    photo: C.aliPashaSprings,
  },
  {
    id: "katun",
    name: "Eko Katun ROSI",
    kind: "Stay in Vusanje",
    blurb:
      "Wooden bungalows, family rooms and camping on a working mountain farm, with Restaurant ROSI Tradicional and sheep, horses and ponies on the meadow.",
    link: { label: "The eko katun", href: "/katun" },
    photo: P.katunAerial,
  },
  {
    id: "tower",
    name: "The old stone tower",
    kind: "At the katun",
    blurb:
      "The family's kula has stood for around three centuries. Today it is a small living museum of mountain life — with the first telephone and radio to reach the village.",
    link: { label: "The tower", href: "/katun#tower" },
    photo: P.katunStoneHouse,
  },
  {
    id: "grlja",
    name: "Grlja waterfall",
    kind: "1.2 km from the katun",
    blurb:
      "The Skakavica drops about 15 m into the Grlja canyon, with three more falls inside — the highest about 25 m.",
    link: { label: "Things to do", href: "/experiences#seasons" },
    photo: C.grlja,
  },
  {
    id: "blueEye",
    name: "Oko Skakavice",
    kind: "The Blue Eye",
    blurb: "The cold, clear spring pool where the Skakavica begins, about 1.5 km on from Grlja.",
    link: { label: "Things to do", href: "/experiences#seasons" },
    photo: C.blueEye,
  },
  {
    id: "ropojana",
    name: "The Ropojana valley",
    kind: "Prokletije National Park",
    blurb:
      "A long glacial valley running from Vusanje to the Albanian border between limestone walls — and the way to Theth on the Peaks of the Balkans.",
    link: { label: "Hikes & routes", href: "/experiences#seasons" },
    photo: C.ropojanaMeadow,
  },
  {
    id: "karanfili",
    name: "Karanfili",
    kind: "The “Dolomites of Montenegro”",
    blurb: "A three-peak massif whose wall rises about 800 m above the Grbaja valley, west of the Ropojana.",
    link: { label: "Hikes & routes", href: "/experiences#seasons" },
    photo: C.karanfili,
  },
  {
    id: "zlaKolata",
    name: "Zla Kolata",
    kind: "2,534 m",
    blurb:
      "Montenegro's highest summit, on the Albanian border — about 6.5 hours up from Vusanje. Go between June and September, with a local guide.",
    link: { label: "Hikes & routes", href: "/experiences#seasons" },
    photo: { ...C.zlaKolataSummit, position: "40% 50%" },
  },
];

export function getPoi(id: PoiId): Poi {
  const poi = pois.find((p) => p.id === id);
  if (!poi) throw new Error(`Unknown place: ${id}`);
  return poi;
}

export function isPoiId(value: string): value is PoiId {
  return pois.some((p) => p.id === value);
}
