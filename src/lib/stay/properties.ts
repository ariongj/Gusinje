/**
 * The two ROSI properties. Facts come from their Booking.com listings,
 * Google Maps, Instagram/Facebook and the Gusinje Tourism Organisation
 * (checked October 2026). Nothing here is a price or a room count — the
 * family confirms availability and rates for each request.
 */

import { ownerPhotos as P, type SitePhoto } from "./photos";

export type PropertyId = "katun" | "hotel";

export type Score = {
  source: "Booking.com" | "Google";
  /** e.g. "9.0" */
  score: string;
  /** e.g. "/10" */
  scale: string;
  reviews: number;
  href: string;
};

export type Distance = { place: string; distance: string; note?: string };

export type Property = {
  id: PropertyId;
  name: string;
  /** Nav-sized name, e.g. "Eko Katun". */
  shortName: string;
  /** Village / town. */
  place: string;
  /** One-line description for cards. */
  kind: string;
  summary: string;
  href: `/${PropertyId}`;
  address: { line1: string; locality: string; postcode: string; country: string; countryCode: "ME" };
  coords: { lat: number; lng: number };
  /** Way-finding hint for arriving guests. */
  findUs: string;
  booking: { url: string; listedAs: string };
  checkIn: string;
  checkOut: string;
  policies: { label: string; value: string }[];
  scores: Score[];
  /** When the scores were read. */
  scoresDate: string;
  /** Category scores from Booking.com worth showing. */
  highlights: { label: string; score: string }[];
  facilities: string[];
  restaurant: { name: string; cuisine: string; text: string; meals: string[]; dietary: string[] };
  distances: Distance[];
  languages: string[];
  photos: { hero: SitePhoto; card: SitePhoto; gallery: SitePhoto[] };
};

const BOOKING_KATUN = "https://www.booking.com/hotel/me/ethno-katun-rosi-agrotourism.html";
const BOOKING_HOTEL = "https://www.booking.com/hotel/me/rosi-gusinje.html";

export const katun: Property = {
  id: "katun",
  name: "Eko Katun ROSI",
  shortName: "Eko Katun",
  place: "Vusanje",
  kind: "Wooden bungalows, family rooms & camping",
  summary:
    "A family-run eco katun at the head of the Vusanje valley: wooden bungalows and family rooms on a meadow with sheep, horses and ponies, home cooking from Restaurant ROSI Tradicional, and an old stone tower kept as a little museum — a short walk from the Grlja waterfall and Ali Pasha's Springs.",
  href: "/katun",
  address: { line1: "Vusanje", locality: "Gusinje", postcode: "84326", country: "Montenegro", countryCode: "ME" },
  coords: { lat: 42.531724, lng: 19.8325485 },
  findUs: "Look for the ROSI sign by the bridge on the road from Gusinje to Vusanje; park beside the bungalows.",
  booking: { url: BOOKING_KATUN, listedAs: "Ethno Katun ROSI Agrotourism" },
  checkIn: "15:00–23:00",
  checkOut: "08:00–11:00",
  policies: [
    { label: "Check-in", value: "15:00–23:00" },
    { label: "Check-out", value: "08:00–11:00" },
    { label: "Payment", value: "Cash only" },
    { label: "Children", value: "Welcome — cots on request, no extra beds" },
    { label: "Pets", value: "Please ask us first" },
    { label: "Quiet", value: "No parties or stag/hen groups" },
  ],
  scores: [
    { source: "Booking.com", score: "9.0", scale: "/10", reviews: 452, href: BOOKING_KATUN },
    {
      source: "Google",
      score: "4.7",
      scale: "/5",
      reviews: 419,
      href: "https://www.google.com/maps/search/?api=1&query=Ethno%20Katun%20ROSI%20Agrotourism",
    },
  ],
  scoresDate: "October 2026",
  highlights: [
    { label: "Staff", score: "9.7" },
    { label: "Location", score: "9.6" },
    { label: "Value", score: "9.3" },
  ],
  facilities: [
    "Restaurant ROSI Tradicional",
    "Bar & coffee house",
    "Garden, terrace & picnic area",
    "Outdoor play area",
    "Movie nights",
    "Farm animals",
    "Free parking",
    "Free Wi-Fi in shared areas",
    "Airport shuttle on request (extra charge)",
  ],
  restaurant: {
    name: "Restaurant ROSI Tradicional",
    cuisine: "Traditional mountain cooking",
    text: "Home cooking in the old way — guests write about meals cooked on wood, home-made cheese and elderberry juice at breakfast. Hikers can take a picnic pack for the trail.",
    meals: ["Breakfast", "Lunch", "Dinner", "Breakfast to go"],
    dietary: ["Vegetarian", "Vegan", "Halal", "Gluten-free breakfast"],
  },
  distances: [
    { place: "Grlja waterfall", distance: "about 1.2 km" },
    { place: "Ali Pasha's Springs", distance: "about 2 km", note: "around 30 minutes on foot" },
    { place: "Oko Skakavice (Blue Eye)", distance: "about 2.2 km" },
    { place: "Ropojana valley", distance: "about 2.5 km" },
    { place: "Grbaja valley", distance: "about 5 km" },
    { place: "Gusinje centre", distance: "about 3.5 km" },
    { place: "Lake Plav", distance: "about 11 km", note: "around 20 minutes by car" },
  ],
  languages: ["English", "Albanian", "Serbian"],
  photos: {
    hero: P.katunPath,
    card: P.katunAerial,
    gallery: [
      P.katunAerial,
      P.katunBungalow,
      P.katunPony,
      P.katunTerrace,
      P.katunFeast,
      P.katunBlueHour,
      P.katunMuseumRoom,
      P.katunSheep,
      P.katunStoneHouse,
      P.katunTents,
      P.katunBungalow4,
      P.katunGuestsPath,
    ],
  },
};

