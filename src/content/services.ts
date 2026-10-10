/**
 * Useful services for visitors: emergencies, information, health, money,
 * transport and guides. Only what the sources publish — addresses, hours and
 * prices exactly as stated, phone numbers only when official and unambiguous
 * (the tourist office's pages give two different numbers, so neither is
 * listed). Like the rest of the desk research, the facts were read in search
 * results quoting each page; an editor should open the sources before launch.
 */

import type { Localized, Verification } from "./types";

export type ServiceGroup = "emergency" | "information" | "health" | "money" | "transport" | "guides";

export type Service = {
  slug: string;
  group: ServiceGroup;
  name: Localized;
  summary: Localized;
  /** Further facts, each as a source states it. */
  facts?: Localized<string[]>;
  /** As published. */
  address?: string;
  /** As published, with the source's wording kept. */
  hours?: Localized;
  /** Official numbers only; shown as tap-to-call. */
  phones?: { number: string; label: Localized }[];
  email?: string;
  website?: string;
  /** A page of this guide with more. */
  more?: string;
  verification: Verification;
};

const checked = (sources: string[], notes?: string): Verification => ({
  status: "desk-verified",
  lastChecked: "2026-10-10",
  owner: "Editorial team",
  sources,
  notes: notes ?? "Read in search results quoting the source; to be confirmed before launch.",
});

export const serviceGroups: ServiceGroup[] = ["emergency", "information", "health", "money", "transport", "guides"];

