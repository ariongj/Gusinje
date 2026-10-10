/**
 * Places: villages, waterfalls, springs, valleys, viewpoints, peaks and
 * cultural sites. Each fact traces to a source in ./sources.ts. Where sources
 * disagree the text says so; where nothing reliable was found (e.g. the
 * coordinates of Grlja) the field is left empty and the page says it is still
 * to be verified.
 *
 * Albanian and Montenegrin text was drafted for this release and is marked
 * "unreviewed" until a fluent local editor has checked it.
 */

import { commonsPhotos as C } from "./photos";
import type { Place, TranslationStatus, Verification } from "./types";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

/**
 * Park entry: the 2026–2030 management plan places toll points in the Grbaja
 * and Ropojana valleys; the park announced the 2026 annual pass in December
 * 2025. The day-ticket price was not confirmed from an official page.
 */
const PARK_FEES = {
  en: "Inside Prokletije National Park, which has entry points in the Grbaja and Ropojana valleys. An annual pass for all five national parks costs €13.50 in 2026 (park announcement, December 2025). Check the day-ticket price on the park's price list before you go.",
  sq: "Brenda Parkut Kombëtar të Bjeshkëve të Nemuna, që ka pika hyrjeje në luginat e Gërbajës dhe të Ropojanës. Një abonim vjetor për të pesë parqet kombëtare kushton 13,50 € në vitin 2026 (njoftim i parkut, dhjetor 2025). Kontrolloni çmimin e biletës ditore në listën e çmimeve të parkut para se të shkoni.",
  cnr: "U Nacionalnom parku Prokletije, koji ima ulazne punktove u dolinama Grbaje i Ropojane. Godišnja karta za svih pet nacionalnih parkova u 2026. košta 13,50 € (saopštenje parka, decembar 2025). Cijenu dnevne ulaznice provjerite u cjenovniku parka prije polaska.",
};

const desk = (sources: string[], notes?: string): Verification => ({
  status: "desk-verified",
  lastChecked: "2026-10-10",
  owner: "Editorial team",
  sources,
  notes,
});