export const hotel: Property = {
  id: "hotel",
  name: "Hotel ROSI",
  shortName: "Hotel",
  place: "Gusinje",
  kind: "Family-run 3-star hotel with a restaurant",
  summary:
    "A family-run 3-star hotel on the road into Gusinje, a minute from the bus station: rooms with mountain views, Restaurant Rosi upstairs for breakfast on the terrace, pizza and local dishes, and a minimarket on the ground floor.",
  href: "/hotel",
  address: { line1: "Gusinje b.b.", locality: "Gusinje", postcode: "84326", country: "Montenegro", countryCode: "ME" },
  coords: { lat: 42.56766, lng: 19.83351 },
  findUs: "On the entrance road into Gusinje, before the bridge — the yellow building with the minimarket downstairs.",
  booking: { url: BOOKING_HOTEL, listedAs: "Hotel Rosi" },
  checkIn: "12:00–23:30",
  checkOut: "07:00–11:30",
  policies: [
    { label: "Check-in", value: "12:00–23:30" },
    { label: "Check-out", value: "07:00–11:30" },
    { label: "Payment", value: "Cash only" },
    { label: "Children", value: "Welcome — from 4 years charged as adults; no cots or extra beds" },
    { label: "Pets", value: "Not allowed" },
    { label: "Access", value: "Upper floors by stairs only — no lift" },
  ],
  scores: [
    { source: "Booking.com", score: "8.2", scale: "/10", reviews: 130, href: BOOKING_HOTEL },
    {
      source: "Google",
      score: "4.1",
      scale: "/5",
      reviews: 161,
      href: "https://www.google.com/maps/search/?api=1&query=Rosi%20Hotel%20Gusinje",
    },
  ],
  scoresDate: "October 2026",
  highlights: [
    { label: "Staff", score: "9.5" },
    { label: "Location", score: "9.0" },
    { label: "Value", score: "8.8" },
  ],
  facilities: [
    "Restaurant Rosi & bar",
    "Coffee house",
    "Minimarket on the ground floor",
    "Garden & terrace",
    "24-hour front desk",
    "Free parking & Wi-Fi",
    "Packed lunches for hikers",
    "Shuttle on request (extra charge)",
    "Meeting & banquet room on request",
  ],
  restaurant: {
    name: "Restaurant Rosi",
    cuisine: "Italian, pizza & local",
    text: "One floor below the rooms, with a glazed terrace and mountain views. Guests praise the generous breakfast — often eaten out on the terrace — and good, honest dinners.",
    meals: ["Breakfast", "Lunch", "Dinner", "Cocktails"],
    dietary: ["Vegetarian", "Vegan", "Halal", "Dairy-free"],
  },
  distances: [
    { place: "Gusinje centre", distance: "about 600 m" },
    { place: "Bus station", distance: "a minute's walk" },
    { place: "Ali Pasha's Springs", distance: "about 2 km", note: "around 30 minutes on foot" },
    { place: "Grnčar–Vermosh border crossing", distance: "about 6 km" },
    { place: "Grbaja valley (Karanfili)", distance: "about 7 km" },
    { place: "Lake Plav", distance: "about 11 km" },
  ],
  languages: ["English", "Albanian", "Serbian", "Croatian"],
  photos: {
    hero: P.hotelGusinjeBlueHour,
    card: P.hotelBuilding,
    gallery: [
      P.hotelBuilding,
      P.hotelDouble,
      P.hotelFamilyMountain,
      P.hotelMoonView,
      P.hotelQuadruple,
      P.hotelDusk,
      P.hotelDoubleView,
      P.hotelRainbow,
    ],
  },
};

export const properties: readonly Property[] = [katun, hotel];

export function getProperty(id: PropertyId): Property {
  return id === "katun" ? katun : hotel;
}

export function isPropertyId(value: string | null | undefined): value is PropertyId {
  return value === "katun" || value === "hotel";
}
