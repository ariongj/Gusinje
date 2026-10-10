/**
 * Room and bungalow types of both properties, as listed on Booking.com
 * (October 2026). Sizes are Booking's; one size the listing gets wrong is
 * left out. No prices or counts: the family confirms both per request.
 */

import { ownerPhotos as P, type SitePhoto } from "./photos";
import type { PropertyId } from "./properties";

export type UnitKind = "bungalow" | "room" | "camping";

export type Unit = {
  /** Also the element id on /rooms, so other pages can link to /rooms#<id>. */
  id: string;
  property: PropertyId;
  kind: UnitKind;
  name: string;
  /** m², when the listing gives a reliable one. */
  size?: number;
  beds: string;
  /** Most guests; null for camping (your own tent). */
  sleeps: number | null;
  features: string[];
  photo?: SitePhoto;
  note?: string;
};

export const units: readonly Unit[] = [
  // Eko Katun ROSI, Vusanje
  {
    id: "bungalow-3",
    property: "katun",
    kind: "bungalow",
    name: "Bungalow for three",
    size: 32,
    beds: "3 single beds",
    sleeps: 3,
    features: ["Private entrance", "Terrace with garden views", "Bathroom with bath & shower", "Seating & dining area", "Heating"],
    photo: P.katunBungalow3,
  },
  {
    id: "bungalow-4",
    property: "katun",
    kind: "bungalow",
    name: "Bungalow for four",
    size: 32,
    beds: "4 single beds",
    sleeps: 4,
    features: ["Living room + separate bedroom", "Bathroom with bath & shower", "Terrace", "Heating"],
    photo: P.katunBungalow4,
  },
  {
    id: "family-bungalow",
    property: "katun",
    kind: "bungalow",
    name: "Family bungalow",
    size: 36,
    beds: "3 single beds, 1 large double & a sofa bed",
    sleeps: 5,
    features: ["Living room + separate bedroom", "Bathroom with bath & shower", "Terrace", "Heating"],
    photo: P.katunFamilyBungalow,
  },
  {
    id: "family-room-4",
    property: "katun",
    kind: "room",
    name: "Family room for four",
    size: 32,
    beds: "2 single beds & 1 double",
    sleeps: 4,
    features: ["Private entrance", "Terrace with garden views", "Private bathroom with bath"],
    photo: P.katunFamilyRoom4,
  },
  {
    id: "family-room-5",
    property: "katun",
    kind: "room",
    name: "Family room for five",
    size: 32,
    beds: "3 single beds & 1 double",
    sleeps: 5,
    features: ["Private entrance", "Terrace with garden views", "Private bathroom with bath"],
    photo: P.katunFamilyRoom5,
  },
  {
    id: "camping",
    property: "katun",
    kind: "camping",
    name: "Camping on the meadow",
    beds: "Your own tent or camper van",
    sleeps: null,
    features: ["Pitches beside the bungalows", "Restaurant & bar a few steps away", "Hiking from the meadow"],
    photo: P.katunTents,
    note: "Ask us about pitches and prices.",
  },
  // Hotel ROSI, Gusinje
  {
    id: "double",
    property: "hotel",
    kind: "room",
    name: "Double room",
    size: 24,
    beds: "1 large double bed",
    sleeps: 2,
    features: ["Air conditioning", "Terrace with mountain views", "Private bathroom", "Flat-screen TV"],
    photo: P.hotelDouble,
  },
  {
    id: "twin",
    property: "hotel",
    kind: "room",
    name: "Twin room",
    size: 25,
    beds: "2 single beds",
    sleeps: 2,
    features: ["Air conditioning", "Terrace with mountain views", "Private bathroom", "Flat-screen TV"],
    photo: P.hotelTwin,
  },
  {
    id: "triple",
    property: "hotel",
    kind: "room",
    name: "Comfort triple room",
    size: 30,
    beds: "3 single beds",
    sleeps: 3,
    features: ["Air conditioning", "Terrace with mountain views", "Private bathroom with shower", "Flat-screen TV"],
    photo: P.hotelTriple,
  },
  {
    id: "quadruple",
    property: "hotel",
    kind: "room",
    name: "Room for three",
    size: 30,
    beds: "3 single beds",
    sleeps: 3,
    features: ["Air conditioning", "Desk", "Private bathroom", "Cable TV"],
    photo: P.hotelQuadruple,
    note: "Listed on Booking.com as “Quadruple Room”.",
  },
  {
    id: "quadruple-balcony",
    property: "hotel",
    kind: "room",
    name: "Quadruple room with balcony",
    size: 35,
    beds: "4 single beds",
    sleeps: 4,
    features: ["Balcony with mountain views", "Air conditioning", "Private bathroom", "Dining table"],
    photo: P.hotelQuadrupleBalcony,
  },
  {
    id: "deluxe-family",
    property: "hotel",
    kind: "room",
    name: "Deluxe family room",
    size: 30,
    beds: "1 single & 1 large double bed, plus a sofa bed",
    sleeps: 4,
    features: ["Air conditioning", "Terrace with mountain views", "Private bathroom", "Sofa bed"],
    note: "Photos of this room are coming soon.",
  },
  {
    id: "family-mountain",
    property: "hotel",
    kind: "room",
    name: "Family room with mountain view",
    beds: "2 single beds or 1 large double",
    sleeps: 4,
    features: ["Private entrance", "Terrace with mountain views", "Bathroom with bath", "Sitting area"],
    photo: P.hotelFamilyMountain,
  },
];

export function unitsFor(property: PropertyId): Unit[] {
  return units.filter((unit) => unit.property === property);
}

/** Unit types that can host `guests` people (camping always fits). */
export function unitsThatFit(property: PropertyId, guests: number): Unit[] {
  return unitsFor(property).filter((unit) => unit.sleeps === null || unit.sleeps >= guests);
}

export function getUnit(id: string | null | undefined): Unit | undefined {
  return id ? units.find((unit) => unit.id === id) : undefined;
}
