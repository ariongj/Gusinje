/**
 * Virtual tours: storytelling sequences through the illustrative 3D model
 * (or the map, where 3D is unavailable). The order of stops tells a story —
 * it is not a hiking or driving itinerary, and every tour says so.
 * Narration uses only facts already on the place pages.
 */

import type { TourStop, TranslationStatus, Verification, VirtualTour } from "./types";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

const editorial: Verification = {
  status: "desk-verified",
  lastChecked: "2026-10-10",
  owner: "Editorial team",
  sources: [],
  notes: "Narration drawn from the place records; see each place for its sources.",
};

const welcome: TourStop = {
  view: "overview",
  kicker: { en: "Gusinje & Vusanje, Montenegro", sq: "Gucia dhe Vuthaj, Mali i Zi", cnr: "Gusinje i Vusanje, Crna Gora" },
  title: { en: "Welcome to the valley", sq: "Mirë se vini në luginë", cnr: "Dobro došli u dolinu" },
  text: {
    en: "This is the valley of Gusinje and Vusanje at the foot of the Prokletije. The model is an illustration, not to scale — the map shows real locations.",
    sq: "Kjo është lugina e Gucisë dhe e Vuthajve, në rrëzë të Bjeshkëve të Nemuna. Modeli është ilustrim, jo në shkallë — harta tregon vendndodhjet e vërteta.",
    cnr: "Ovo je dolina Gusinja i Vusanja, u podnožju Prokletija. Model je ilustracija, nije u razmjeri — karta prikazuje stvarne lokacije.",
  },
};

const farewell: TourStop = {
  view: "hero",
  kicker: { en: "End of the tour", sq: "Fundi i turit", cnr: "Kraj ture" },
  title: { en: "Plan your own visit", sq: "Planifikoni vizitën tuaj", cnr: "Isplanirajte svoju posjetu" },
  text: {
    en: "Open any place to read more, save it to My Trip, and check practical details locally before you set off.",
    sq: "Hapni çdo vend për të lexuar më shumë, ruajeni te Udhëtimi im dhe kontrolloni detajet praktike në vend para se të nisni.",
    cnr: "Otvorite bilo koje mjesto da pročitate više, sačuvajte ga u Moje putovanje i provjerite praktične detalje na licu mjesta prije polaska.",
  },
};

