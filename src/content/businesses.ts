/**
 * The local directory. It is just starting: it does not yet list every
 * business in the area, and the pages say so.
 *
 * - ROSI's listings (the host of this guide) use what the business itself
 *   publishes — self-reported, and disclosed on every listing. They are
 *   ordered like any other listing (A–Z), never pinned to the top.
 * - Other listings were created from the public accommodation pages of the
 *   Gusinje Tourism Organisation. Only the name and type are taken from
 *   there; contact details, prices and descriptions are added only when the
 *   business supplies or confirms them (claim / correction flow).
 * - No phone number, rating, price or opening time is ever estimated.
 */

import { rosiPhotos as R } from "./photos";
import type { Business, TranslationStatus, Verification } from "./types";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

const ROSI_EMAIL = "hotelrosigusinje@hotmail.com";
const ROSI_PHONE = { display: "+382 69 610 999", tel: "+38269610999" };
const ROSI_SOCIAL = [
  { label: "Instagram", url: "https://www.instagram.com/rosi_hotel/" },
  { label: "Facebook", url: "https://www.facebook.com/p/Hotel-Eko-Katun-ROSI-100063753782766/" },
];

const selfReported = (sources: string[], notes?: string): Verification => ({
  status: "self-reported",
  lastChecked: "2026-10-10",
  owner: "The business (ROSI)",
  sources,
  notes,
});

/** Listings taken from the Gusinje Tourism Organisation's accommodation pages. */
const fromTourismListing = (source: string): Verification => ({
  status: "desk-verified",
  lastChecked: "2026-10-10",
  owner: "Editorial team",
  sources: [source],
  notes: "Name and type as listed by the Gusinje Tourism Organisation. No other details collected; not claimed by the business.",
});

const listedOnlySummary = (kind: { en: string; sq: string; cnr: string }) => ({
  en: `Listed as ${kind.en} by the Gusinje Tourism Organisation. We don't have further details yet — see the official listing for contact information.`,
  sq: `Renditur si ${kind.sq} nga Organizata Turistike e Gucisë. Nuk kemi ende të dhëna të tjera — shihni listimin zyrtar për kontaktet.`,
  cnr: `Turistička organizacija Gusinje navodi ga kao ${kind.cnr}. Još nemamo više podataka — kontakt potražite u zvaničnom oglasu.`,
});

