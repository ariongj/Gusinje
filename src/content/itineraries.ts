/**
 * Editorial itinerary templates. They suggest what to combine, not a
 * schedule: no travel times are given and nothing is optimised. Every stop
 * links to its page, where the practical facts and their sources live.
 */

import type { Itinerary, TranslationStatus, Verification } from "./types";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

const editorial: Verification = {
  status: "desk-verified",
  lastChecked: "2026-10-10",
  owner: "Editorial team",
  sources: [],
  notes: "Combines places already on the site; distances and times are on each place and route page.",
};

export const itineraries: Itinerary[] = [
  {
    slug: "a-few-hours",
    kind: "itinerary",
    length: "short",
    level: "easy",
    interests: { en: "Water, short walks", sq: "Ujë, shëtitje të shkurtra", cnr: "Voda, kratke šetnje" },
    title: { en: "A few hours in the valley", sq: "Disa orë në luginë", cnr: "Nekoliko sati u dolini" },
    summary: {
      en: "The springs south of Gusinje and the Grlja waterfall seen from the edge of Vusanje — easy stops close to the road.",
      sq: "Burimet në jug të Gucisë dhe ujëvara e Grlës e parë nga skaji i Vuthajve — ndalesa të lehta pranë rrugës.",
      cnr: "Izvori južno od Gusinja i vodopad Grlja s ruba Vusanja — lagana stajališta blizu puta.",
    },
    days: [
      {
        title: { en: "Half a day", sq: "Gjysmë dite", cnr: "Pola dana" },
        stops: [
          { ref: { kind: "place", slug: "ali-pashas-springs" } },
          { ref: { kind: "place", slug: "vusanje" } },
          {
            ref: { kind: "place", slug: "grlja" },
            note: { en: "View the waterfall only — do not enter the canyon.", sq: "Vetëm shikoni ujëvarën — mos hyni në kanion.", cnr: "Samo pogled na vodopad — ne ulazite u kanjon." },
          },
        ],
      },
    ],
    verification: editorial,
    translations: DRAFTS,
  },
  {
    slug: "one-day-water-and-villages",
    kind: "itinerary",
    length: "one-day",
    level: "easy",
    interests: { en: "Villages, culture, springs", sq: "Fshatra, kulturë, burime", cnr: "Sela, kultura, izvori" },
    title: { en: "One day: town, springs and waterfall", sq: "Një ditë: qyteti, burimet dhe ujëvara", cnr: "Jedan dan: grad, izvori i vodopad" },
    summary: {
      en: "Start in the centre of Gusinje, walk out to Ali Pasha's Springs, then head up to Vusanje for the short Grlja and Oko Skakavice loop.",
      sq: "Nisni në qendër të Gucisë, ecni deri te Burimet e Ali Pashës, pastaj ngjituni në Vuthaj për rrethin e shkurtër të Grlës dhe Oko Skakavices.",
      cnr: "Počnite u centru Gusinja, prošetajte do Alipašinih izvora, pa produžite do Vusanja na kratak krug do Grlje i Oka Skakavice.",
    },
    days: [
      {
        title: { en: "The day", sq: "Dita", cnr: "Dan" },
        stops: [
          { ref: { kind: "place", slug: "gusinje" } },
          { ref: { kind: "place", slug: "viziers-mosque" } },
          { ref: { kind: "place", slug: "ali-pashas-springs" } },
          { ref: { kind: "route", slug: "grlja-oko-skakavice-walk" } },
        ],
      },
    ],
    verification: editorial,
    translations: DRAFTS,
  },
  {
    slug: "weekend-in-the-prokletije",
    kind: "itinerary",
    length: "weekend",
    level: "moderate",
    interests: { en: "Waterfalls, valleys, a day hike", sq: "Ujëvara, lugina, një ecje njëditore", cnr: "Vodopadi, doline, jednodnevna tura" },
    title: { en: "A weekend in the Prokletije", sq: "Një fundjavë në Bjeshkët e Nemuna", cnr: "Vikend u Prokletijama" },
    summary: {
      en: "Day one around Gusinje and Vusanje; day two in the national park — Grbaja and Volušnica, or the Ropojana valley.",
      sq: "Dita e parë rreth Gucisë dhe Vuthajve; dita e dytë në parkun kombëtar — Gërbaja dhe Volushnica, ose lugina e Ropojanës.",
      cnr: "Prvi dan oko Gusinja i Vusanja; drugi dan u nacionalnom parku — Grbaja i Volušnica, ili dolina Ropojane.",
    },
    days: [
      {
        title: { en: "Day 1", sq: "Dita 1", cnr: "Dan 1" },
        stops: [
          { ref: { kind: "place", slug: "gusinje" } },
          { ref: { kind: "place", slug: "ali-pashas-springs" } },
          { ref: { kind: "route", slug: "grlja-oko-skakavice-walk" } },
          { ref: { kind: "guide", slug: "where-to-stay" } },
        ],
      },
      {
        title: { en: "Day 2", sq: "Dita 2", cnr: "Dan 2" },
        stops: [
          { ref: { kind: "place", slug: "grbaja" } },
          {
            ref: { kind: "route", slug: "volusnica-from-grbaja" },
            note: {
              en: "Or walk into the Ropojana valley instead; consider a licensed guide for either.",
              sq: "Ose ecni në luginën e Ropojanës; mendoni për një udhërrëfyes të licencuar për secilën.",
              cnr: "Ili umjesto toga prošetajte dolinom Ropojane; za obje razmislite o licenciranom vodiču.",
            },
          },
          { ref: { kind: "guide", slug: "responsible-travel" } },
        ],
      },
    ],
    verification: editorial,
    translations: DRAFTS,
  },
  {
    slug: "five-days-slower",
    kind: "itinerary",
    length: "long",
    level: "active",
    interests: { en: "Hiking, valleys, a summit with a guide", sq: "Ecje, lugina, një majë me udhërrëfyes", cnr: "Planinarenje, doline, vrh s vodičem" },
    title: { en: "Five days, at a slower pace", sq: "Pesë ditë, me ritëm më të qetë", cnr: "Pet dana, sporijim ritmom" },
    summary: {
      en: "Time for the town, the water, two valleys and — weather and fitness permitting, with a licensed guide — Zla Kolata.",
      sq: "Kohë për qytetin, ujin, dy lugina dhe — nëse lejojnë moti dhe forma, me udhërrëfyes të licencuar — Kollatën e Keqe.",
      cnr: "Vrijeme za grad, vodu, dvije doline i — ako vrijeme i kondicija dozvole, s licenciranim vodičem — Zlu Kolatu.",
    },
    days: [
      {
        title: { en: "Day 1", sq: "Dita 1", cnr: "Dan 1" },
        stops: [
          { ref: { kind: "place", slug: "gusinje" } },
          { ref: { kind: "place", slug: "viziers-mosque" } },
          { ref: { kind: "place", slug: "ali-pashas-springs" } },
        ],
      },
      {
        title: { en: "Day 2", sq: "Dita 2", cnr: "Dan 2" },
        stops: [{ ref: { kind: "place", slug: "vusanje" } }, { ref: { kind: "route", slug: "grlja-oko-skakavice-walk" } }],
      },
      {
        title: { en: "Day 3", sq: "Dita 3", cnr: "Dan 3" },
        stops: [{ ref: { kind: "route", slug: "vusanje-ropojana" } }],
      },
      {
        title: { en: "Day 4", sq: "Dita 4", cnr: "Dan 4" },
        stops: [{ ref: { kind: "place", slug: "grbaja" } }, { ref: { kind: "route", slug: "volusnica-from-grbaja" } }],
      },
      {
        title: { en: "Day 5", sq: "Dita 5", cnr: "Dan 5" },
        stops: [
          {
            ref: { kind: "route", slug: "zla-kolata-from-vusanje" },
            note: {
              en: "Only with a licensed mountain guide and a good forecast — otherwise keep it as a rest day.",
              sq: "Vetëm me udhërrëfyes malor të licencuar dhe parashikim të mirë moti — përndryshe mbajeni si ditë pushimi.",
              cnr: "Samo s licenciranim planinskim vodičem i dobrom prognozom — u suprotnom neka bude dan odmora.",
            },
          },
          { ref: { kind: "guide", slug: "safety-and-emergencies" } },
        ],
      },
    ],
    verification: editorial,
    translations: DRAFTS,
  },
];