const stop = {
  gusinje: {
    view: "gusinje",
    ref: { kind: "place", slug: "gusinje" },
    kicker: { en: "The town", sq: "Qyteti", cnr: "Grad" },
    title: { en: "Gusinje", sq: "Gucia", cnr: "Gusinje" },
    text: {
      en: "Gusinje is the small town where the valleys begin: the road south to Vusanje and the way west to Grbaja both start here.",
      sq: "Gucia është qyteti i vogël ku nisin luginat: rruga në jug për në Vuthaj dhe ajo në perëndim për në Gërbajë nisin këtu.",
      cnr: "Gusinje je gradić u kojem počinju doline: odavde kreće put na jug ka Vusanju i na zapad ka Grbaji.",
    },
  },
  mosque: {
    view: "gusinje",
    ref: { kind: "place", slug: "viziers-mosque" },
    kicker: { en: "In the centre of Gusinje", sq: "Në qendër të Gucisë", cnr: "U centru Gusinja" },
    title: { en: "The Vizier's Mosque", sq: "Xhamia e Vezirit", cnr: "Vezirova džamija" },
    text: {
      en: "The oldest preserved mosque in Gusinje stands on the same street as the Orthodox Church of St. Đorđe and the Catholic Church of St. Anton.",
      sq: "Xhamia më e vjetër e ruajtur në Guci ndodhet në të njëjtën rrugë me Kishën Ortodokse të Shën Gjergjit dhe Kishën Katolike të Shën Ndout.",
      cnr: "Najstarija sačuvana džamija u Gusinju nalazi se u istoj ulici kao pravoslavna crkva Svetog Đorđa i katolička crkva Svetog Antona.",
    },
  },
  springs: {
    view: "springs",
    ref: { kind: "place", slug: "ali-pashas-springs" },
    kicker: { en: "About 2 km south of town", sq: "Rreth 2 km në jug të qytetit", cnr: "Oko 2 km južno od grada" },
    title: { en: "Ali Pasha's Springs", sq: "Burimet e Ali Pashës", cnr: "Alipašini izvori" },
    text: {
      en: "Cold karst springs fill a broad, clear pool — the water stays at around six degrees all year.",
      sq: "Burime karstike të ftohta mbushin një pellg të gjerë e të kthjellët — uji mbetet rreth gjashtë gradë gjatë gjithë vitit.",
      cnr: "Hladni kraški izvori pune široko, bistro jezerce — voda je tokom cijele godine oko šest stepeni.",
    },
  },
  vusanje: {
    view: "vusanje",
    ref: { kind: "place", slug: "vusanje" },
    kicker: { en: "The village", sq: "Fshati", cnr: "Selo" },
    title: { en: "Vusanje", sq: "Vuthaj", cnr: "Vusanje" },
    text: {
      en: "Vusanje — Vuthaj in Albanian — sits at the head of the valley, a stage on the Peaks of the Balkans trail.",
      sq: "Vuthaj — Vusanje në malazisht — shtrihet në krye të luginës dhe është etapë e shtegut Majat e Ballkanit.",
      cnr: "Vusanje — na albanskom Vuthaj — leži na čelu doline i etapa je staze Vrhovi Balkana.",
    },
  },
  grlja: {
    view: "grlja",
    ref: { kind: "place", slug: "grlja" },
    kicker: { en: "On the edge of Vusanje", sq: "Në skaj të Vuthajve", cnr: "Na rubu Vusanja" },
    title: { en: "Grlja waterfall", sq: "Ujëvara e Grlës", cnr: "Vodopad Grlja" },
    text: {
      en: "The stream drops about fifteen metres into the narrow Grlja canyon. Seeing it is easy; going into the canyon is for equipped, guided groups only.",
      sq: "Përroi bie rreth pesëmbëdhjetë metra në kanionin e ngushtë të Grlës. Ta shohësh është e lehtë; hyrja në kanion është vetëm për grupe të pajisura me udhërrëfyes.",
      cnr: "Potok pada oko petnaest metara u uski kanjon Grlje. Vidjeti ga je lako; ulazak u kanjon samo je za opremljene grupe s vodičem.",
    },
  },
  blueEye: {
    view: "blueEye",
    ref: { kind: "place", slug: "oko-skakavice" },
    kicker: { en: "About 1.5 km on", sq: "Rreth 1,5 km më tej", cnr: "Oko 1,5 km dalje" },
    title: { en: "Oko Skakavice", sq: "Oko Skakavice", cnr: "Oko Skakavice" },
    text: {
      en: "The spring pool where the stream begins. In late autumn walkers sometimes find it dry.",
      sq: "Pellgu i burimit ku nis përroi. Në fund të vjeshtës ecësit ndonjëherë e gjejnë të thatë.",
      cnr: "Izvorsko jezerce u kojem potok počinje. Kasno u jesen planinari ga ponekad zateknu suvog.",
    },
  },
  ropojana: {
    view: "ropojana",
    ref: { kind: "place", slug: "ropojana" },
    kicker: { en: "Prokletije National Park", sq: "Parku Kombëtar i Bjeshkëve të Nemuna", cnr: "Nacionalni park Prokletije" },
    title: { en: "The Ropojana valley", sq: "Lugina e Ropojanës", cnr: "Dolina Ropojane" },
    text: {
      en: "A long glacial valley runs south to the Albanian border, ending at a lake that fills in early summer and dries to meadow by late summer.",
      sq: "Një luginë e gjatë akullnajore shtrihet në jug deri te kufiri me Shqipërinë dhe mbaron te një liqen që mbushet në fillim të verës dhe thahet në livadh nga fundi i saj.",
      cnr: "Duga glacijalna dolina pruža se na jug do granice s Albanijom i završava jezerom koje se puni početkom ljeta, a krajem ljeta presuši u livadu.",
    },
  },
  grbaja: {
    view: "grbaja",
    ref: { kind: "place", slug: "grbaja" },
    kicker: { en: "About 7 km from Gusinje", sq: "Rreth 7 km nga Gucia", cnr: "Oko 7 km od Gusinja" },
    title: { en: "The Grbaja valley", sq: "Lugina e Gërbajës", cnr: "Dolina Grbaja" },
    text: {
      en: "A green valley inside the national park, under the walls of Karanfili — the start of day hikes such as Volušnica.",
      sq: "Luginë e gjelbër brenda parkut kombëtar, nën muret e Karanfilit — nisja e ecjeve njëditore si ajo në Volushnicë.",
      cnr: "Zelena dolina u nacionalnom parku, ispod zidova Karanfila — polazište jednodnevnih tura poput Volušnice.",
    },
  },
  volusnica: {
    view: "grbaja",
    ref: { kind: "place", slug: "volusnica" },
    kicker: { en: "Above Grbaja · 1,879 m", sq: "Mbi Gërbajë · 1.879 m", cnr: "Iznad Grbaje · 1.879 m" },
    title: { en: "Volušnica", sq: "Volushnica", cnr: "Volušnica" },
    text: {
      en: "A grassy summit above the valley, known for its view across to the Karanfili massif.",
      sq: "Majë me bar mbi luginë, e njohur për pamjen drejt masivit të Karanfilit.",
      cnr: "Travnati vrh iznad doline, poznat po pogledu na masiv Karanfila.",
    },
  },
  karanfili: {
    view: "karanfili",
    ref: { kind: "place", slug: "karanfili" },
    kicker: { en: "Above Grbaja", sq: "Mbi Gërbajë", cnr: "Iznad Grbaje" },
    title: { en: "Karanfili", sq: "Karanfili", cnr: "Karanfili" },
    text: {
      en: "A massif of jagged limestone peaks rising to about 2,490 metres — best admired from the valley floor.",
      sq: "Masiv majash gëlqerore të dhëmbëzuara që ngrihen deri në rreth 2.490 metra — më bukur shihet nga fundi i luginës.",
      cnr: "Masiv nazubljenih krečnjačkih vrhova koji se dižu do oko 2.490 metara — najljepši kad se gleda s dna doline.",
    },
  },
  zlaKolata: {
    view: "zlaKolata",
    ref: { kind: "place", slug: "zla-kolata" },
    kicker: { en: "On the border · 2,534 m", sq: "Në kufi · 2.534 m", cnr: "Na granici · 2.534 m" },
    title: { en: "Zla Kolata", sq: "Kollata e Keqe", cnr: "Zla Kolata" },
    text: {
      en: "Montenegro's highest summit stands on the border with Albania — a long, demanding mountain day from Vusanje, best done with a licensed guide.",
      sq: "Maja më e lartë e Malit të Zi ngrihet në kufi me Shqipërinë — një ditë e gjatë dhe e vështirë mali nga Vuthaj, më mirë me udhërrëfyes të licencuar.",
      cnr: "Najviši vrh Crne Gore stoji na granici s Albanijom — dug i zahtjevan planinski dan iz Vusanja, najbolje s licenciranim vodičem.",
    },
  },
} satisfies Record<string, TourStop>;