export const businesses: Business[] = [
  /* ------------------------------------------------------------ ROSI */
  {
    slug: "eko-katun-rosi",
    kind: "business",
    name: "Eko Katun ROSI",
    altNames: ["Ethno Katun ROSI Agrotourism", "Eko Katun ROSI – Old Tower"],
    categories: ["cabin", "campsite"],
    area: "vusanje",
    summary: {
      en: "A family-run eco katun near Vusanje: wooden bungalows, family rooms and camping on a working mountain farm, with a restaurant and the family's old stone tower kept as a small museum.",
      sq: "Katun ekologjik familjar pranë Vuthajve: bungallo druri, dhoma familjare dhe kamping në një fermë malore aktive, me restorant dhe kullën e vjetër prej guri të familjes, të ruajtur si muze i vogël.",
      cnr: "Porodični eko katun kod Vusanja: drveni bungalovi, porodične sobe i kamp na aktivnoj planinskoj farmi, s restoranom i starom porodičnom kamenom kulom uređenom kao mali muzej.",
    },
    description: {
      en: [
        "Wooden bungalows and family rooms on a meadow with sheep, horses and ponies, plus a camping meadow. Restaurant ROSI Tradicional serves home cooking on site.",
        "The family's kula (stone tower), which the family says has stood for around three centuries, is kept as a small museum of mountain life.",
        "Stays are arranged by request: the family replies with availability and the price. The listing on Booking.com shows live prices.",
      ],
      sq: [
        "Bungallo druri dhe dhoma familjare në një livadh me dele, kuaj e poni, si dhe një livadh për kamping. Restoranti ROSI Tradicional shërben gatime shtëpie në vend.",
        "Kulla prej guri e familjes, që sipas familjes qëndron prej rreth tre shekujsh, ruhet si muze i vogël i jetës malore.",
        "Qëndrimet rregullohen me kërkesë: familja përgjigjet me disponueshmërinë dhe çmimin. Listimi në Booking.com tregon çmimet aktuale.",
      ],
      cnr: [
        "Drveni bungalovi i porodične sobe na livadi s ovcama, konjima i ponijima, te livada za kampovanje. Restoran ROSI Tradicional nudi domaću kuhinju na licu mjesta.",
        "Porodična kula od kamena, koja po riječima porodice stoji oko tri vijeka, uređena je kao mali muzej planinskog života.",
        "Boravak se dogovara na upit: porodica odgovara s dostupnošću i cijenom. Oglas na Booking.com prikazuje aktuelne cijene.",
      ],
    },
    location: { lat: 42.531724, lng: 19.8325485, precision: "point", status: "self-reported", sources: ["rosi-website"] },
    address: { en: "Vusanje, 84326 Gusinje", sq: "Vuthaj, 84326 Guci", cnr: "Vusanje, 84326 Gusinje" },
    listings: ["togusinje-katun-rosi"],
    scene: "katun",
    contact: {
      phones: [ROSI_PHONE],
      email: ROSI_EMAIL,
      website: { url: "https://ariongj.github.io/hotelplav/katun/", label: "ROSI website" },
      social: ROSI_SOCIAL,
      booking: [{ label: "Booking.com", url: "https://www.booking.com/hotel/me/ethno-katun-rosi-agrotourism.html" }],
    },
    services: [
      { label: { en: "Restaurant on site", sq: "Restorant në vend", cnr: "Restoran na licu mjesta" }, basis: "self-reported" },
      { label: { en: "Camping meadow", sq: "Livadh për kamping", cnr: "Livada za kampovanje" }, basis: "self-reported" },
      { label: { en: "Garden, terrace and picnic area", sq: "Kopsht, tarracë dhe zonë pikniku", cnr: "Bašta, terasa i prostor za piknik" }, basis: "self-reported" },
      { label: { en: "Outdoor play area", sq: "Kënd lojërash në natyrë", cnr: "Igralište na otvorenom" }, basis: "self-reported" },
      { label: { en: "Farm animals", sq: "Kafshë ferme", cnr: "Domaće životinje" }, basis: "self-reported" },
      { label: { en: "Wi-Fi in shared areas", sq: "Wi-Fi në hapësirat e përbashkëta", cnr: "Wi-Fi u zajedničkim prostorijama" }, basis: "self-reported" },
      { label: { en: "Shuttle on request (extra charge)", sq: "Transport me kërkesë (me pagesë)", cnr: "Prevoz na upit (doplata)" }, basis: "self-reported" },
    ],
    attributes: {
      parking: { label: { en: "Free parking", sq: "Parkim falas", cnr: "Besplatan parking" }, basis: "self-reported" },
      family: {
        label: { en: "Children welcome; cots on request, no extra beds", sq: "Fëmijët të mirëpritur; djep me kërkesë, pa shtretër shtesë", cnr: "Djeca dobrodošla; krevetac na upit, bez pomoćnih ležajeva" },
        basis: "self-reported",
      },
      payment: { label: { en: "Cash only", sq: "Vetëm para në dorë", cnr: "Samo gotovina" }, basis: "self-reported" },
      languages: { value: ["en", "sq", "sr"], basis: "self-reported" },
    },
    hours: {
      text: { en: "Check-in 15:00–23:00 · check-out 08:00–11:00", sq: "Hyrja 15:00–23:00 · dalja 08:00–11:00", cnr: "Prijava 15:00–23:00 · odjava 08:00–11:00" },
      basis: "self-reported",
      asOf: "2026-10",
    },
    photos: [R.katunAerial, R.katunPath, R.katunBungalow, R.katunStoneHouse, R.katunTents],
    nearby: ["vusanje", "grlja", "oko-skakavice", "ropojana", "ali-pashas-springs"],
    disclosure: "platform-creator",
    sponsored: false,
    claimed: true,
    verification: selfReported(["rosi-website", "booking-katun-rosi", "togusinje-katun-rosi"]),
    translations: DRAFTS,
  },
  {
    slug: "hotel-rosi",
    kind: "business",
    name: "Hotel ROSI",
    altNames: ["Rosi Hotel"],
    categories: ["hotel"],
    area: "gusinje",
    summary: {
      en: "A family-run 3-star hotel on the road into Gusinje, with Restaurant Rosi and a minimarket on the ground floor.",
      sq: "Hotel familjar me 3 yje në rrugën për në Guci, me Restorantin Rosi dhe një minimarket në katin përdhes.",
      cnr: "Porodični hotel s 3 zvjezdice na ulazu u Gusinje, s restoranom Rosi i minimarketom u prizemlju.",
    },
    description: {
      en: [
        "Rooms with mountain views above Restaurant Rosi, which serves breakfast, pizza, Italian and local dishes. Packed lunches for hikers on request.",
        "Stays are arranged by request: the family replies with availability and the price. The listing on Booking.com shows live prices.",
      ],
      sq: [
        "Dhoma me pamje nga malet mbi Restorantin Rosi, që shërben mëngjes, pica, gatime italiane dhe vendore. Ushqim për rrugë për ecësit me kërkesë.",
        "Qëndrimet rregullohen me kërkesë: familja përgjigjet me disponueshmërinë dhe çmimin. Listimi në Booking.com tregon çmimet aktuale.",
      ],
      cnr: [
        "Sobe s pogledom na planine iznad restorana Rosi, koji nudi doručak, picu, italijanska i domaća jela. Paketi hrane za planinare na upit.",
        "Boravak se dogovara na upit: porodica odgovara s dostupnošću i cijenom. Oglas na Booking.com prikazuje aktuelne cijene.",
      ],
    },
    location: { lat: 42.56766, lng: 19.83351, precision: "point", status: "self-reported", sources: ["rosi-website"] },
    address: { en: "Gusinje b.b., 84326 Gusinje", sq: "Gusinje b.b., 84326 Guci", cnr: "Gusinje b.b., 84326 Gusinje" },
    listings: ["togusinje-hotel-rosi"],
    scene: "hotel",
    contact: {
      phones: [ROSI_PHONE],
      email: ROSI_EMAIL,
      website: { url: "https://ariongj.github.io/hotelplav/hotel/", label: "ROSI website" },
      social: ROSI_SOCIAL,
      booking: [{ label: "Booking.com", url: "https://www.booking.com/hotel/me/rosi-gusinje.html" }],
    },
    services: [
      { label: { en: "Restaurant and bar", sq: "Restorant dhe bar", cnr: "Restoran i bar" }, basis: "self-reported" },
      { label: { en: "Minimarket on the ground floor", sq: "Minimarket në katin përdhes", cnr: "Minimarket u prizemlju" }, basis: "self-reported" },
      { label: { en: "24-hour front desk", sq: "Recepsion 24 orë", cnr: "Recepcija 24 sata" }, basis: "self-reported" },
      { label: { en: "Packed lunches for hikers", sq: "Ushqim për rrugë për ecësit", cnr: "Paketi hrane za planinare" }, basis: "self-reported" },
      { label: { en: "Shuttle on request (extra charge)", sq: "Transport me kërkesë (me pagesë)", cnr: "Prevoz na upit (doplata)" }, basis: "self-reported" },
      { label: { en: "Wi-Fi", sq: "Wi-Fi", cnr: "Wi-Fi" }, basis: "self-reported" },
    ],
    attributes: {
      parking: { label: { en: "Free parking", sq: "Parkim falas", cnr: "Besplatan parking" }, basis: "self-reported" },
      family: {
        label: { en: "Children welcome; no cots or extra beds", sq: "Fëmijët të mirëpritur; pa djepa apo shtretër shtesë", cnr: "Djeca dobrodošla; bez krevetaca i pomoćnih ležajeva" },
        basis: "self-reported",
      },
      accessibility: {
        label: { en: "Upper floors by stairs only — no lift", sq: "Katet e sipërme vetëm me shkallë — pa ashensor", cnr: "Gornji spratovi samo stepenicama — nema lifta" },
        basis: "self-reported",
      },
      payment: { label: { en: "Cash only", sq: "Vetëm para në dorë", cnr: "Samo gotovina" }, basis: "self-reported" },
      languages: { value: ["en", "sq", "sr"], basis: "self-reported" },
    },
    hours: {
      text: { en: "Check-in 12:00–23:30 · check-out 07:00–11:30", sq: "Hyrja 12:00–23:30 · dalja 07:00–11:30", cnr: "Prijava 12:00–23:30 · odjava 07:00–11:30" },
      basis: "self-reported",
      asOf: "2026-10",
    },
    photos: [R.hotelBuilding, R.hotelDusk, R.hotelRoofTerrace, R.hotelGusinjeBlueHour],
    nearby: ["gusinje", "viziers-mosque", "ali-pashas-springs", "grbaja"],
    disclosure: "platform-creator",
    sponsored: false,
    claimed: true,
    verification: selfReported(["rosi-website", "booking-hotel-rosi", "togusinje-hotel-rosi"]),
    translations: DRAFTS,
  },
  {
    slug: "restaurant-rosi-tradicional",
    kind: "business",
    name: "Restaurant ROSI Tradicional",
    categories: ["restaurant"],
    area: "vusanje",
    summary: {
      en: "Home cooking in the traditional way at Eko Katun ROSI near Vusanje; breakfast to go for hikers.",
      sq: "Gatime shtëpie në mënyrën tradicionale në Eko Katun ROSI pranë Vuthajve; mëngjes për rrugë për ecësit.",
      cnr: "Domaća kuhinja na tradicionalan način u Eko Katunu ROSI kod Vusanja; doručak za ponijeti za planinare.",
    },
    location: null,
    partOf: "eko-katun-rosi",
    address: { en: "At Eko Katun ROSI, Vusanje", sq: "Në Eko Katun ROSI, Vuthaj", cnr: "U Eko Katunu ROSI, Vusanje" },
    contact: { phones: [ROSI_PHONE], email: ROSI_EMAIL, website: { url: "https://ariongj.github.io/hotelplav/dining/", label: "ROSI website" }, social: ROSI_SOCIAL },
    services: [
      { label: { en: "Breakfast, lunch and dinner", sq: "Mëngjes, drekë dhe darkë", cnr: "Doručak, ručak i večera" }, basis: "self-reported" },
      { label: { en: "Breakfast to go", sq: "Mëngjes për rrugë", cnr: "Doručak za ponijeti" }, basis: "self-reported" },
      { label: { en: "Vegetarian, vegan and halal options", sq: "Opsione vegjetariane, vegane dhe hallall", cnr: "Vegetarijanska, veganska i halal jela" }, basis: "self-reported" },
      { label: { en: "Gluten-free breakfast", sq: "Mëngjes pa gluten", cnr: "Doručak bez glutena" }, basis: "self-reported" },
    ],
    photos: [R.katunTerrace],
    nearby: ["vusanje", "grlja", "oko-skakavice"],
    disclosure: "platform-creator",
    sponsored: false,
    claimed: true,
    verification: selfReported(["rosi-website", "booking-katun-rosi"]),
    translations: DRAFTS,
  },
  {
    slug: "restaurant-rosi",
    kind: "business",
    name: "Restaurant Rosi",
    categories: ["restaurant"],
    area: "gusinje",
    summary: {
      en: "The restaurant of Hotel ROSI in Gusinje: breakfast on the terrace, pizza, Italian and local dishes.",
      sq: "Restoranti i Hotel ROSI në Guci: mëngjes në tarracë, pica, gatime italiane dhe vendore.",
      cnr: "Restoran hotela ROSI u Gusinju: doručak na terasi, pica, italijanska i domaća jela.",
    },
    location: null,
    partOf: "hotel-rosi",
    address: { en: "At Hotel ROSI, Gusinje", sq: "Në Hotel ROSI, Guci", cnr: "U hotelu ROSI, Gusinje" },
    contact: { phones: [ROSI_PHONE], email: ROSI_EMAIL, website: { url: "https://ariongj.github.io/hotelplav/dining/", label: "ROSI website" }, social: ROSI_SOCIAL },
    services: [
      { label: { en: "Breakfast, lunch and dinner", sq: "Mëngjes, drekë dhe darkë", cnr: "Doručak, ručak i večera" }, basis: "self-reported" },
      { label: { en: "Pizza, Italian and local dishes", sq: "Pica, gatime italiane dhe vendore", cnr: "Pica, italijanska i domaća jela" }, basis: "self-reported" },
      { label: { en: "Vegetarian, vegan and halal options", sq: "Opsione vegjetariane, vegane dhe hallall", cnr: "Vegetarijanska, veganska i halal jela" }, basis: "self-reported" },
    ],
    photos: [R.hotelDusk],
    nearby: ["gusinje", "viziers-mosque"],
    disclosure: "platform-creator",
    sponsored: false,
    claimed: true,
    verification: selfReported(["rosi-website", "booking-hotel-rosi"]),
    translations: DRAFTS,
  },

  /* -------------------------------- listed by the tourism organisation */
  {
    slug: "eko-katun-grebaje",
    kind: "business",
    name: "Eko-katun Grebaje",
    categories: ["cabin", "restaurant"],
    area: null,
    summary: listedOnlySummary({ en: "an eco-katun with a restaurant", sq: "katun ekologjik me restorant", cnr: "eko katun s restoranom" }),
    location: null,
    listings: ["gusinje-to-katun-grebaje", "gusinje-to-katun-grebaje-food"],
    contact: {},
    photos: [],
    nearby: [],
    sponsored: false,
    claimed: false,
    verification: fromTourismListing("gusinje-to-katun-grebaje"),
    translations: DRAFTS,
  },
  {
    slug: "guest-house-camping-dedushi",
    kind: "business",
    name: "Guest House & Camping Dedushi",
    categories: ["guesthouse", "campsite"],
    area: null,
    summary: listedOnlySummary({ en: "a guest house with a camping place", sq: "shtëpi pritjeje me vend kampingu", cnr: "gostinska kuća s mjestom za kampovanje" }),
    location: null,
    listings: ["gusinje-to-dedushi"],
    contact: {},
    photos: [],
    nearby: [],
    sponsored: false,
    claimed: false,
    verification: fromTourismListing("gusinje-to-dedushi"),
    translations: DRAFTS,
  },
  {
    slug: "guest-house-vucetaj",
    kind: "business",
    name: "Guest House Vucetaj",
    categories: ["guesthouse"],
    area: null,
    summary: listedOnlySummary({ en: "a guest house", sq: "shtëpi pritjeje", cnr: "gostinska kuća" }),
    location: null,
    listings: ["togusinje-vucetaj"],
    contact: {},
    photos: [],
    nearby: [],
    sponsored: false,
    claimed: false,
    verification: fromTourismListing("togusinje-vucetaj"),
    translations: DRAFTS,
  },
  {
    slug: "hotel-mountain-view-inn",
    kind: "business",
    name: "Hotel Mountain View Inn",
    categories: ["hotel"],
    area: null,
    summary: listedOnlySummary({ en: "a hotel", sq: "hotel", cnr: "hotel" }),
    location: null,
    listings: ["togusinje-mountain-view-inn"],
    contact: {},
    photos: [],
    nearby: [],
    sponsored: false,
    claimed: false,
    verification: fromTourismListing("togusinje-mountain-view-inn"),
    translations: DRAFTS,
  },
  {
    slug: "metro-hotel",
    kind: "business",
    name: "Metro Hotel",
    altNames: ["„METRO“ Hotel"],
    categories: ["hotel"],
    area: null,
    summary: listedOnlySummary({ en: "a hotel", sq: "hotel", cnr: "hotel" }),
    location: null,
    listings: ["gusinje-to-metro"],
    contact: {},
    photos: [],
    nearby: [],
    sponsored: false,
    claimed: false,
    verification: fromTourismListing("gusinje-to-metro"),
    translations: DRAFTS,
  },

  /* ------------------------------------------------ visitor information */
  {
    slug: "gusinje-tourism-organisation",
    kind: "business",
    name: "Gusinje Tourism Organisation",
    altNames: ["Turistička organizacija Gusinje"],
    categories: ["visitor-info"],
    area: "gusinje",
    summary: {
      en: "The municipal tourism organisation: official visitor information, events and its own listings of accommodation and restaurants.",
      sq: "Organizata turistike e komunës: informacion zyrtar për vizitorët, ngjarje dhe listat e veta të akomodimit e restoranteve.",
      cnr: "Opštinska turistička organizacija: zvanične informacije za posjetioce, događaji i sopstveni spiskovi smještaja i restorana.",
    },
    location: null,
    contact: {
      website: { url: "https://gusinje.travel/", label: "gusinje.travel" },
      social: [{ label: "Contact page", url: "https://togusinje.org/en/contact/" }],
    },
    photos: [],
    nearby: ["gusinje"],
    sponsored: false,
    claimed: false,
    verification: {
      status: "desk-verified",
      lastChecked: "2026-10-10",
      owner: "Editorial team",
      sources: ["gusinje-to", "togusinje-contact"],
      notes: "Address differs between pages; contact details left to the organisation's own contact page.",
    },
    translations: DRAFTS,
  },
  {
    slug: "prokletije-national-park",
    kind: "business",
    name: "Prokletije National Park",
    altNames: ["Nacionalni park Prokletije", "JP Nacionalni parkovi Crne Gore"],
    categories: ["visitor-info"],
    area: null,
    summary: {
      en: "The national park around Grbaja, the Ropojana and the high peaks, managed by the public enterprise National Parks of Montenegro: park rules, tickets and guided routes with licensed guides.",
      sq: "Parku kombëtar rreth Gërbajës, Ropojanës dhe majave të larta, i administruar nga ndërmarrja publike Parqet Kombëtare të Malit të Zi: rregullat e parkut, biletat dhe itinerare me udhërrëfyes të licencuar.",
      cnr: "Nacionalni park oko Grbaje, Ropojane i visokih vrhova, kojim upravlja JP Nacionalni parkovi Crne Gore: pravila parka, ulaznice i ture s licenciranim vodičima.",
    },
    location: null,
    contact: { website: { url: "https://nparkovi.me/", label: "nparkovi.me" } },
    photos: [],
    nearby: ["grbaja", "ropojana", "karanfili", "zla-kolata"],
    sponsored: false,
    claimed: false,
    verification: {
      status: "desk-verified",
      lastChecked: "2026-10-10",
      owner: "Editorial team",
      sources: ["np-montenegro", "np-prokletije-plan", "np-guided-routes"],
      notes: "Visitor-centre locations and opening times to be confirmed with the park.",
    },
    translations: DRAFTS,
  },
];
