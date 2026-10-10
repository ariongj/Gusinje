/**
 * Walks and hikes. Every figure is shown with the source that reported it;
 * where sources disagree, the range is given. No route has been checked on
 * the ground for this guide yet, so all are "awaiting-verification": the
 * pages show what is known, what is missing, and that they must not be used
 * to navigate. There are no GPX tracks — none is drawn from guesswork.
 */

import type { Route, TranslationStatus, Verification } from "./types";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

const desk = (sources: string[], notes?: string): Verification => ({
  status: "desk-verified",
  lastChecked: "2026-10-10",
  owner: "Editorial team (outdoor safety)",
  sources,
  notes: notes ?? "Figures from published sources; not yet walked or checked with a licensed guide.",
});

export const routes: Route[] = [
  {
    slug: "grlja-oko-skakavice-walk",
    kind: "route",
    name: { en: "Grlja waterfall and Oko Skakavice", sq: "Ujëvara e Grlës dhe Oko Skakavice", cnr: "Vodopad Grlja i Oko Skakavice" },
    type: "walk",
    area: "vusanje",
    summary: {
      en: "A short loop from near Vusanje to the Grlja waterfall viewpoint and on to the Oko Skakavice spring. This is the walk to see the waterfall — not a descent into the canyon.",
      sq: "Një rreth i shkurtër nga afër Vuthajve te pika e shikimit të ujëvarës së Grlës dhe më tej te burimi Oko Skakavice. Kjo është shëtitja për të parë ujëvarën — jo zbritje në kanion.",
      cnr: "Kratak krug od Vusanja do vidikovca na vodopad Grlja i dalje do izvora Oko Skakavice. Ovo je šetnja do pogleda na vodopad — ne spust u kanjon.",
    },
    start: {
      place: "vusanje",
      text: {
        en: "A parking area near the Grlja waterfall on the edge of Vusanje (position not yet verified).",
        sq: "Një parking pranë ujëvarës së Grlës në skaj të Vuthajve (pozicioni nuk është verifikuar ende).",
        cnr: "Parking kod vodopada Grlja na rubu Vusanja (položaj još nije provjeren).",
      },
    },
    places: ["grlja", "oko-skakavice"],
    distanceKm: { value: "3.4", qualifier: "loop", source: "komoot-grlja-loop" },
    ascentM: { value: "≈ 50", source: "komoot-grlja-loop" },
    duration: { value: { en: "about 1 hour", sq: "rreth 1 orë", cnr: "oko 1 sat" }, source: "komoot-grlja-loop" },
    seasonality: {
      value: {
        en: "Walkers report the spring can be dry in October and November.",
        sq: "Ecësit raportojnë se burimi mund të jetë i thatë në tetor dhe nëntor.",
        cnr: "Planinari navode da izvor u oktobru i novembru može biti suv.",
      },
      source: "locwiki-vusanje-valbona",
    },
    guide: "unknown",
    warnings: [
      {
        en: "Stay back from the canyon edge. Do not climb down towards the pool.",
        sq: "Qëndroni larg buzës së kanionit. Mos zbritni drejt pellgut.",
        cnr: "Držite se dalje od ivice kanjona. Ne silazite ka bazenu.",
      },
    ],
    officialLinks: ["togusinje-oko-skakavice", "mne-travel-grlja-canyon"],
    track: "none",
    status: "awaiting-verification",
    verification: desk(["komoot-grlja-loop", "komoot-grlja", "locwiki-vusanje-valbona"]),
    translations: DRAFTS,
  },
  {
    slug: "grlja-canyon",
    kind: "route",
    name: { en: "Grlja canyon (canyoning)", sq: "Kanioni i Grlës (kanioning)", cnr: "Kanjon Grlja (kanjoning)" },
    type: "canyon",
    area: "vusanje",
    summary: {
      en: "A technical canyon descent below the Grlja waterfall — only with canyoning equipment, training and a qualified guide. Not a walk, and not for families.",
      sq: "Zbritje teknike në kanion poshtë ujëvarës së Grlës — vetëm me pajisje kanioningu, trajnim dhe udhërrëfyes të kualifikuar. Nuk është shëtitje dhe nuk është për familje.",
      cnr: "Tehnički spust kroz kanjon ispod vodopada Grlja — samo uz opremu za kanjoning, obuku i kvalifikovanog vodiča. Nije šetnja i nije za porodice.",
    },
    description: {
      en: [
        "Montenegro's national tourism organisation says that passage through the Grlja canyon “requires adequate equipment, remarkable preparation, and experience”, recommends descending the climbing rope first, and names early autumn — when the water is lowest — as the best time.",
        "Canyoning descriptions mention a rope descent of around 30 m and a high level of commitment once inside.",
      ],
      sq: [
        "Organizata kombëtare e turizmit e Malit të Zi thotë se kalimi nëpër kanionin e Grlës “kërkon pajisje të përshtatshme, përgatitje të jashtëzakonshme dhe përvojë”, rekomandon zbritjen fillimisht me litar dhe e quan fillimin e vjeshtës — kur uji është më i ulët — kohën më të mirë.",
        "Përshkrimet e kanioningut përmendin një zbritje me litar rreth 30 m dhe angazhim të lartë pasi të jeni brenda.",
      ],
      cnr: [
        "Nacionalna turistička organizacija Crne Gore navodi da prolazak kroz kanjon Grlje „zahtijeva adekvatnu opremu, izuzetnu pripremu i iskustvo”, preporučuje da se prvo spusti užetom i kao najbolje vrijeme navodi rani jesen, kada je vodostaj najniži.",
        "Opisi kanjoninga pominju spust užetom od oko 30 m i visok stepen posvećenosti kada se jednom uđe.",
      ],
    },
    start: { place: "grlja" },
    places: ["grlja"],
    seasonality: {
      value: { en: "Early autumn, when the water is lowest", sq: "Fillimi i vjeshtës, kur uji është më i ulët", cnr: "Rana jesen, kada je vodostaj najniži" },
      source: "mne-travel-grlja-canyon",
    },
    difficulty: {
      value: { en: "Technical — equipment, preparation and experience required", sq: "Teknik — kërkohen pajisje, përgatitje dhe përvojë", cnr: "Tehnički — potrebni oprema, priprema i iskustvo" },
      source: "mne-travel-grlja-canyon",
    },
    equipment: {
      en: ["Full canyoning equipment and ropes (a descent of around 30 m is described)", "Helmet and wetsuit"],
      sq: ["Pajisje e plotë kanioningu dhe litarë (përshkruhet një zbritje rreth 30 m)", "Helmetë dhe kostum neopreni"],
      cnr: ["Kompletna oprema za kanjoning i užad (opisuje se spust od oko 30 m)", "Kaciga i neoprensko odijelo"],
    },
    guide: "required",
    warnings: [
      {
        en: "Do not enter the canyon without a qualified canyoning guide. Water levels and conditions change; there is no easy way out once inside.",
        sq: "Mos hyni në kanion pa një udhërrëfyes të kualifikuar kanioningu. Niveli i ujit dhe kushtet ndryshojnë; pasi të jeni brenda nuk ka rrugëdalje të lehtë.",
        cnr: "Ne ulazite u kanjon bez kvalifikovanog vodiča za kanjoning. Vodostaj i uslovi se mijenjaju; kada uđete, nema lakog izlaza.",
      },
    ],
    officialLinks: ["mne-travel-grlja-canyon"],
    track: "none",
    status: "awaiting-verification",
    verification: desk(["mne-travel-grlja-canyon", "descente-grlja"], "No local canyoning provider verified yet."),
    translations: DRAFTS,
  },
  {
    slug: "vusanje-ropojana",
    kind: "route",
    name: { en: "Vusanje into the Ropojana valley", sq: "Nga Vuthaj në luginën e Ropojanës", cnr: "Iz Vusanja u dolinu Ropojane" },
    type: "hike",
    area: "ropojana",
    summary: {
      en: "Up the Ropojana from Vusanje towards the seasonal Lake Ropojana. The national park lists the Vusanje–Ropojana route among its maintained trails and among routes offered with licensed guides; distance and timing are not yet verified here.",
      sq: "Lart nëpër Ropojanë nga Vuthaj drejt Liqenit sezonal të Ropojanës. Parku kombëtar e rendit itinerarin Vuthaj–Ropojanë mes shtigjeve të mirëmbajtura dhe mes itinerareve me udhërrëfyes të licencuar; distanca dhe koha nuk janë verifikuar ende këtu.",
      cnr: "Uz Ropojanu iz Vusanja ka sezonskom Ropojanskom jezeru. Nacionalni park navodi rutu Vusanje–Ropojana među uređenim stazama i među turama s licenciranim vodičima; dužina i trajanje ovdje još nisu provjereni.",
    },
    start: { place: "vusanje" },
    places: ["ropojana"],
    seasonality: {
      value: {
        en: "The lake usually holds water in early summer and dries by August–September.",
        sq: "Liqeni zakonisht ka ujë në fillim të verës dhe thahet deri në gusht–shtator.",
        cnr: "Jezero obično ima vode početkom ljeta i presuši do avgusta–septembra.",
      },
      source: "wiki-lake-ropojana",
    },
    guide: "recommended",
    access: {
      en: "Inside Prokletije National Park, with an entry point in the Ropojana valley.",
      sq: "Brenda Parkut Kombëtar të Bjeshkëve të Nemuna, me pikë hyrjeje në luginën e Ropojanës.",
      cnr: "U Nacionalnom parku Prokletije, s ulaznim punktom u dolini Ropojane.",
    },
    warnings: [
      {
        en: "The valley ends at the Albanian border — do not continue across it without border permission.",
        sq: "Lugina mbaron te kufiri me Shqipërinë — mos vazhdoni përtej tij pa leje kalimi.",
        cnr: "Dolina se završava na granici s Albanijom — ne nastavljajte preko nje bez dozvole za prelazak.",
      },
    ],
    officialLinks: ["np-montenegro", "np-guided-routes"],
    track: "none",
    status: "awaiting-verification",
    verification: desk(["np-prokletije-plan", "np-guided-routes", "np-plan-2026", "wiki-lake-ropojana"], "The park's plan notes that most trail markings need renewing."),
    translations: DRAFTS,
  },
  {
    slug: "volusnica-from-grbaja",
    kind: "route",
    name: { en: "Volušnica from Grbaja", sq: "Volushnica nga Gërbaja", cnr: "Volušnica iz Grbaje" },
    type: "hike",
    area: "grbaja",
    summary: {
      en: "A day hike from the Grbaja valley to the 1,879 m summit of Volušnica, with views of the Karanfili walls.",
      sq: "Ecje njëditore nga lugina e Gërbajës deri në majën 1.879 m të Volushnicës, me pamje nga muret e Karanfilit.",
      cnr: "Jednodnevna tura iz doline Grbaja do vrha Volušnice (1.879 m), s pogledom na zidove Karanfila.",
    },
    start: {
      place: "grbaja",
      text: { en: "The mountain hut in the Grbaja valley (about 1,160 m).", sq: "Streha malore në luginën e Gërbajës (rreth 1.160 m).", cnr: "Planinarski dom u dolini Grbaja (oko 1.160 m)." },
    },
    places: ["volusnica", "karanfili"],
    distanceKm: {
      value: "≈ 10.3",
      qualifier: "loop",
      source: "alltrails-volusnica",
      note: { en: "AllTrails lists a 6.4-mile loop.", sq: "AllTrails rendit një rreth prej 6,4 miljesh.", cnr: "AllTrails navodi krug od 6,4 milje." },
    },
    ascentM: {
      value: "≈ 970",
      qualifier: "loop",
      source: "alltrails-volusnica",
      note: {
        en: "AllTrails: 3,195 ft of climbing on the loop. The height difference from the hut (about 1,160 m) to the summit (1,879 m) is about 720 m.",
        sq: "AllTrails: 3.195 këmbë ngjitje në rreth. Diferenca e lartësisë nga streha (rreth 1.160 m) te maja (1.879 m) është rreth 720 m.",
        cnr: "AllTrails: 3.195 stopa uspona na krugu. Visinska razlika od doma (oko 1.160 m) do vrha (1.879 m) je oko 720 m.",
      },
    },
    duration: { value: { en: "about 2.5 hours up", sq: "rreth 2,5 orë ngjitje", cnr: "oko 2,5 sata uspona" }, source: "planine-volusnica" },
    guide: "recommended",
    access: {
      en: "Inside Prokletije National Park, with an entry point in the Grbaja valley. The park offers a guided route from Grbaja via Katun Valušnice towards Talijanka.",
      sq: "Brenda Parkut Kombëtar të Bjeshkëve të Nemuna, me pikë hyrjeje në luginën e Gërbajës. Parku ofron një itinerar me udhërrëfyes nga Gërbaja përmes Katunit të Valushnicës drejt Talijankës.",
      cnr: "U Nacionalnom parku Prokletije, s ulaznim punktom u dolini Grbaja. Park nudi turu s vodičem iz Grbaje preko Katuna Valušnice ka Talijanki.",
    },
    warnings: [
      {
        en: "Mountain weather changes quickly; carry layers, water and a map, and check conditions locally before you set off.",
        sq: "Moti në mal ndryshon shpejt; merrni rroba shtesë, ujë dhe hartë, dhe kontrolloni kushtet në vend para se të nisni.",
        cnr: "Vrijeme u planini se brzo mijenja; ponesite slojevitu odjeću, vodu i kartu i provjerite uslove na licu mjesta prije polaska.",
      },
    ],
    officialLinks: ["np-montenegro", "np-guided-routes"],
    track: "none",
    status: "awaiting-verification",
    verification: desk(["summitpost-volusnica", "planine-volusnica", "alltrails-volusnica", "summitpost-karanfili", "np-guided-routes"]),
    translations: DRAFTS,
  },
  {
    slug: "zla-kolata-from-vusanje",
    kind: "route",
    name: { en: "Zla Kolata from Vusanje", sq: "Kollata e Keqe nga Vuthaj", cnr: "Zla Kolata iz Vusanja" },
    type: "summit",
    area: "high-mountains",
    summary: {
      en: "A long, demanding climb from Vusanje to Montenegro's highest summit on the Albanian border. Published figures differ; go with a licensed mountain guide.",
      sq: "Ngjitje e gjatë dhe e vështirë nga Vuthaj deri në majën më të lartë të Malit të Zi, në kufi me Shqipërinë. Shifrat e publikuara ndryshojnë; shkoni me udhërrëfyes malor të licencuar.",
      cnr: "Dug i zahtjevan uspon iz Vusanja na najviši vrh Crne Gore, na granici s Albanijom. Objavljeni podaci se razlikuju; idite s licenciranim planinskim vodičem.",
    },
    description: {
      en: [
        "SummitPost describes a marked route in stages: Vusanje (1,060 m) – Zarunica (1,240 m), 1 h – Grlata (1,810 m), 2 h – Preslopit pass (2,130 m), 1 h – Dobra Kolata (2,528 m), 2 h – Zla Kolata (2,534 m), 30 min.",
      ],
      sq: [
        "SummitPost përshkruan një rrugë të shënuar me etapa: Vuthaj (1.060 m) – Zarunica (1.240 m), 1 orë – Grlata (1.810 m), 2 orë – Qafa e Preslopit (2.130 m), 1 orë – Dobra Kolata (2.528 m), 2 orë – Kollata e Keqe (2.534 m), 30 min.",
      ],
      cnr: [
        "SummitPost opisuje markiranu stazu po etapama: Vusanje (1.060 m) – Zarunica (1.240 m), 1 h – Grlata (1.810 m), 2 h – prevoj Preslopit (2.130 m), 1 h – Dobra Kolata (2.528 m), 2 h – Zla Kolata (2.534 m), 30 min.",
      ],
    },
    start: { place: "vusanje" },
    places: ["zla-kolata"],
    distanceKm: {
      value: "≈ 9–12",
      qualifier: "one-way",
      source: "summitpost-zla-kolata-route",
      note: { en: "SummitPost gives about 12 km; other route descriptions give 8.9–9.2 km.", sq: "SummitPost jep rreth 12 km; përshkrime të tjera japin 8,9–9,2 km.", cnr: "SummitPost navodi oko 12 km; drugi opisi navode 8,9–9,2 km." },
    },
    ascentM: {
      value: "≈ 1,450–1,610",
      source: "summitpost-zla-kolata-route",
      note: { en: "SummitPost: 1,474 m height difference.", sq: "SummitPost: diferencë lartësie 1.474 m.", cnr: "SummitPost: visinska razlika 1.474 m." },
    },
    duration: {
      value: { en: "about 4.5–6.5 hours up", sq: "rreth 4,5–6,5 orë ngjitje", cnr: "oko 4,5–6,5 sati uspona" },
      source: "summitpost-zla-kolata-route",
      note: { en: "SummitPost: 6 h 30 min up.", sq: "SummitPost: 6 orë e 30 min ngjitje.", cnr: "SummitPost: 6 h 30 min uspona." },
    },
    difficulty: {
      value: { en: "Mountain hiking to demanding mountain hiking (T2–T3 on the SAC scale)", sq: "Ecje malore deri në ecje malore të vështirë (T2–T3 në shkallën SAC)", cnr: "Planinarenje do zahtjevnog planinarenja (T2–T3 po SAC skali)" },
      source: "summitpost-zla-kolata-route",
    },
    guide: "strongly-recommended",
    warnings: [
      {
        en: "The summit is on the international border. Do not descend into Albania without border permission.",
        sq: "Maja është në kufirin ndërkombëtar. Mos zbritni në Shqipëri pa leje kalimi të kufirit.",
        cnr: "Vrh je na međunarodnoj granici. Ne silazite u Albaniju bez dozvole za prelazak granice.",
      },
      {
        en: "High, exposed terrain with fast-changing weather. Snow can linger on the high ground; check conditions locally.",
        sq: "Terren i lartë dhe i ekspozuar me mot që ndryshon shpejt. Bora mund të qëndrojë gjatë në lartësi; kontrolloni kushtet në vend.",
        cnr: "Visok, izložen teren s vremenom koje se brzo mijenja. Snijeg se na visinama može dugo zadržati; provjerite uslove na licu mjesta.",
      },
    ],
    officialLinks: ["np-montenegro", "gss-cg"],
    track: "none",
    status: "awaiting-verification",
    verification: desk(["summitpost-zla-kolata-route", "bestviewpoints-zla-kolata", "isomaps-zla-kolata", "takeadventure-zla-kolata", "wiki-zla-kolata"]),
    translations: DRAFTS,
  },
  {
    slug: "vusanje-theth",
    kind: "route",
    name: { en: "Vusanje to Theth (Peaks of the Balkans)", sq: "Nga Vuthaj në Theth (Majat e Ballkanit)", cnr: "Iz Vusanja do Teta (Vrhovi Balkana)" },
    type: "cross-border",
    area: "ropojana",
    summary: {
      en: "The Peaks of the Balkans stage from Vusanje over the Qafa e Pejës pass (1,707 m) to Theth in Albania. Crossing the border on foot requires permission requested in advance.",
      sq: "Etapa e Majave të Ballkanit nga Vuthaj përmes Qafës së Pejës (1.707 m) deri në Theth të Shqipërisë. Kalimi i kufirit në këmbë kërkon leje të kërkuar paraprakisht.",
      cnr: "Etapa Vrhova Balkana iz Vusanja preko prevoja Qafa e Pejës (1.707 m) do Teta u Albaniji. Prelazak granice pješice zahtijeva unaprijed traženu dozvolu.",
    },
    start: { place: "vusanje" },
    places: ["ropojana"],
    distanceKm: { value: "21.35", source: "pob-vusanje-theth" },
    ascentM: {
      value: "+1,111 / −1,437",
      source: "pob-vusanje-theth",
    },
    duration: { value: { en: "about 8 hours", sq: "rreth 8 orë", cnr: "oko 8 sati" }, source: "pob-vusanje-theth" },
    guide: "recommended",
    permits: {
      text: {
        en: "According to the Peaks of the Balkans cross-border procedures, hikers must apply at least 15 days in advance to the police of the country they are leaving. Montenegro's tourism organisation likewise says the request goes to the border police of the country you are leaving. Check the current procedure before you go — this guide cannot confirm it for you.",
        sq: "Sipas procedurave ndërkufitare të Majave të Ballkanit, ecësit duhet të aplikojnë të paktën 15 ditë përpara në policinë e vendit nga i cili largohen. Edhe organizata e turizmit e Malit të Zi thotë se kërkesa dërgohet te policia kufitare e vendit nga largoheni. Kontrolloni procedurën aktuale para nisjes — ky udhëzues nuk mund ta konfirmojë për ju.",
        cnr: "Prema prekograničnim procedurama Vrhova Balkana, planinari se moraju prijaviti najmanje 15 dana unaprijed policiji države iz koje izlaze. I turistička organizacija Crne Gore navodi da se zahtjev šalje graničnoj policiji države koju napuštate. Provjerite aktuelnu proceduru prije polaska — ovaj vodič to ne može potvrditi umjesto vas.",
      },
      sources: ["pob-cross-border", "mne-travel-entry"],
    },
    warnings: [
      {
        en: "Long, remote mountain stage across an international border. Carry your passport and the border approval.",
        sq: "Etapë e gjatë malore në zonë të largët, përtej kufirit ndërkombëtar. Mbani me vete pasaportën dhe miratimin e kalimit.",
        cnr: "Duga planinska etapa u udaljenom području, preko međunarodne granice. Nosite pasoš i odobrenje za prelazak.",
      },
    ],
    officialLinks: ["pob-cross-border", "mne-travel-entry"],
    track: "none",
    status: "awaiting-verification",
    verification: desk(["pob-vusanje-theth", "pob-cross-border", "mne-travel-entry"], "Permit rules to be confirmed with the border police before publication as verified."),
    translations: DRAFTS,
  },
];