export const tours: VirtualTour[] = [
  {
    slug: "valley-highlights",
    kind: "tour",
    theme: "highlights",
    title: { en: "Valley highlights", sq: "Pikat kryesore të luginës", cnr: "Najljepše u dolini" },
    intro: {
      en: "From Gusinje up the valley to Vusanje and the Ropojana, then across to Grbaja and the high peaks.",
      sq: "Nga Gucia lart nëpër luginë deri në Vuthaj e Ropojanë, pastaj në Gërbajë dhe te majat e larta.",
      cnr: "Od Gusinja uz dolinu do Vusanja i Ropojane, pa preko do Grbaje i visokih vrhova.",
    },
    stops: [welcome, stop.gusinje, stop.springs, stop.vusanje, stop.grlja, stop.blueEye, stop.ropojana, stop.grbaja, stop.karanfili, stop.zlaKolata, farewell],
    verification: editorial,
    translations: DRAFTS,
  },
  {
    slug: "villages-and-culture",
    kind: "tour",
    theme: "villages-culture",
    title: { en: "Villages and culture", sq: "Fshatra dhe kulturë", cnr: "Sela i kultura" },
    intro: {
      en: "A short tour of the town and the village at the heart of the valley, and the places of worship that share one street in Gusinje.",
      sq: "Tur i shkurtër nëpër qytetin dhe fshatin në zemër të luginës, dhe vendet e kultit që ndajnë një rrugë në Guci.",
      cnr: "Kratka tura kroz grad i selo u srcu doline i bogomolje koje dijele jednu ulicu u Gusinju.",
    },
    stops: [welcome, stop.gusinje, stop.mosque, stop.vusanje, farewell],
    verification: editorial,
    translations: DRAFTS,
  },
  {
    slug: "springs-and-waterfalls",
    kind: "tour",
    theme: "water",
    title: { en: "Springs and waterfalls", sq: "Burime dhe ujëvara", cnr: "Izvori i vodopadi" },
    intro: {
      en: "Follow the water: the springs south of Gusinje, the Grlja waterfall, the Oko Skakavice spring and the seasonal lake of the Ropojana.",
      sq: "Ndiqni ujin: burimet në jug të Gucisë, ujëvarën e Grlës, burimin Oko Skakavice dhe liqenin sezonal të Ropojanës.",
      cnr: "Pratite vodu: izvore južno od Gusinja, vodopad Grlja, izvor Oko Skakavice i sezonsko jezero u Ropojani.",
    },
    stops: [welcome, stop.springs, stop.grlja, stop.blueEye, stop.ropojana, farewell],
    verification: editorial,
    translations: DRAFTS,
  },
  {
    slug: "mountain-landscapes",
    kind: "tour",
    theme: "mountains",
    title: { en: "Mountain landscapes", sq: "Peizazhe malore", cnr: "Planinski pejzaži" },
    intro: {
      en: "The valleys and summits of the Prokletije: Grbaja and Volušnica, the walls of Karanfili, the Ropojana and Zla Kolata on the border.",
      sq: "Luginat dhe majat e Bjeshkëve të Nemuna: Gërbaja dhe Volushnica, muret e Karanfilit, Ropojana dhe Kollata e Keqe në kufi.",
      cnr: "Doline i vrhovi Prokletija: Grbaja i Volušnica, zidovi Karanfila, Ropojana i Zla Kolata na granici.",
    },
    stops: [welcome, stop.grbaja, stop.volusnica, stop.karanfili, stop.ropojana, stop.zlaKolata, farewell],
    verification: editorial,
    translations: DRAFTS,
  },
];