export const places: Place[] = [
  {
    slug: "gusinje",
    kind: "place",
    name: { en: "Gusinje", sq: "Gucia", cnr: "Gusinje" },
    altNames: [
      { name: "Guci / Gucia", lang: "sq" },
      { name: "Гусиње", lang: "cnr", note: { en: "Cyrillic", sq: "cirilikë", cnr: "ćirilica" } },
    ],
    category: "town",
    area: "gusinje",
    summary: {
      en: "The small town where the valleys of the Prokletije begin — the road south to Vusanje and the way west to Grbaja both start here.",
      sq: "Qyteti i vogël ku nisin luginat e Bjeshkëve të Nemuna — rruga në jug për në Vuthaj dhe ajo në perëndim për në Gërbajë nisin këtu.",
      cnr: "Gradić u kojem počinju doline Prokletija — odavde vodi put na jug ka Vusanju i na zapad ka Grbaji.",
    },
    description: {
      en: [
        "Gusinje is a small town in north-eastern Montenegro, close to the border with Albania, and the seat of its own municipality. The 2011 census counted 1,673 people in the town.",
        "It is the natural starting point for the Prokletije: Ali Pasha's Springs lie about 2 km south of the centre, the village of Vusanje about 4.5 km to the south, and the Grbaja valley about 7 km away.",
        "In the centre, the Vizier's Mosque, the Orthodox Church of St. Đorđe and the Catholic Church of St. Anton stand on the same street.",
      ],
      sq: [
        "Gucia është një qytet i vogël në verilindje të Malit të Zi, pranë kufirit me Shqipërinë, dhe qendër e komunës së vet. Regjistrimi i vitit 2011 numëroi 1.673 banorë në qytet.",
        "Është pika e natyrshme e nisjes për në Bjeshkët e Nemuna: Burimet e Ali Pashës ndodhen rreth 2 km në jug të qendrës, fshati Vuthaj rreth 4,5 km në jug dhe lugina e Gërbajës rreth 7 km larg.",
        "Në qendër, Xhamia e Vezirit, Kisha Ortodokse e Shën Gjergjit dhe Kisha Katolike e Shën Ndout ndodhen në të njëjtën rrugë.",
      ],
      cnr: [
        "Gusinje je gradić na sjeveroistoku Crne Gore, blizu granice s Albanijom, i sjedište istoimene opštine. Po popisu iz 2011. u gradu je živjelo 1.673 stanovnika.",
        "Prirodno je polazište za Prokletije: Alipašini izvori su oko 2 km južno od centra, selo Vusanje oko 4,5 km južno, a dolina Grbaja oko 7 km daleko.",
        "U centru se u istoj ulici nalaze Vezirova džamija, pravoslavna crkva Svetog Đorđa i katolička crkva Svetog Antona.",
      ],
    },
    highlights: {
      en: ["The Vizier's Mosque and the churches of St. Đorđe and St. Anton in the centre", "Start of the roads to Vusanje and Grbaja", "Ali Pasha's Springs, about 2 km south"],
      sq: ["Xhamia e Vezirit dhe kishat e Shën Gjergjit e të Shën Ndout në qendër", "Nisja e rrugëve për në Vuthaj dhe Gërbajë", "Burimet e Ali Pashës, rreth 2 km në jug"],
      cnr: ["Vezirova džamija i crkve Svetog Đorđa i Svetog Antona u centru", "Početak puteva ka Vusanju i Grbaji", "Alipašini izvori, oko 2 km južno"],
    },
    location: { lat: 42.56194, lng: 19.83389, precision: "area", status: "desk-verified", sources: ["wiki-gusinje", "geonames-gusinje"] },
    photos: [C.gusinjeValley, C.gusinjeHouses, C.gusinjeHaystacks, C.gusinjeAerial],
    officialLinks: ["gusinje-to"],
    verification: desk(
      ["wiki-gusinje", "geonames-gusinje", "mapcarta-gusinje", "mne-travel-mountain-towns", "summitpost-karanfili"],
      "Elevation left out: sources give 924 m and 1,014 m.",
    ),
    translations: DRAFTS,
  },
  {
    slug: "vusanje",
    kind: "place",
    name: { en: "Vusanje", sq: "Vuthaj", cnr: "Vusanje" },
    altNames: [
      { name: "Vuthaj", lang: "sq" },
      { name: "Вусање", lang: "cnr", note: { en: "Cyrillic", sq: "cirilikë", cnr: "ćirilica" } },
    ],
    category: "village",
    area: "vusanje",
    summary: {
      en: "A mountain village about 4.5 km south of Gusinje, close to the Grlja waterfall and Oko Skakavice, where the Ropojana valley begins.",
      sq: "Fshat malor rreth 4,5 km në jug të Gucisë, pranë ujëvarës së Grlës dhe Oko Skakavices, aty ku nis lugina e Ropojanës.",
      cnr: "Planinsko selo oko 4,5 km južno od Gusinja, blizu vodopada Grlja i Oka Skakavice, gdje počinje dolina Ropojane.",
    },
    description: {
      en: [
        "Vusanje — Vuthaj in Albanian — lies at the head of the valley south of Gusinje, under the limestone walls of the Prokletije.",
        "The Grlja waterfall is on the edge of the village, and the Oko Skakavice spring about 1.5 km further on. South of the village the Ropojana valley runs towards the Albanian border.",
        "Vusanje is a stage of the Peaks of the Balkans trail: the official stage to Theth in Albania crosses the border at the Qafa e Pejës pass (1,707 m) and needs a border-crossing permission arranged in advance.",
      ],
      sq: [
        "Vuthaj — Vusanje në malazisht — shtrihet në krye të luginës në jug të Gucisë, nën muret gëlqerore të Bjeshkëve të Nemuna.",
        "Ujëvara e Grlës është në skaj të fshatit dhe burimi Oko Skakavice rreth 1,5 km më tej. Në jug të fshatit, lugina e Ropojanës shtrihet drejt kufirit me Shqipërinë.",
        "Vuthaj është një etapë e shtegut Majat e Ballkanit: etapa zyrtare për në Theth të Shqipërisë kalon kufirin në Qafën e Pejës (1.707 m) dhe kërkon leje kalimi kufiri të siguruar paraprakisht.",
      ],
      cnr: [
        "Vusanje — na albanskom Vuthaj — leži na čelu doline južno od Gusinja, ispod krečnjačkih zidova Prokletija.",
        "Vodopad Grlja je na rubu sela, a izvor Oko Skakavice oko 1,5 km dalje. Južno od sela dolina Ropojane pruža se ka granici s Albanijom.",
        "Vusanje je etapa staze Vrhovi Balkana: zvanična etapa do Teta u Albaniji prelazi granicu na prevoju Qafa e Pejës (1.707 m) i zahtijeva unaprijed pribavljenu dozvolu za prelazak granice.",
      ],
    },
    highlights: {
      en: ["Grlja waterfall on the edge of the village", "Oko Skakavice spring, about 1.5 km further", "Start of the Peaks of the Balkans stage to Theth"],
      sq: ["Ujëvara e Grlës në skaj të fshatit", "Burimi Oko Skakavice, rreth 1,5 km më tej", "Nisja e etapës së Majave të Ballkanit për në Theth"],
      cnr: ["Vodopad Grlja na rubu sela", "Izvor Oko Skakavice, oko 1,5 km dalje", "Početak etape Vrhova Balkana do Teta"],
    },
    location: { lat: 42.52944, lng: 19.84028, precision: "area", status: "desk-verified", sources: ["wiki-vusanje", "wikidata-vusanje"] },
    photos: [C.vusanjeVillage, C.vusanjeView, C.vusanjeGuesthouses, C.vusanjeStoneHouse, C.vusanjePeaks],
    warnings: [
      {
        en: "Crossing into Albania on foot is only allowed with permission requested in advance — see the Vusanje–Theth route page.",
        sq: "Kalimi në këmbë për në Shqipëri lejohet vetëm me leje të kërkuar paraprakisht — shihni faqen e itinerarit Vuthaj–Theth.",
        cnr: "Prelazak pješice u Albaniju dozvoljen je samo uz unaprijed traženu dozvolu — pogledajte stranicu rute Vusanje–Teth.",
      },
    ],
    routes: ["grlja-oko-skakavice-walk", "vusanje-theth", "zla-kolata-from-vusanje"],
    verification: desk(
      ["wiki-vusanje", "wikidata-vusanje", "mapcarta-gusinje", "komoot-grlja", "locwiki-vusanje-valbona", "pob-vusanje-theth"],
      "Wikipedia and Wikidata place the village centre about 570 m apart; the map marks the area, not a building. Elevation left out: sources give 900–1,060 m.",
    ),
    translations: DRAFTS,
  },
  {
    slug: "ali-pashas-springs",
    kind: "place",
    name: { en: "Ali Pasha's Springs", sq: "Burimet e Ali Pashës", cnr: "Alipašini izvori" },
    altNames: [
      { name: "Alipašini izvori", lang: "cnr" },
      { name: "Ali Paša Springs", lang: "en" },
    ],
    category: "spring",
    area: "gusinje",
    summary: {
      en: "Cold karst springs feeding a broad, clear pool about 2 km south of Gusinje — an easy walk or a short drive from town.",
      sq: "Burime karstike të ftohta që ushqejnë një pellg të gjerë e të kthjellët rreth 2 km në jug të Gucisë — një shëtitje e lehtë ose një rrugë e shkurtër me makinë nga qyteti.",
      cnr: "Hladni kraški izvori koji pune široko, bistro jezerce oko 2 km južno od Gusinja — laka šetnja ili kratka vožnja iz grada.",
    },
    description: {
      en: [
        "Ali Pasha's Springs (Alipašini izvori) rise about 2 km south of the centre of Gusinje, at around 925 m, and fill a wide, shallow pool with very cold water — measured at about 5.6–6.6 °C.",
        "Lonely Planet describes them as a five-minute drive, or an easy 25-minute walk, south of Gusinje.",
      ],
      sq: [
        "Burimet e Ali Pashës (Alipašini izvori) dalin rreth 2 km në jug të qendrës së Gucisë, në rreth 925 m lartësi, dhe mbushin një pellg të gjerë e të cekët me ujë shumë të ftohtë — të matur rreth 5,6–6,6 °C.",
        "Lonely Planet i përshkruan si pesë minuta me makinë, ose një shëtitje e lehtë prej 25 minutash, në jug të Gucisë.",
      ],
      cnr: [
        "Alipašini izvori izviru oko 2 km južno od centra Gusinja, na oko 925 m nadmorske visine, i pune široko, plitko jezerce vrlo hladnom vodom — izmjereno oko 5,6–6,6 °C.",
        "Lonely Planet ih opisuje kao pet minuta vožnje, odnosno laku šetnju od 25 minuta, južno od Gusinja.",
      ],
    },
    highlights: {
      en: ["Clear pool fed by many springs", "Easy to reach from Gusinje"],
      sq: ["Pellg i kthjellët i ushqyer nga shumë burime", "Lehtë i arritshëm nga Gucia"],
      cnr: ["Bistro jezerce koje pune brojni izvori", "Lako dostupno iz Gusinja"],
    },
    location: {
      lat: 42.549445,
      lng: 19.824652,
      precision: "point",
      status: "desk-verified",
      sources: ["photomne-alipasa", "komoot-alipasa", "outdooractive-alipasa"],
    },
    photos: [C.aliPashaSprings],
    access: {
      en: "About 2 km south of Gusinje's centre: roughly five minutes by car, or an easy walk of about 25 minutes (as described by Lonely Planet).",
      sq: "Rreth 2 km në jug të qendrës së Gucisë: afërsisht pesë minuta me makinë, ose një shëtitje e lehtë prej rreth 25 minutash (sipas Lonely Planet).",
      cnr: "Oko 2 km južno od centra Gusinja: otprilike pet minuta kolima, ili laka šetnja od oko 25 minuta (prema opisu Lonely Planeta).",
    },
    warnings: [
      {
        en: "The water is very cold all year (around 6 °C).",
        sq: "Uji është shumë i ftohtë gjatë gjithë vitit (rreth 6 °C).",
        cnr: "Voda je vrlo hladna tokom cijele godine (oko 6 °C).",
      },
    ],
    verification: desk(["wiki-gusinje", "lonelyplanet-alipasa", "photomne-alipasa", "komoot-alipasa", "outdooractive-alipasa", "mne-travel-prokletije"]),
    translations: DRAFTS,
  },
  {
    slug: "grlja",
    kind: "place",
    name: { en: "Grlja waterfall", sq: "Ujëvara e Grlës", cnr: "Vodopad Grlja" },
    altNames: [
      { name: "Grlja", lang: "cnr" },
      { name: "Grla / Gërla", lang: "sq" },
    ],
    category: "waterfall",
    area: "vusanje",
    summary: {
      en: "On the edge of Vusanje the Skakavica plunges about 15 m into the narrow Grlja canyon. Seeing the fall is easy; going into the canyon is a technical descent for equipped, experienced groups.",
      sq: "Në skaj të Vuthajve, Skakavica bie rreth 15 m në kanionin e ngushtë të Grlës. Ta shohësh ujëvarën është e lehtë; hyrja në kanion është zbritje teknike vetëm për grupe të pajisura e me përvojë.",
      cnr: "Na rubu Vusanja Skakavica pada oko 15 m u uski kanjon Grlje. Vidjeti vodopad je lako; ulazak u kanjon je tehnički spust za opremljene i iskusne grupe.",
    },
    description: {
      en: [
        "Montenegro's national tourism organisation describes a waterfall of about 15 metres at the entrance to the Grlja canyon, where the stream disappears between the rock walls. (Other sources give heights from 12 to 30 m.)",
        "Seeing the waterfall: the fall is on the outskirts of Vusanje, next to a restaurant, and a short walk from a parking area — a popular stop combined with the walk to Oko Skakavice.",
        "Entering the canyon is different: according to the national tourism organisation, passage through the canyon “requires adequate equipment, remarkable preparation, and experience”, and is best attempted in early autumn when the water is lowest. Canyoning descriptions mention a rope descent of around 30 m.",
      ],
      sq: [
        "Organizata Kombëtare e Turizmit e Malit të Zi përshkruan një ujëvarë rreth 15 metra në hyrje të kanionit të Grlës, ku përroi zhduket mes mureve shkëmbore. (Burime të tjera japin lartësi nga 12 deri në 30 m.)",
        "Për ta parë ujëvarën: ajo ndodhet në periferi të Vuthajve, pranë një restoranti, dhe në pak hapa nga një parking — ndalesë e njohur që kombinohet me shëtitjen deri te Oko Skakavice.",
        "Hyrja në kanion është tjetër gjë: sipas organizatës kombëtare të turizmit, kalimi nëpër kanion “kërkon pajisje të përshtatshme, përgatitje të jashtëzakonshme dhe përvojë”, dhe bëhet më mirë në fillim të vjeshtës, kur uji është më i ulët. Përshkrimet e kanioningut përmendin një zbritje me litar rreth 30 m.",
      ],
      cnr: [
        "Nacionalna turistička organizacija Crne Gore opisuje vodopad od oko 15 metara na ulazu u kanjon Grlje, gdje potok nestaje između stijena. (Drugi izvori navode visine od 12 do 30 m.)",
        "Razgledanje vodopada: vodopad je na periferiji Vusanja, pored restorana, nekoliko koraka od parkinga — omiljeno stajalište koje se spaja sa šetnjom do Oka Skakavice.",
        "Ulazak u kanjon je nešto drugo: prema nacionalnoj turističkoj organizaciji, prolazak kroz kanjon „zahtijeva adekvatnu opremu, izuzetnu pripremu i iskustvo”, a najbolje ga je pokušati početkom jeseni, kada je vodostaj najniži. Opisi kanjoninga pominju spust užetom od oko 30 m.",
      ],
    },
    highlights: {
      en: ["A waterfall of about 15 m into a deep, narrow canyon", "Easy to see from the edge of Vusanje", "Canyon descent only for equipped, experienced groups"],
      sq: ["Ujëvarë rreth 15 m në një kanion të thellë e të ngushtë", "Lehtë për t'u parë nga skaji i Vuthajve", "Zbritja në kanion vetëm për grupe të pajisura e me përvojë"],
      cnr: ["Vodopad od oko 15 m u dubok, uzak kanjon", "Lako se vidi s ruba Vusanja", "Spust kroz kanjon samo za opremljene i iskusne grupe"],
    },
    location: { lat: 42.52283, lng: 19.84138, precision: "point", status: "desk-verified", sources: ["opencanyon-grlja", "evendo-grlja"] },
    photos: [C.grlja],
    access: {
      en: "On the outskirts of Vusanje, a short walk from a parking area. The mapped point is the canyon entrance as two canyoning and travel sites give it; it has not been checked on site — follow local signs.",
      sq: "Në periferi të Vuthajve, në pak hapa nga një parking. Pika në hartë është hyrja e kanionit siç e japin dy faqe kanioningu dhe udhëtimi; nuk është kontrolluar në vend — ndiqni shenjat vendore.",
      cnr: "Na periferiji Vusanja, nekoliko koraka od parkinga. Tačka na karti je ulaz u kanjon kako ga navode dva sajta o kanjoningu i putovanjima; nije provjerena na licu mjesta — pratite lokalne oznake.",
    },
    warnings: [
      {
        en: "Do not enter the canyon or climb down to the pool without canyoning equipment, training and a qualified guide.",
        sq: "Mos hyni në kanion dhe mos zbritni te pellgu pa pajisje kanioningu, trajnim dhe një udhërrëfyes të kualifikuar.",
        cnr: "Ne ulazite u kanjon i ne silazite do bazena bez opreme za kanjoning, obuke i kvalifikovanog vodiča.",
      },
      {
        en: "Rock edges near the fall can be wet and slippery; keep children close.",
        sq: "Buzët e shkëmbinjve pranë ujëvarës mund të jenë të lagura dhe të rrëshqitshme; mbajini fëmijët pranë.",
        cnr: "Ivice stijena kod vodopada mogu biti mokre i klizave; djecu držite uz sebe.",
      },
    ],
    officialLinks: ["mne-travel-grlja-canyon"],
    routes: ["grlja-oko-skakavice-walk", "grlja-canyon"],
    verification: desk(
      ["mne-travel-grlja-canyon", "komoot-grlja", "komoot-grlja-loop", "descente-grlja"],
      "Position: the canyon entrance as published by OpenCanyon and Evendo (they agree within about 5 m); to be confirmed on site.",
    ),
    translations: DRAFTS,
  },
  {
    slug: "oko-skakavice",
    kind: "place",
    name: { en: "Oko Skakavice", sq: "Oko Skakavice", cnr: "Oko Skakavice" },
    altNames: [
      { name: "Blue Eye of Vusanje", lang: "en" },
      { name: "Oko Skakavice", lang: "cnr", note: { en: "“the eye of the Skakavica”", sq: "“syri i Skakavicës”", cnr: "„oko Skakavice”" } },
    ],
    category: "spring",
    area: "vusanje",
    summary: {
      en: "A clear spring pool above Vusanje, about 1.5 km on from the Grlja waterfall — often combined with Grlja in one short walk.",
      sq: "Pellg i kthjellët burimi mbi Vuthaj, rreth 1,5 km pas ujëvarës së Grlës — shpesh kombinohet me Grlën në një shëtitje të shkurtër.",
      cnr: "Bistro izvorsko jezerce iznad Vusanja, oko 1,5 km dalje od vodopada Grlja — često se obilazi zajedno s Grljom u kratkoj šetnji.",
    },
    description: {
      en: [
        "Oko Skakavice — “the eye of the Skakavica”, sometimes called the Blue Eye of Vusanje — is the spring pool of the stream that falls at Grlja. It lies about 1.5 km on from the waterfall, at roughly 1,000–1,060 m depending on the source.",
        "Walkers report that the spring can be completely dry in October and November, so in late autumn you may find a dry bed rather than a pool.",
      ],
      sq: [
        "Oko Skakavice — “syri i Skakavicës”, që ndonjëherë quhet Syri i Kaltër i Vuthajve — është pellgu i burimit të përroit që bie te Grla. Ndodhet rreth 1,5 km pas ujëvarës, në afërsisht 1.000–1.060 m sipas burimit.",
        "Ecësit raportojnë se burimi mund të jetë krejtësisht i thatë në tetor e nëntor, kështu që në fund të vjeshtës mund të gjeni shtrat të thatë në vend të pellgut.",
      ],
      cnr: [
        "Oko Skakavice — „oko Skakavice”, ponekad zvano Plavo oko Vusanja — izvorsko je jezerce potoka koji pada kod Grlje. Nalazi se oko 1,5 km dalje od vodopada, na otprilike 1.000–1.060 m, zavisno od izvora.",
        "Planinari navode da izvor u oktobru i novembru može potpuno presušiti, pa kasno u jesen umjesto jezerca možete zateći suvo korito.",
      ],
    },
    location: { lat: 42.51187, lng: 19.834791, precision: "point", status: "desk-verified", sources: ["photomne-oko", "hikr-oko"] },
    photos: [C.blueEye],
    seasonality: {
      en: "Can be dry in October and November (walkers' reports).",
      sq: "Mund të jetë i thatë në tetor dhe nëntor (sipas ecësve).",
      cnr: "U oktobru i novembru može biti suvo (prema planinarima).",
    },
    officialLinks: ["togusinje-oko-skakavice"],
    routes: ["grlja-oko-skakavice-walk"],
    verification: desk(["photomne-oko", "hikr-oko", "togusinje-oko-skakavice", "locwiki-vusanje-valbona", "komoot-grlja-loop"]),
    translations: DRAFTS,
  },
  {
    slug: "ropojana",
    kind: "place",
    name: { en: "Ropojana valley", sq: "Lugina e Ropojanës", cnr: "Dolina Ropojane" },
    altNames: [
      { name: "Ropojanska dolina", lang: "cnr" },
      { name: "Luginë e Ropojanës", lang: "sq" },
      { name: "Liqeni i Gjeshtarës", lang: "sq", note: { en: "the seasonal lake at its end", sq: "liqeni sezonal në fund të saj", cnr: "sezonsko jezero na njenom kraju" } },
    ],
    category: "valley",
    area: "ropojana",
    summary: {
      en: "A long glacial valley running south from near Gusinje to the Albanian border, ending at a lake that fills in early summer and dries to meadow by August or September.",
      sq: "Luginë e gjatë akullnajore që shtrihet në jug nga afër Gucisë deri te kufiri me Shqipërinë dhe mbaron te një liqen që mbushet në fillim të verës dhe kthehet në livadh deri në gusht a shtator.",
      cnr: "Duga glacijalna dolina koja se od blizu Gusinja pruža na jug do granice s Albanijom i završava jezerom koje se puni početkom ljeta, a do avgusta ili septembra presuši u livadu.",
    },
    description: {
      en: [
        "The Ropojana runs north to south between limestone walls, from near Gusinje to the border with Albania, where it ends at Lake Ropojana (Liqeni i Gjeshtarës in Albanian).",
        "The lake is typically visible at the beginning of summer but dries up completely by the end of summer (August or September), becoming a grassy meadow.",
        "The Peaks of the Balkans trail follows the valley towards the border on its way to Theth in Albania.",
      ],
      sq: [
        "Ropojana shtrihet nga veriu në jug mes mureve gëlqerore, nga afër Gucisë deri te kufiri me Shqipërinë, ku mbaron te Liqeni i Ropojanës (Liqeni i Gjeshtarës në shqip).",
        "Liqeni zakonisht duket në fillim të verës, por thahet plotësisht deri në fund të verës (gusht ose shtator) dhe kthehet në livadh me bar.",
        "Shtegu Majat e Ballkanit ndjek luginën drejt kufirit, rrugës për në Theth të Shqipërisë.",
      ],
      cnr: [
        "Ropojana se pruža od sjevera ka jugu između krečnjačkih zidova, od blizu Gusinja do granice s Albanijom, gdje se završava Ropojanskim jezerom (na albanskom Liqeni i Gjeshtarës).",
        "Jezero se obično vidi početkom ljeta, ali do kraja ljeta (avgust ili septembar) potpuno presuši i postane travnata livada.",
        "Staza Vrhovi Balkana prati dolinu ka granici na putu ka Tetu u Albaniji.",
      ],
    },
    highlights: {
      en: ["Limestone walls on both sides", "Seasonal lake at the head of the valley", "Peaks of the Balkans route towards Theth"],
      sq: ["Mure gëlqerore nga të dyja anët", "Liqen sezonal në krye të luginës", "Shtegu i Majave të Ballkanit drejt Thethit"],
      cnr: ["Krečnjački zidovi s obje strane", "Sezonsko jezero na čelu doline", "Staza Vrhova Balkana ka Tetu"],
    },
    location: { lat: 42.50194, lng: 19.81583, precision: "area", status: "desk-verified", sources: ["wiki-ropojana"] },
    photos: [C.ropojanaMeadow, C.ropojanaUpper, C.ropojanaRoad, C.ropojanaHiker],
    seasonality: {
      en: "The lake usually holds water in early summer and dries by August–September.",
      sq: "Liqeni zakonisht ka ujë në fillim të verës dhe thahet deri në gusht–shtator.",
      cnr: "Jezero obično ima vode početkom ljeta i presuši do avgusta–septembra.",
    },
    warnings: [
      {
        en: "The valley leads to the Albanian border. Crossing on foot needs permission requested in advance.",
        sq: "Lugina të çon te kufiri me Shqipërinë. Kalimi në këmbë kërkon leje të kërkuar paraprakisht.",
        cnr: "Dolina vodi do granice s Albanijom. Prelazak pješice zahtijeva unaprijed traženu dozvolu.",
      },
    ],
    fees: PARK_FEES,
    officialLinks: ["mne-travel-prokletije", "np-montenegro"],
    routes: ["vusanje-theth"],
    verification: desk(["wiki-ropojana", "wiki-lake-ropojana", "pob-vusanje-theth", "np-plan-2026", "np-annual-pass"], "Single published point for the valley; the map marks the valley, not a trailhead."),
    translations: DRAFTS,
  },
  {
    slug: "grbaja",
    kind: "place",
    name: { en: "Grbaja valley", sq: "Lugina e Gërbajës", cnr: "Dolina Grbaja" },
    altNames: [
      { name: "Grbaja / Grebaje", lang: "cnr" },
      { name: "Gërbaja", lang: "sq" },
    ],
    category: "valley",
    area: "grbaja",
    summary: {
      en: "A green valley about 7 km from Gusinje under the walls of Karanfili — the start of classic day hikes such as Volušnica.",
      sq: "Luginë e gjelbër rreth 7 km nga Gucia nën muret e Karanfilit — nisja e ecjeve klasike njëditore si ajo në Volushnicë.",
      cnr: "Zelena dolina oko 7 km od Gusinja, ispod zidova Karanfila — polazište klasičnih jednodnevnih tura poput Volušnice.",
    },
    description: {
      en: [
        "Grbaja (also written Grebaje) is a glacial valley in Prokletije National Park, about 7 km from Gusinje. The jagged Karanfili massif rises above it.",
        "A mountain hut stands in the valley at about 1,160 m, and paths lead from here to viewpoints such as Volušnica.",
      ],
      sq: [
        "Gërbaja (shkruhet edhe Grebaje) është luginë akullnajore në Parkun Kombëtar të Bjeshkëve të Nemuna, rreth 7 km nga Gucia. Mbi të ngrihet masivi i dhëmbëzuar i Karanfilit.",
        "Në luginë, në rreth 1.160 m, ndodhet një strehë malore dhe prej këtu nisin shtigje drejt pikave panoramike si Volushnica.",
      ],
      cnr: [
        "Grbaja (piše se i Grebaje) je glacijalna dolina u Nacionalnom parku Prokletije, oko 7 km od Gusinja. Iznad nje se diže nazubljeni masiv Karanfila.",
        "U dolini, na oko 1.160 m, nalazi se planinarski dom, a odavde staze vode ka vidikovcima poput Volušnice.",
      ],
    },
    highlights: {
      en: ["Views of the Karanfili walls", "Start of the Volušnica hike", "Inside Prokletije National Park"],
      sq: ["Pamje nga muret e Karanfilit", "Nisja e ecjes për në Volushnicë", "Brenda Parkut Kombëtar të Bjeshkëve të Nemuna"],
      cnr: ["Pogled na zidove Karanfila", "Početak ture na Volušnicu", "U Nacionalnom parku Prokletije"],
    },
    location: { lat: 42.5106, lng: 19.7926, precision: "area", status: "desk-verified", sources: ["summitpost-grbaja", "reliefmaps-grebaje"] },
    photos: [C.grbajaUpper, C.grbajaEvening, C.grbajaFromTalijanka],
    fees: PARK_FEES,
    officialLinks: ["np-montenegro", "np-prokletije-active"],
    routes: ["volusnica-from-grbaja"],
    verification: desk(["summitpost-grbaja", "reliefmaps-grebaje", "summitpost-karanfili", "np-prokletije-plan", "np-plan-2026", "np-annual-pass"]),
    translations: DRAFTS,
  },
  {
    slug: "karanfili",
    kind: "place",
    name: { en: "Karanfili", sq: "Karanfili", cnr: "Karanfili" },
    altNames: [
      { name: "Severni vrh / Maja Bals", lang: "other", note: { en: "North Peak, 2,460 m", sq: "Maja Veriore, 2.460 m", cnr: "Sjeverni vrh, 2.460 m" } },
      { name: "Veliki vrh / Kremeni vrh / Maja Gurt e Zjarmit", lang: "other", note: { en: "main summit, 2,490 m", sq: "maja kryesore, 2.490 m", cnr: "glavni vrh, 2.490 m" } },
      { name: "Južni vrh / Zlovrh / Maja e Keq", lang: "other", note: { en: "South Peak, 2,441 m", sq: "Maja Jugore, 2.441 m", cnr: "Južni vrh, 2.441 m" } },
    ],
    category: "mountain",
    area: "high-mountains",
    summary: {
      en: "A massif of jagged limestone peaks above the Grbaja valley, best admired from the valley floor or from Volušnica.",
      sq: "Masiv majash gëlqerore të dhëmbëzuara mbi luginën e Gërbajës, që shihet më bukur nga fundi i luginës ose nga Volushnica.",
      cnr: "Masiv nazubljenih krečnjačkih vrhova iznad doline Grbaja, najljepši kad se gleda s dna doline ili s Volušnice.",
    },
    description: {
      en: [
        "Karanfili rises above the Grbaja valley. SummitPost lists three main summits: the North Peak (Maja Bals, 2,460 m), the main summit Veliki vrh or Kremeni vrh (Maja Gurt e Zjarmit, 2,490 m) and the South Peak, Zlovrh (Maja e Keq, 2,441 m).",
        "The summits are serious mountain objectives. This guide describes the massif as a view; it does not describe climbing routes.",
      ],
      sq: [
        "Karanfili ngrihet mbi luginën e Gërbajës. SummitPost rendit tri maja kryesore: Maja Veriore (Maja Bals, 2.460 m), maja kryesore Veliki vrh ose Kremeni vrh (Maja Gurt e Zjarmit, 2.490 m) dhe Maja Jugore, Zlovrh (Maja e Keq, 2.441 m).",
        "Majat janë objektiva serioze malore. Ky udhëzues e përshkruan masivin si pamje; nuk përshkruan rrugë ngjitjeje.",
      ],
      cnr: [
        "Karanfili se dižu iznad doline Grbaja. SummitPost navodi tri glavna vrha: Sjeverni vrh (Maja Bals, 2.460 m), glavni Veliki ili Kremeni vrh (Maja Gurt e Zjarmit, 2.490 m) i Južni vrh, Zlovrh (Maja e Keq, 2.441 m).",
        "Vrhovi su ozbiljni planinski ciljevi. Ovaj vodič opisuje masiv kao vidik; ne opisuje penjačke smjerove.",
      ],
    },
    location: { lat: 42.49639, lng: 19.78694, precision: "point", status: "desk-verified", sources: ["wiki-de-veliki-vrh", "peakvisor-veliki-vrh"] },
    photos: [C.karanfili, C.karanfilWest, C.karanfilWinter, C.karanfilWinterAerial],
    warnings: [
      {
        en: "Summit routes are demanding, exposed mountain terrain. Go only with a qualified mountain guide.",
        sq: "Rrugët për në maja janë terren malor i vështirë dhe i ekspozuar. Shkoni vetëm me një udhërrëfyes malor të kualifikuar.",
        cnr: "Smjerovi do vrhova su zahtjevan, izložen planinski teren. Idite samo s kvalifikovanim planinskim vodičem.",
      },
    ],
    officialLinks: ["np-montenegro"],
    routes: ["volusnica-from-grbaja"],
    verification: desk(
      ["summitpost-karanfili", "wiki-de-veliki-vrh", "peakvisor-veliki-vrh"],
      "The map marks the main summit, Veliki vrh (German Wikipedia and PeakVisor agree within about 75 m). Elevations of the other summits from SummitPost.",
    ),
    translations: DRAFTS,
  },
  {
    slug: "zla-kolata",
    kind: "place",
    name: { en: "Zla Kolata", sq: "Kollata e Keqe", cnr: "Zla Kolata" },
    altNames: [
      { name: "Kollata e Keqe", lang: "sq" },
      { name: "Зла Колата", lang: "cnr", note: { en: "Cyrillic", sq: "cirilikë", cnr: "ćirilica" } },
    ],
    category: "mountain",
    area: "high-mountains",
    summary: {
      en: "Montenegro's highest summit, on the border with Albania about 10 km south of Gusinje — a long, demanding mountain day from Vusanje.",
      sq: "Maja më e lartë e Malit të Zi, në kufi me Shqipërinë, rreth 10 km në jug të Gucisë — një ditë e gjatë dhe e vështirë mali nga Vuthaj.",
      cnr: "Najviši vrh Crne Gore, na granici s Albanijom, oko 10 km južno od Gusinja — dug i zahtjevan planinski dan iz Vusanja.",
    },
    description: {
      en: [
        "Zla Kolata (Kollata e Keqe in Albanian) stands on the border between Montenegro and Albania. Wikipedia gives its height as 2,534 m; other surveys give between 2,528 and 2,535 m.",
        "The usual route climbs from Vusanje. It is a long day in high mountain terrain — see the route page for what published sources say and what is still to be verified.",
      ],
      sq: [
        "Kollata e Keqe (Zla Kolata në malazisht) ndodhet në kufirin mes Malit të Zi dhe Shqipërisë. Wikipedia jep lartësinë 2.534 m; matje të tjera japin nga 2.528 deri në 2.535 m.",
        "Rruga e zakonshme ngjitet nga Vuthaj. Është ditë e gjatë në terren të lartë malor — shihni faqen e itinerarit për atë që thonë burimet e publikuara dhe çfarë mbetet për t'u verifikuar.",
      ],
      cnr: [
        "Zla Kolata (na albanskom Kollata e Keqe) nalazi se na granici Crne Gore i Albanije. Wikipedia navodi visinu od 2.534 m; druga mjerenja daju između 2.528 i 2.535 m.",
        "Uobičajeni uspon kreće iz Vusanja. To je dug dan u visokoplaninskom terenu — na stranici rute pogledajte šta kažu objavljeni izvori i šta tek treba provjeriti.",
      ],
    },
    location: { lat: 42.485, lng: 19.89722, precision: "point", status: "desk-verified", sources: ["wiki-zla-kolata", "summitpost-kolata"] },
    photos: [C.zlaKolataNorthEast, C.zlaKolataNorthFace, { ...C.zlaKolataSummit, position: "40% 50%" }],
    warnings: [
      {
        en: "High mountain terrain on an international border: weather changes fast, there is little or no shelter, and you must not cross into Albania without permission.",
        sq: "Terren i lartë malor në kufi ndërkombëtar: moti ndryshon shpejt, strehë ka pak ose aspak, dhe nuk duhet të kaloni në Shqipëri pa leje.",
        cnr: "Visokoplaninski teren na međunarodnoj granici: vrijeme se brzo mijenja, zaklona ima malo ili nimalo, a u Albaniju ne smijete preći bez dozvole.",
      },
    ],
    officialLinks: ["np-montenegro", "gss-cg"],
    routes: ["zla-kolata-from-vusanje"],
    verification: desk(["wiki-zla-kolata", "summitpost-kolata", "takeadventure-zla-kolata", "wiki-gusinje-municipality"]),
    translations: DRAFTS,
  },
  {
    slug: "volusnica",
    kind: "place",
    name: { en: "Volušnica", sq: "Volushnica", cnr: "Volušnica" },
    altNames: [],
    category: "viewpoint",
    area: "grbaja",
    summary: {
      en: "A 1,879 m summit above Grbaja with wide views of the Karanfili walls — a popular day hike from the valley.",
      sq: "Majë 1.879 m mbi Gërbajë me pamje të gjera nga muret e Karanfilit — ecje e njohur njëditore nga lugina.",
      cnr: "Vrh od 1.879 m iznad Grbaje sa širokim pogledom na zidove Karanfila — omiljena jednodnevna tura iz doline.",
    },
    description: {
      en: [
        "Volušnica (1,879 m) is a grassy summit above the Grbaja valley, known for its view across to the Karanfili massif.",
        "A Montenegrin mountaineering site describes the climb from the Grbaja hut as about 2.5 hours to the top. See the route page for what is and is not yet verified.",
      ],
      sq: [
        "Volushnica (1.879 m) është majë me bar mbi luginën e Gërbajës, e njohur për pamjen drejt masivit të Karanfilit.",
        "Një faqe malazeze e alpinizmit e përshkruan ngjitjen nga streha e Gërbajës si rreth 2,5 orë deri në majë. Shihni faqen e itinerarit për atë që është dhe s'është verifikuar ende.",
      ],
      cnr: [
        "Volušnica (1.879 m) je travnati vrh iznad doline Grbaja, poznat po pogledu na masiv Karanfila.",
        "Jedan crnogorski planinarski sajt opisuje uspon od doma u Grbaji kao oko 2,5 sata do vrha. Na stranici rute pogledajte šta jeste, a šta još nije provjereno.",
      ],
    },
    location: null,
    photos: [],
    officialLinks: ["np-montenegro"],
    routes: ["volusnica-from-grbaja"],
    verification: desk(["summitpost-volusnica", "planine-volusnica"], "No reliable published coordinates found."),
    translations: DRAFTS,
  },
  {
    slug: "viziers-mosque",
    kind: "place",
    name: { en: "Vizier's Mosque", sq: "Xhamia e Vezirit", cnr: "Vezirova džamija" },
    altNames: [{ name: "Vezirova džamija", lang: "cnr" }],
    category: "culture",
    area: "gusinje",
    summary: {
      en: "The oldest preserved mosque in Gusinje, protected by law, on the town's central street beside two churches.",
      sq: "Xhamia më e vjetër e ruajtur në Guci, e mbrojtur me ligj, në rrugën qendrore të qytetit pranë dy kishave.",
      cnr: "Najstarija sačuvana džamija u Gusinju, zaštićena zakonom, u centralnoj ulici grada pored dvije crkve.",
    },
    description: {
      en: [
        "The Vizier's Mosque (Vezirova džamija) is described as the oldest preserved mosque in Gusinje; it is protected by law and was thoroughly repaired in 1992.",
        "Sources disagree on its age: Lonely Planet dates it to 1626, while Wikipedia says it was built by Kara Mahmud Bushati in 1765. Montenegro's tourism organisation calls it a 17th-century mosque.",
        "It stands on the same street as the Orthodox Church of St. Đorđe and the Catholic Church of St. Anton.",
      ],
      sq: [
        "Xhamia e Vezirit (Vezirova džamija) përshkruhet si xhamia më e vjetër e ruajtur në Guci; mbrohet me ligj dhe u restaurua tërësisht në vitin 1992.",
        "Burimet nuk pajtohen për moshën e saj: Lonely Planet e daton në vitin 1626, ndërsa Wikipedia thotë se u ndërtua nga Kara Mahmud Bushati në vitin 1765. Organizata e turizmit e Malit të Zi e quan xhami të shekullit XVII.",
        "Ndodhet në të njëjtën rrugë me Kishën Ortodokse të Shën Gjergjit dhe Kishën Katolike të Shën Ndout.",
      ],
      cnr: [
        "Vezirova džamija opisuje se kao najstarija sačuvana džamija u Gusinju; zaštićena je zakonom i temeljno obnovljena 1992. godine.",
        "Izvori se ne slažu oko njene starosti: Lonely Planet je datira u 1626, dok Wikipedia navodi da ju je 1765. sagradio Kara Mahmud Bušatlija. Turistička organizacija Crne Gore naziva je džamijom iz XVII vijeka.",
        "Nalazi se u istoj ulici kao pravoslavna crkva Svetog Đorđa i katolička crkva Svetog Antona.",
      ],
    },
    location: {
      lat: 42.563715,
      lng: 19.831604,
      precision: "point",
      status: "desk-verified",
      sources: ["photomne-mosques", "tripadvisor-viziers-mosque"],
    },
    photos: [],
    warnings: [
      {
        en: "A place of worship: visit outside prayer times and dress modestly.",
        sq: "Vend kulti: vizitojeni jashtë kohës së lutjes dhe vishuni në mënyrë të përshtatshme.",
        cnr: "Bogomolja: posjetite je van vremena molitve i obucite se pristojno.",
      },
    ],
    verification: desk(
      ["recultivatur-mosque", "lonelyplanet-viziers-mosque", "wiki-gusinje", "mne-travel-mountain-towns", "photomne-mosques"],
      "Founding date disputed between sources. Visiting customs to be confirmed with the Islamic community in Gusinje.",
    ),
    translations: DRAFTS,
  },

  /* --------------------------------------------- hidden gems (lesser known) */
  {
    slug: "lake-plav",
    kind: "place",
    gem: true,
    name: { en: "Lake Plav", sq: "Liqeni i Plavës", cnr: "Plavsko jezero" },
    altNames: [
      { name: "Plavsko jezero", lang: "cnr" },
      { name: "Liqeni i Plavës", lang: "sq" },
    ],
    category: "lake",
    area: "plav",
    summary: {
      en: "A glacial lake at 906 m beside the town of Plav, between the Prokletije and the Visitor range — about 2 km long and up to about 9 m deep.",
      sq: "Liqen akullnajor në 906 m pranë qytetit të Plavës, mes Bjeshkëve të Nemuna dhe vargut të Visitorit — rreth 2 km i gjatë dhe deri rreth 9 m i thellë.",
      cnr: "Glečersko jezero na 906 m pored Plava, između Prokletija i Visitora — dugo oko 2 km i duboko do oko 9 m.",
    },
    description: {
      en: [
        "Wikipedia describes Lake Plav as the largest glacial lake in Montenegro: about 2,160 m long from north to south, with an area of about 1.99 km² and a maximum depth of about 9 m. It drains into the Lim.",
        "Together with the Lim and the Grnčar valley, the lake is listed by BirdLife International as an Important Bird Area.",
      ],
      sq: [
        "Wikipedia e përshkruan Liqenin e Plavës si liqenin më të madh akullnajor në Mal të Zi: rreth 2.160 m i gjatë nga veriu në jug, me sipërfaqe rreth 1,99 km² dhe thellësi maksimale rreth 9 m. Derdhet në Lim.",
        "Bashkë me Limin dhe luginën e Grnçarit, liqeni është renditur nga BirdLife International si Zonë e Rëndësishme për Shpendët.",
      ],
      cnr: [
        "Wikipedia opisuje Plavsko jezero kao najveće glečersko jezero u Crnoj Gori: dugo oko 2.160 m od sjevera ka jugu, površine oko 1,99 km² i najveće dubine oko 9 m. Otiče u Lim.",
        "Zajedno s Limom i dolinom Grnčara, jezero je BirdLife International uvrstio u Područja važna za ptice.",
      ],
    },
    location: null,
    photos: [C.lakePlavLilies, C.lakePlavShore, C.lakePlavWide],
    verification: desk(["wiki-lake-plav", "birdlife-plav-grncar"], "No sourced coordinates recorded yet, so not on the map."),
    translations: DRAFTS,
  },
  {
    slug: "hridsko-lake",
    kind: "place",
    gem: true,
    name: { en: "Hridsko Lake", sq: "Liqeni i Hridit", cnr: "Hridsko jezero" },
    altNames: [
      { name: "Hridsko jezero", lang: "cnr" },
      { name: "Liqeni i Hridit", lang: "sq" },
    ],
    category: "lake",
    area: "high-mountains",
    summary: {
      en: "A small mountain lake at about 1,970 m above Plav, in a strict nature reserve of the national park.",
      sq: "Liqen i vogël malor rreth 1.970 m mbi Plavë, në një rezervat natyror të rreptë të parkut kombëtar.",
      cnr: "Malo planinsko jezero na oko 1.970 m iznad Plava, u strogom prirodnom rezervatu nacionalnog parka.",
    },
    description: {
      en: [
        "A study in the Journal of the Bulgarian Geographical Society gives an altitude of about 1,980 m and an area of about 3.5 ha. With Volušnica, the lake forms a strict reserve inside Prokletije National Park.",
        "The Peaks of the Balkans stage from Babino Polje to Plav passes the lake; trail descriptions put it 18–20 km from Plav.",
      ],
      sq: [
        "Një studim në Revistën e Shoqërisë Gjeografike Bullgare jep lartësi rreth 1.980 m dhe sipërfaqe rreth 3,5 ha. Bashkë me Volushnicën, liqeni formon një rezervat të rreptë brenda Parkut Kombëtar të Bjeshkëve të Nemuna.",
        "Etapa e Majave të Ballkanit nga Babino Polje në Plavë kalon pranë liqenit; përshkrimet e shtegut e vendosin 18–20 km nga Plava.",
      ],
      cnr: [
        "Studija u časopisu Bugarskog geografskog društva navodi nadmorsku visinu od oko 1.980 m i površinu od oko 3,5 ha. Zajedno s Volušnicom, jezero čini strogi rezervat u Nacionalnom parku Prokletije.",
        "Etapa Vrhova Balkana od Babinog polja do Plava prolazi pored jezera; opisi staze ga smještaju 18–20 km od Plava.",
      ],
    },
    location: null,
    photos: [C.hridskoLake],
    warnings: [
      {
        en: "Camping is not allowed at the lake: it lies in a strict reserve.",
        sq: "Kampimi nuk lejohet te liqeni: ndodhet në një rezervat të rreptë.",
        cnr: "Kampovanje kod jezera nije dozvoljeno: nalazi se u strogom rezervatu.",
      },
    ],
    verification: desk(["jbgs-hridsko", "parksdinarides-hridsko", "pob-babino-plav"], "No sourced coordinates recorded yet, so not on the map."),
    translations: DRAFTS,
  },
  {
    slug: "lake-visitor",
    kind: "place",
    gem: true,
    name: { en: "Lake Visitor", sq: "Liqeni i Visitorit", cnr: "Visitorsko jezero" },
    altNames: [{ name: "Visitorsko jezero", lang: "cnr" }],
    category: "lake",
    area: "plav",
    summary: {
      en: "A small lake high on Mount Visitor, west of Plav, known for its floating island.",
      sq: "Liqen i vogël lart në malin Visitor, në perëndim të Plavës, i njohur për ishullin e tij lundrues.",
      cnr: "Malo jezero visoko na Visitoru, zapadno od Plava, poznato po plutajućem ostrvu.",
    },
    description: {
      en: [
        "Sizes differ between sources: Wikipedia gives about 110 × 75 m; SummitPost gives about 92 × 73 m and 4.1 m deep, at about 1,820 m.",
        "Mount Visitor (2,211 m) rises west of Plav and Lake Plav.",
      ],
      sq: [
        "Përmasat ndryshojnë sipas burimeve: Wikipedia jep rreth 110 × 75 m; SummitPost jep rreth 92 × 73 m dhe 4,1 m thellësi, në rreth 1.820 m.",
        "Mali Visitor (2.211 m) ngrihet në perëndim të Plavës dhe të Liqenit të Plavës.",
      ],
      cnr: [
        "Dimenzije se razlikuju po izvorima: Wikipedia navodi oko 110 × 75 m; SummitPost oko 92 × 73 m i dubinu 4,1 m, na oko 1.820 m.",
        "Visitor (2.211 m) se diže zapadno od Plava i Plavskog jezera.",
      ],
    },
    location: null,
    photos: [],
    verification: desk(["wiki-lake-visitor", "wiki-visitor-mountain", "summitpost-visitor"], "No sourced coordinates recorded yet, so not on the map."),
    translations: DRAFTS,
  },
  {
    slug: "kusija-waterfall",
    kind: "place",
    gem: true,
    name: { en: "Kusija waterfall", sq: "Ujëvara Kusija", cnr: "Vodopad Kusija" },
    altNames: [{ name: "Kusija", lang: "other" }],
    category: "waterfall",
    area: "vusanje",
    summary: {
      en: "Vusanje's second waterfall: unlike Grlja, which falls all year, Kusija dries up at one point in the year.",
      sq: "Ujëvara e dytë e Vuthajve: ndryshe nga Grla, që bie gjithë vitin, Kusija thahet në një periudhë të vitit.",
      cnr: "Drugi vodopad Vusanja: za razliku od Grlje, koja pada cijele godine, Kusija u jednom dijelu godine presuši.",
    },
    description: {
      en: ["The Gusinje Tourism Organisation lists Kusija with Grlja among the falls of the Vusanje area. Its exact position and the way to it have not been checked for this guide — ask locally."],
      sq: ["Organizata Turistike e Gucisë e rendit Kusijën bashkë me Grlën mes ujëvarave të zonës së Vuthajve. Pozicioni i saktë dhe rruga deri aty nuk janë kontrolluar për këtë udhëzues — pyetni në vend."],
      cnr: ["Turistička organizacija Gusinje navodi Kusiju zajedno s Grljom među vodopadima područja Vusanja. Tačan položaj i put do njega nijesu provjereni za ovaj vodič — raspitajte se na licu mjesta."],
    },
    location: null,
    photos: [],
    verification: desk(["gusinje-travel-falls"], "Single source; position not recorded."),
    translations: DRAFTS,
  },
  {
    slug: "rosni-vrh",
    kind: "place",
    gem: true,
    name: { en: "Rosni vrh (Bjelič)", sq: "Maja Rosit (Bjeliqi)", cnr: "Rosni vrh (Bjelič)" },
    altNames: [
      { name: "Maja Rosit", lang: "sq" },
      { name: "Bjelič", lang: "cnr", note: { en: "the massif", sq: "masivi", cnr: "masiv" } },
    ],
    category: "mountain",
    area: "high-mountains",
    summary: {
      en: "The highest peak of the Bjelič massif, about 2,524 m — described as the third highest in Montenegro, usually approached from Gusinje through Grbaja.",
      sq: "Maja më e lartë e masivit të Bjeliqit, rreth 2.524 m — e përshkruar si e treta më e lartë në Mal të Zi, zakonisht nga Gucia përmes Gërbajës.",
      cnr: "Najviši vrh masiva Bjelič, oko 2.524 m — opisan kao treći po visini u Crnoj Gori, obično se prilazi iz Gusinja kroz Grbaju.",
    },
    description: {
      en: [
        "SummitPost gives 2,524–2,525 m and places the peak in the most karstic part of the Montenegrin Prokletije.",
        "The Gusinje Tourism Organisation lists Bjelič, with Volušnica and Karanfili, among the places that show the area's glacial and karst landscape.",
      ],
      sq: [
        "SummitPost jep 2.524–2.525 m dhe e vendos majën në pjesën më karstike të Bjeshkëve të Nemuna në Mal të Zi.",
        "Organizata Turistike e Gucisë e rendit Bjeliqin, bashkë me Volushnicën dhe Karanfilin, mes vendeve që tregojnë peizazhin akullnajor dhe karstik të zonës.",
      ],
      cnr: [
        "SummitPost navodi 2.524–2.525 m i smješta vrh u najkrševitiji dio crnogorskih Prokletija.",
        "Turistička organizacija Gusinje navodi Bjelič, uz Volušnicu i Karanfile, među mjestima koja pokazuju glečerski i kraški pejzaž kraja.",
      ],
    },
    location: null,
    photos: [],
    warnings: [
      {
        en: "A serious mountain objective in remote karst terrain. Go only with a qualified mountain guide.",
        sq: "Objektiv serioz malor në terren karstik të largët. Shkoni vetëm me një udhërrëfyes malor të kualifikuar.",
        cnr: "Ozbiljan planinski cilj u zabačenom kraškom terenu. Idite samo s kvalifikovanim planinskim vodičem.",
      },
    ],
    verification: desk(["summitpost-rosni-vrh", "gusinje-travel-national-park"], "Heights from SummitPost; no sourced coordinates recorded yet."),
    translations: DRAFTS,
  },
  {
    slug: "talijanka-popadija",
    kind: "place",
    gem: true,
    name: { en: "Talijanka and Popadija", sq: "Talijanka dhe Popadija", cnr: "Talijanka i Popadija" },
    altNames: [{ name: "Taljanka", lang: "other" }],
    category: "mountain",
    area: "grbaja",
    summary: {
      en: "Summits above Grbaja on the border with Albania, on the tourism organisation's themed hike Popadija – Talijanka – Volušnica.",
      sq: "Maja mbi Gërbajë në kufi me Shqipërinë, në ecjen tematike të organizatës turistike Popadija – Talijanka – Volushnica.",
      cnr: "Vrhovi iznad Grbaje na granici s Albanijom, na tematskoj turi turističke organizacije Popadija – Talijanka – Volušnica.",
    },
    description: {
      en: [
        "Names and heights differ between sources: a hiking site gives Talijanka 2,056–2,057 m and Popadija 2,030 m; SummitPost names Popadija (2,057 m), “also named Talijanka”.",
        "The Gusinje Tourism Organisation lists a thematic hike Popadija – Talijanka – Volušnica.",
      ],
      sq: [
        "Emrat dhe lartësitë ndryshojnë sipas burimeve: një faqe ecjesh jep Talijankën 2.056–2.057 m dhe Popadijën 2.030 m; SummitPost e quan Popadija (2.057 m), “e quajtur edhe Talijanka”.",
        "Organizata Turistike e Gucisë rendit një ecje tematike Popadija – Talijanka – Volushnica.",
      ],
      cnr: [
        "Nazivi i visine se razlikuju po izvorima: jedan planinarski sajt navodi Talijanku 2.056–2.057 m i Popadiju 2.030 m; SummitPost navodi Popadiju (2.057 m), „zvanu i Talijanka”.",
        "Turistička organizacija Gusinje navodi tematsku turu Popadija – Talijanka – Volušnica.",
      ],
    },
    location: null,
    photos: [],
    warnings: [
      {
        en: "The summits lie on the state border: check the border rules before you go (see the travel tips).",
        sq: "Majat ndodhen në kufirin shtetëror: kontrolloni rregullat e kufirit para se të shkoni (shihni këshillat e udhëtimit).",
        cnr: "Vrhovi su na državnoj granici: prije polaska provjerite pravila za granicu (vidjeti savjete za putovanje).",
      },
    ],
    verification: desk(["planine-volusnica", "summitpost-popadija", "gusinje-to"], "Names and heights disagree between sources; no coordinates recorded."),
    translations: DRAFTS,
  },
  {
    slug: "grncar-valley",
    kind: "place",
    gem: true,
    name: { en: "Grnčar valley", sq: "Lugina e Grnçarit", cnr: "Dolina Grnčara" },
    altNames: [{ name: "Grnčar", lang: "cnr" }],
    category: "valley",
    area: "gusinje",
    summary: {
      en: "The valley of the Grnčar, the river that comes from Albania and meets the Vruja at Gusinje to form the Ljuča.",
      sq: "Lugina e Grnçarit, lumit që vjen nga Shqipëria dhe takohet me Vrujën te Gucia për të formuar Luçën.",
      cnr: "Dolina Grnčara, rijeke koja dolazi iz Albanije i kod Gusinja se spaja s Vrujom u Ljuču.",
    },
    description: {
      en: [
        "The tourism organisation describes the Grnčar valley as “dry and bright with pebbles and sand”, in contrast to the green, marshy Ljuča.",
        "With Lake Plav and the Lim, the Grnčar valley is part of an Important Bird Area listed by BirdLife International.",
      ],
      sq: [
        "Organizata turistike e përshkruan luginën e Grnçarit si “të thatë dhe të ndritshme me zhavorr e rërë”, ndryshe nga Luça e gjelbër dhe moçalore.",
        "Bashkë me Liqenin e Plavës dhe Limin, lugina e Grnçarit është pjesë e një Zone të Rëndësishme për Shpendët të renditur nga BirdLife International.",
      ],
      cnr: [
        "Turistička organizacija opisuje dolinu Grnčara kao „suvu i svijetlu, punu šljunka i pijeska”, za razliku od zelene, močvarne Ljuče.",
        "Zajedno s Plavskim jezerom i Limom, dolina Grnčara je dio Područja važnog za ptice koje je uvrstio BirdLife International.",
      ],
    },
    location: null,
    photos: [],
    verification: desk(["togusinje-rivers", "birdlife-plav-grncar"], "No sourced coordinates recorded yet, so not on the map."),
    translations: DRAFTS,
  },
];