export const services: Service[] = [
  /* ------------------------------------------------------------ emergency */
  {
    slug: "emergency-numbers",
    group: "emergency",
    name: { en: "Emergency numbers", sq: "Numrat e emergjencës", cnr: "Brojevi za hitne slučajeve" },
    summary: {
      en: "112 works from any phone, day and night. Its operators also answer in English, Italian, Russian and Albanian.",
      sq: "112 funksionon nga çdo telefon, ditë e natë. Operatorët përgjigjen edhe në anglisht, italisht, rusisht dhe shqip.",
      cnr: "112 radi s bilo kog telefona, danju i noću. Operateri se javljaju i na engleskom, italijanskom, ruskom i albanskom.",
    },
    phones: [
      { number: "112", label: { en: "All emergencies", sq: "Të gjitha emergjencat", cnr: "Sve hitne situacije" } },
      { number: "122", label: { en: "Police", sq: "Policia", cnr: "Policija" } },
      { number: "123", label: { en: "Fire and rescue", sq: "Zjarrfikësit dhe shpëtimi", cnr: "Vatrogasci i spašavanje" } },
      { number: "124", label: { en: "Ambulance", sq: "Ndihma e shpejtë", cnr: "Hitna pomoć" } },
    ],
    more: "/travel-tips/safety-and-emergencies",
    verification: checked(["ekip-numbers", "gov-112"]),
  },
  {
    slug: "mountain-rescue",
    group: "emergency",
    name: { en: "Mountain rescue", sq: "Shpëtimi malor", cnr: "Gorska služba spašavanja" },
    summary: {
      en: "In the mountains, call 112. Rescues in the Prokletije are carried out by the Mountain Rescue Service of Montenegro (GSS), usually together with the police helicopter unit.",
      sq: "Në mal, telefononi 112. Shpëtimet në Bjeshkët e Nemuna i kryen Shërbimi i Shpëtimit Malor i Malit të Zi (GSS), zakonisht bashkë me njësinë e helikopterëve të policisë.",
      cnr: "U planini zovite 112. Spašavanja na Prokletijama obavlja Gorska služba spašavanja Crne Gore (GSS), obično zajedno s helikopterskom jedinicom policije.",
    },
    website: "https://gss-cg.me/",
    verification: checked(["gss-contact", "gss-about"]),
  },
  {
    slug: "police",
    group: "emergency",
    name: { en: "Police station Gusinje", sq: "Stacioni i policisë Guci", cnr: "Stanica policije Gusinje" },
    summary: {
      en: "Gusinje has a police station, part of the Plav security department. To reach the police, call 122.",
      sq: "Gucia ka një stacion policie, pjesë e departamentit të sigurisë së Plavës. Për policinë, telefononi 122.",
      cnr: "Gusinje ima stanicu policije, u sastavu Odjeljenja bezbjednosti Plav. Za policiju zovite 122.",
    },
    phones: [{ number: "122", label: { en: "Police", sq: "Policia", cnr: "Policija" } }],
    verification: checked(["mup-plav", "ekip-numbers"]),
  },

  /* ---------------------------------------------------------- information */
  {
    slug: "tourist-office",
    group: "information",
    name: { en: "Tourism Organisation of Gusinje", sq: "Organizata Turistike e Gucisë", cnr: "Turistička organizacija Gusinje" },
    summary: {
      en: "The town's tourist information office: local events, accommodation and hiking information.",
      sq: "Zyra e informacionit turistik të qytetit: ngjarje vendore, akomodim dhe informacion për ecjet malore.",
      cnr: "Turistički info biro grada: lokalni događaji, smještaj i informacije o planinarenju.",
    },
    address: "Čaršijska 62, Gusinje",
    hours: {
      en: "Monday to Friday 7:00–15:00; closed at weekends",
      sq: "E hënë – e premte 7:00–15:00; e mbyllur në fundjavë",
      cnr: "Ponedjeljak – petak 7:00–15:00; vikendom zatvoreno",
    },
    facts: {
      en: ["Its pages give two different phone numbers, so neither is listed here — write, or call in at the office."],
      sq: ["Faqet e saj japin dy numra telefoni të ndryshëm, ndaj asnjëri nuk renditet këtu — shkruani ose kaloni në zyrë."],
      cnr: ["Njene stranice navode dva različita broja telefona, pa nijedan nije naveden ovdje — pišite ili svratite u kancelariju."],
    },
    email: "turizam@opstinagusinje.me",
    website: "https://gusinje.travel/",
    verification: checked(["gusinje-travel-contact", "togusinje-contact"]),
  },
  {
    slug: "national-park",
    group: "information",
    name: { en: "Prokletije National Park", sq: "Parku Kombëtar i Bjeshkëve të Nemuna", cnr: "Nacionalni park Prokletije" },
    summary: {
      en: "The park has a visitor centre in Gusinje; its administration is in Plav (Čaršijska 1).",
      sq: "Parku ka një qendër vizitorësh në Guci; administrata e tij është në Plavë (Čaršijska 1).",
      cnr: "Park ima centar za posjetioce u Gusinju; uprava je u Plavu (Čaršijska 1).",
    },
    facts: {
      en: [
        "Day ticket: €3 per person per day, including the visitor centre and educational paths (park website; the page is undated).",
        "Annual ticket for all five national parks: €13.50 (2026), sold online.",
      ],
      sq: [
        "Bileta ditore: 3 € për person në ditë, përfshirë qendrën e vizitorëve dhe shtigjet edukative (faqja e parkut; faqja nuk ka datë).",
        "Bileta vjetore për të pesë parqet kombëtare: 13,50 € (2026), shitet në internet.",
      ],
      cnr: [
        "Dnevna ulaznica: 3 € po osobi dnevno, uključujući centar za posjetioce i edukativne staze (sajt parka; stranica nije datirana).",
        "Godišnja ulaznica za svih pet nacionalnih parkova: 13,50 € (2026), prodaje se onlajn.",
      ],
    },
    email: "npprokletije@nparkovi.me",
    website: "https://nparkovi.me/sections/1/online-tickets",
    verification: checked(["np-prokletije-section", "np-annual-pass", "np-prokletije-office", "np-online-tickets"]),
  },

  /* --------------------------------------------------------------- health */
  {
    slug: "health-station",
    group: "health",
    name: { en: "Health station Gusinje", sq: "Stacioni shëndetësor Guci", cnr: "Zdravstvena stanica Gusinje" },
    summary: {
      en: "Primary care in Gusinje, part of the Plav health centre (Dom zdravlja Plav), which also has an inpatient ward.",
      sq: "Kujdes parësor në Guci, pjesë e qendrës shëndetësore të Plavës (Dom zdravlja Plav), e cila ka edhe repart shtrimi.",
      cnr: "Primarna zaštita u Gusinju, u sastavu Doma zdravlja Plav, koji ima i stacionar.",
    },
    website: "https://www.dzplav.me/",
    verification: checked(["dz-plav"]),
  },
  {
    slug: "pharmacy",
    group: "health",
    name: { en: "Pharmacy Gusinje (Montefarm)", sq: "Farmacia Guci (Montefarm)", cnr: "Apoteka Gusinje (Montefarm)" },
    summary: {
      en: "The state pharmacy in Gusinje.",
      sq: "Farmacia shtetërore në Guci.",
      cnr: "Državna apoteka u Gusinju.",
    },
    address: "Grebajska bb, Gusinje",
    hours: {
      en: "Monday to Friday 7:00–14:30, Saturday 7:00–12:00",
      sq: "E hënë – e premte 7:00–14:30, e shtunë 7:00–12:00",
      cnr: "Ponedjeljak – petak 7:00–14:30, subota 7:00–12:00",
    },
    website: "https://montefarm.co.me/en/apoteke/",
    verification: checked(["montefarm-pharmacies"]),
  },
  {
    slug: "hospital-berane",
    group: "health",
    name: { en: "General Hospital Berane", sq: "Spitali i Përgjithshëm Berane", cnr: "Opšta bolnica Berane" },
    summary: {
      en: "The nearest general hospital, in Berane. Its emergency admissions are open 24 hours.",
      sq: "Spitali i përgjithshëm më i afërt, në Berane. Pranimet urgjente janë të hapura 24 orë.",
      cnr: "Najbliža opšta bolnica, u Beranama. Prijem hitnih slučajeva radi 24 sata.",
    },
    address: "Svetog Save 33, Berane",
    website: "https://www.bolnicaberane.com/",
    verification: checked(["bolnica-berane"]),
  },

  /* ---------------------------------------------------------------- money */
  {
    slug: "atm-gusinje",
    group: "money",
    name: { en: "Cash machine in Gusinje (CKB)", sq: "Bankomat në Guci (CKB)", cnr: "Bankomat u Gusinju (CKB)" },
    summary: {
      en: "CKB lists a cash machine in Gusinje, open 24 hours.",
      sq: "CKB rendit një bankomat në Guci, të hapur 24 orë.",
      cnr: "CKB navodi bankomat u Gusinju, dostupan 24 sata.",
    },
    address: "Bosanska bb, Gusinje",
    facts: {
      en: ["Trail and travel sites say many guesthouses take cash only — bring enough euros, especially for the mountains."],
      sq: ["Faqet e shtigjeve dhe udhëtimeve thonë se shumë bujtina pranojnë vetëm para në dorë — merrni mjaftueshëm euro, sidomos për malet."],
      cnr: ["Sajtovi o stazama i putovanjima navode da mnoge kuće za odmor primaju samo gotovinu — ponesite dovoljno eura, posebno za planine."],
    },
    verification: checked(["ckb-atms", "peaksofthebalkans-guesthouses"]),
  },
  {
    slug: "banks-plav",
    group: "money",
    name: { en: "Banks in Plav", sq: "Bankat në Plavë", cnr: "Banke u Plavu" },
    summary: {
      en: "CKB has a 24-hour cash machine on Čaršijska in Plav; Prva banka has a branch with a cash machine on the same street.",
      sq: "CKB ka një bankomat 24-orësh në rrugën Čaršijska në Plavë; Prva banka ka një degë me bankomat në të njëjtën rrugë.",
      cnr: "CKB ima bankomat 24 sata u Čaršijskoj ulici u Plavu; Prva banka ima filijalu s bankomatom u istoj ulici.",
    },
    hours: {
      en: "Prva banka branch: Monday to Friday 8:00–15:00, Saturday 8:00–13:00",
      sq: "Dega e Prva banka: e hënë – e premte 8:00–15:00, e shtunë 8:00–13:00",
      cnr: "Filijala Prve banke: ponedjeljak – petak 8:00–15:00, subota 8:00–13:00",
    },
    verification: checked(["ckb-atms", "prva-banka-network"]),
  },

  /* ------------------------------------------------------------ transport */
  {
    slug: "buses",
    group: "transport",
    name: { en: "Buses to Gusinje", sq: "Autobusët për në Guci", cnr: "Autobusi do Gusinja" },
    summary: {
      en: "Buses run between Podgorica and Gusinje via Plav, and from Berane and Plav. Booking sites list operators such as Elan Company, Simon Voyages and Stemi Travel.",
      sq: "Autobusët qarkullojnë mes Podgoricës dhe Gucisë nëpërmjet Plavës, si dhe nga Berane e Plava. Faqet e rezervimeve rendisin operatorë si Elan Company, Simon Voyages dhe Stemi Travel.",
      cnr: "Autobusi saobraćaju između Podgorice i Gusinja preko Plava, kao i iz Berana i Plava. Sajtovi za rezervacije navode prevoznike kao što su Elan Company, Simon Voyages i Stemi Travel.",
    },
    facts: {
      en: ["Timetables change with the season and are published only by booking sites — check them close to your trip."],
      sq: ["Oraret ndryshojnë sipas stinës dhe publikohen vetëm nga faqet e rezervimeve — kontrollojini afër udhëtimit."],
      cnr: ["Redovi vožnje se mijenjaju po sezoni i objavljuju ih samo sajtovi za rezervacije — provjerite ih pred put."],
    },
    more: "/travel-tips/getting-here",
    verification: checked(["busticket4me-gusinje", "balkanviator-gusinje"]),
  },

  /* --------------------------------------------------------------- guides */
  {
    slug: "park-guides",
    group: "guides",
    name: { en: "Licensed national park guides", sq: "Udhërrëfyes të licencuar të parkut", cnr: "Licencirani vodiči nacionalnog parka" },
    summary: {
      en: "In summer the national park runs tours with licensed guides — among them Vusanje – Ropojana – Lake Ropojana, the Grbaja valley and Ali Pasha's Springs.",
      sq: "Në verë parku kombëtar organizon ture me udhërrëfyes të licencuar — mes tyre Vuthaj – Ropojanë – Liqeni i Ropojanës, lugina e Gërbajës dhe Burimet e Ali Pashës.",
      cnr: "Ljeti nacionalni park organizuje ture s licenciranim vodičima — među njima Vusanje – Ropojana – Ropojansko jezero, dolina Grbaja i Alipašini izvori.",
    },
    facts: {
      en: ["€40 for 4 hours, €80 for 8 hours; book by email."],
      sq: ["40 € për 4 orë, 80 € për 8 orë; rezervoni me email."],
      cnr: ["40 € za 4 sata, 80 € za 8 sati; rezervacija emailom."],
    },
    email: "turizam@nparkovi.me",
    verification: checked(["np-guided-routes", "np-prokletije-section"]),
  },
  {
    slug: "local-guides",
    group: "guides",
    name: { en: "Local guides and activity providers", sq: "Udhërrëfyes vendas dhe ofrues aktivitetesh", cnr: "Lokalni vodiči i organizatori aktivnosti" },
    summary: {
      en: "Guides are listed in the directory once their licence has been checked. A licensed guide in the valley? Ask to be listed.",
      sq: "Udhërrëfyesit renditen në drejtori pasi të jetë kontrolluar licenca e tyre. Jeni udhërrëfyes i licencuar në luginë? Kërkoni të renditeni.",
      cnr: "Vodiči se navode u imeniku kada im se provjeri licenca. Licencirani ste vodič u dolini? Zatražite da budete navedeni.",
    },
    more: "/guides-experiences",
    verification: checked([], "Directory policy, not a sourced fact."),
  },
];
