/**
 * Travel Tips. Each section says how it is known: "source-checked" sections
 * repeat what the cited sources say; "needs-local-review" sections are
 * general advice that a local editor must confirm before it can be presented
 * as local guidance — the page marks them as such. Emergency numbers, permits,
 * border crossings and park rules are only stated from official sources.
 *
 * Owner: the role responsible for keeping a guide current.
 */

import type { Guide, TranslationStatus, Verification } from "./types";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };
const UPDATED = "2026-10-10";

const v = (sources: string[], notes?: string): Verification => ({
  status: "desk-verified",
  lastChecked: UPDATED,
  owner: "Editorial team",
  sources,
  notes,
});

export const guides: Guide[] = [
  {
    slug: "getting-here",
    kind: "guide",
    topic: "getting-here",
    title: { en: "Getting here and getting around", sq: "Si të vini dhe si të lëvizni", cnr: "Kako doći i kako se kretati" },
    summary: {
      en: "Roads into the valley, the border crossing towards Albania, buses, and moving between Gusinje, Vusanje and the trailheads.",
      sq: "Rrugët për në luginë, pika kufitare drejt Shqipërisë, autobusët dhe lëvizja mes Gucisë, Vuthajve dhe nisjeve të shtigjeve.",
      cnr: "Putevi do doline, granični prelaz ka Albaniji, autobusi i kretanje između Gusinja, Vusanja i polazišta staza.",
    },
    sections: [
      {
        heading: { en: "By road", sq: "Me rrugë", cnr: "Drumom" },
        body: {
          en: [
            "Gusinje is on the R-2 regional road, which runs Berane – Andrijevica – Plav – Gusinje to the Grnčar border crossing with Albania. It is the main link between these four eastern municipalities.",
            "Road distances and journey times depend on your route and the season. Check a routing service and current road conditions before you set off.",
          ],
          sq: [
            "Gucia ndodhet në rrugën rajonale R-2, që shkon Beranë – Andrijevicë – Plavë – Guci deri te pika kufitare e Grnçarit me Shqipërinë. Është lidhja kryesore mes këtyre katër komunave lindore.",
            "Distancat dhe kohëzgjatja e udhëtimit varen nga rruga dhe stina. Kontrolloni një shërbim navigimi dhe kushtet aktuale të rrugës para se të nisni.",
          ],
          cnr: [
            "Gusinje se nalazi na regionalnom putu R-2, koji vodi Berane – Andrijevica – Plav – Gusinje do graničnog prelaza Grnčar s Albanijom. To je glavna veza ove četiri istočne opštine.",
            "Udaljenosti i trajanje puta zavise od rute i godišnjeg doba. Prije polaska provjerite servis za rute i aktuelno stanje na putevima.",
          ],
        },
        sources: ["road-categorisation", "wiki-r2"],
        status: "source-checked",
      },
      {
        heading: { en: "Towards Albania: the Grnčar crossing", sq: "Drejt Shqipërisë: pika e Grnçarit", cnr: "Ka Albaniji: prelaz Grnčar" },
        body: {
          en: [
            "A road border crossing at Grnčar, near Gusinje, connects with Vermosh (Baškim) in Albania. Montenegro's government announced it open in May 2020.",
            "It does not appear on the Ministry of the Interior's current list of crossings with Albania, and we found no official opening hours. Check its status with the border police before planning a route through it.",
          ],
          sq: [
            "Një pikë kufitare rrugore në Grnçar, pranë Gucisë, lidhet me Vermoshin (Bashkimin) në Shqipëri. Qeveria e Malit të Zi njoftoi hapjen e saj në maj 2020.",
            "Ajo nuk shfaqet në listën aktuale të Ministrisë së Brendshme për pikat me Shqipërinë dhe nuk gjetëm orar zyrtar. Kontrolloni statusin e saj me policinë kufitare para se të planifikoni një rrugë përmes saj.",
          ],
          cnr: [
            "Drumski granični prelaz Grnčar, kod Gusinja, povezuje se s Vermošem (Baškimom) u Albaniji. Vlada Crne Gore najavila je njegovo otvaranje u maju 2020.",
            "Ne nalazi se na aktuelnom spisku prelaza s Albanijom Ministarstva unutrašnjih poslova, a zvanično radno vrijeme nijesmo pronašli. Provjerite status kod granične policije prije nego što planirate put preko njega.",
          ],
        },
        sources: ["gov-border-2020", "gov-border-list", "wiki-alb-mne-border"],
        status: "source-checked",
      },
      {
        heading: { en: "By bus", sq: "Me autobus", cnr: "Autobusom" },
        body: {
          en: [
            "We have not found an official timetable for buses to Gusinje. Montenegro's tourism organisation suggests buying tickets through BusTicket4.me or at bus-station counters.",
            "Ask your accommodation about current connections before you travel.",
          ],
          sq: [
            "Nuk kemi gjetur orar zyrtar për autobusët për në Guci. Organizata e turizmit e Malit të Zi sugjeron blerjen e biletave përmes BusTicket4.me ose në sportelet e stacioneve.",
            "Pyesni akomodimin tuaj për lidhjet aktuale para se të udhëtoni.",
          ],
          cnr: [
            "Nijesmo pronašli zvanični red vožnje autobusa do Gusinja. Turistička organizacija Crne Gore preporučuje kupovinu karata preko BusTicket4.me ili na šalterima autobuskih stanica.",
            "Prije puta pitajte svoj smještaj za aktuelne veze.",
          ],
        },
        sources: ["mne-travel-journey"],
        status: "source-checked",
      },
      {
        heading: { en: "Moving around the valley", sq: "Lëvizja nëpër luginë", cnr: "Kretanje po dolini" },
        body: {
          en: [
            "Distances in the valley are short: Ali Pasha's Springs are about 2 km from the centre of Gusinje and Vusanje about 4.5 km. Grbaja is about 7 km away.",
            "We have not found public transport inside the valley. Plan to walk, drive or arrange a transfer with your accommodation or a local operator.",
          ],
          sq: [
            "Distancat në luginë janë të shkurtra: Burimet e Ali Pashës janë rreth 2 km nga qendra e Gucisë dhe Vuthaj rreth 4,5 km. Gërbaja është rreth 7 km larg.",
            "Nuk kemi gjetur transport publik brenda luginës. Planifikoni të ecni, të ngisni makinën ose të rregulloni transport me akomodimin tuaj ose një operator vendor.",
          ],
          cnr: [
            "Udaljenosti u dolini su male: Alipašini izvori su oko 2 km od centra Gusinja, a Vusanje oko 4,5 km. Grbaja je oko 7 km daleko.",
            "Nijesmo pronašli javni prevoz unutar doline. Planirajte pješačenje, vožnju ili prevoz preko smještaja ili lokalnog prevoznika.",
          ],
        },
        sources: ["wiki-gusinje", "mapcarta-gusinje", "summitpost-karanfili"],
        status: "needs-local-review",
      },
    ],
    owner: "Editorial team",
    updated: UPDATED,
    verification: v(["road-categorisation", "wiki-r2", "gov-border-2020", "gov-border-list", "mne-travel-journey"]),
    translations: DRAFTS,
  },
  {
    slug: "where-to-stay",
    kind: "guide",
    topic: "where-to-stay",
    title: { en: "Choosing where to stay", sq: "Ku të qëndroni", cnr: "Gdje odsjesti" },
    summary: {
      en: "Gusinje, Vusanje or a katun in the valleys — what each base is close to, and how the listings on this site work.",
      sq: "Gucia, Vuthaj apo një katun në lugina — çfarë ka pranë çdo vendqëndrim dhe si funksionojnë listimet në këtë faqe.",
      cnr: "Gusinje, Vusanje ili katun u dolinama — šta je blizu kojoj bazi i kako funkcionišu oglasi na ovom sajtu.",
    },
    sections: [
      {
        heading: { en: "Gusinje: the town base", sq: "Gucia: baza në qytet", cnr: "Gusinje: baza u gradu" },
        body: {
          en: ["The town is where the roads to Vusanje and Grbaja begin, with Ali Pasha's Springs about 2 km south and the mosque and churches in the centre."],
          sq: ["Qyteti është aty ku nisin rrugët për në Vuthaj dhe Gërbajë, me Burimet e Ali Pashës rreth 2 km në jug dhe xhaminë e kishat në qendër."],
          cnr: ["Grad je mjesto gdje počinju putevi ka Vusanju i Grbaji, s Alipašinim izvorima oko 2 km južno i džamijom i crkvama u centru."],
        },
        sources: ["wiki-gusinje", "mne-travel-mountain-towns"],
        status: "source-checked",
      },
      {
        heading: { en: "Vusanje: close to the water and the trails", sq: "Vuthaj: pranë ujit dhe shtigjeve", cnr: "Vusanje: blizu vode i staza" },
        body: {
          en: ["Vusanje puts you a short walk from the Grlja waterfall and Oko Skakavice, at the start of the Ropojana and of the Peaks of the Balkans stage to Theth."],
          sq: ["Vuthaj ju vendos në pak hapa nga ujëvara e Grlës dhe Oko Skakavice, në nisje të Ropojanës dhe të etapës së Majave të Ballkanit për në Theth."],
          cnr: ["Iz Vusanja ste nadomak vodopada Grlja i Oka Skakavice, na početku Ropojane i etape Vrhova Balkana do Teta."],
        },
        sources: ["komoot-grlja", "locwiki-vusanje-valbona", "pob-vusanje-theth"],
        status: "source-checked",
      },
      {
        heading: { en: "How the listings on this site work", sq: "Si funksionojnë listimet në këtë faqe", cnr: "Kako funkcionišu oglasi na ovom sajtu" },
        body: {
          en: [
            "The directory has just started and does not yet list every place to stay. Listings are shown A–Z. Each says whether its details were supplied by the business or checked independently.",
            "This guide is created by ROSI, which runs two of the listed places; they are marked as such and are not ranked above others. The Gusinje Tourism Organisation publishes its own list of accommodation.",
          ],
          sq: [
            "Drejtoria sapo ka nisur dhe nuk i rendit ende të gjitha vendet ku mund të qëndroni. Listimet shfaqen sipas alfabetit. Secili tregon nëse të dhënat i ka dhënë biznesi apo janë kontrolluar në mënyrë të pavarur.",
            "Ky udhëzues krijohet nga ROSI, që drejton dy nga vendet e listuara; ato janë të shënuara si të tilla dhe nuk renditen mbi të tjerët. Organizata Turistike e Gucisë publikon listën e vet të akomodimit.",
          ],
          cnr: [
            "Imenik je tek počeo i još ne navodi sva mjesta za boravak. Oglasi su poređani abecedno. Svaki navodi da li je podatke dao sam objekat ili su nezavisno provjereni.",
            "Ovaj vodič pravi ROSI, koji vodi dva navedena objekta; oni su tako i označeni i nijesu rangirani iznad drugih. Turistička organizacija Gusinje objavljuje sopstveni spisak smještaja.",
          ],
        },
        sources: ["togusinje-hotels"],
        status: "source-checked",
      },
    ],
    owner: "Editorial team",
    updated: UPDATED,
    verification: v(["wiki-gusinje", "komoot-grlja", "pob-vusanje-theth", "togusinje-hotels"]),
    translations: DRAFTS,
  },
  {
    slug: "seasons-and-packing",
    kind: "guide",
    topic: "seasons",
    title: { en: "Seasons and what to pack", sq: "Stinët dhe çfarë të merrni me vete", cnr: "Godišnja doba i šta ponijeti" },
    summary: {
      en: "When the park is busiest, how the springs and the Ropojana lake change through the year, and what to bring.",
      sq: "Kur parku ka më shumë vizitorë, si ndryshojnë burimet dhe liqeni i Ropojanës gjatë vitit, dhe çfarë të merrni.",
      cnr: "Kada je park najposjećeniji, kako se izvori i Ropojansko jezero mijenjaju tokom godine i šta ponijeti.",
    },
    sections: [
      {
        heading: { en: "The busy season", sq: "Sezoni i ngarkuar", cnr: "Glavna sezona" },
        body: {
          en: ["The national park records most visitors from June to October."],
          sq: ["Parku kombëtar regjistron më shumë vizitorë nga qershori deri në tetor."],
          cnr: ["Nacionalni park bilježi najveću posjećenost od juna do oktobra."],
        },
        sources: ["np-plan-2026"],
        status: "source-checked",
      },
      {
        heading: { en: "Water through the year", sq: "Uji gjatë vitit", cnr: "Voda tokom godine" },
        body: {
          en: [
            "Lake Ropojana usually holds water at the beginning of summer and dries completely by August or September, becoming a meadow.",
            "Walkers report that Oko Skakavice can be dry in October and November.",
          ],
          sq: [
            "Liqeni i Ropojanës zakonisht ka ujë në fillim të verës dhe thahet plotësisht deri në gusht ose shtator, duke u bërë livadh.",
            "Ecësit raportojnë se Oko Skakavice mund të jetë i thatë në tetor dhe nëntor.",
          ],
          cnr: [
            "Ropojansko jezero obično ima vode početkom ljeta, a do avgusta ili septembra potpuno presuši i postane livada.",
            "Planinari navode da Oko Skakavice u oktobru i novembru može biti suvo.",
          ],
        },
        sources: ["wiki-lake-ropojana", "locwiki-vusanje-valbona"],
        status: "source-checked",
      },
      {
        heading: { en: "What to pack", sq: "Çfarë të merrni", cnr: "Šta ponijeti" },
        body: {
          en: [
            "Mountain weather changes quickly at any time of year: bring warm layers and a waterproof jacket, sturdy shoes for paths, sun protection and water.",
            "Some local businesses report that they take cash only, so carry enough euros.",
          ],
          sq: [
            "Moti në mal ndryshon shpejt në çdo stinë: merrni rroba të ngrohta në shtresa dhe xhaketë kundër shiut, këpucë të forta për shtigje, mbrojtje nga dielli dhe ujë.",
            "Disa biznese vendore raportojnë se pranojnë vetëm para në dorë, prandaj mbani mjaftueshëm euro.",
          ],
          cnr: [
            "Vrijeme u planini se brzo mijenja u svako doba godine: ponesite toplu slojevitu odjeću i vodootpornu jaknu, čvrstu obuću za staze, zaštitu od sunca i vodu.",
            "Neki lokalni objekti navode da primaju samo gotovinu, pa ponesite dovoljno eura.",
          ],
        },
        sources: ["rosi-website"],
        status: "needs-local-review",
      },
    ],
    owner: "Editorial team",
    updated: UPDATED,
    verification: v(["np-plan-2026", "wiki-lake-ropojana", "locwiki-vusanje-valbona"]),
    translations: DRAFTS,
  },
  {
    slug: "food-culture-respect",
    kind: "guide",
    topic: "food-culture",
    title: { en: "Food, culture and respectful visits", sq: "Ushqimi, kultura dhe vizitat me respekt", cnr: "Hrana, kultura i posjete s poštovanjem" },
    summary: {
      en: "A town where a mosque and two churches share one street, two languages for every place name, and how to visit with respect.",
      sq: "Një qytet ku një xhami dhe dy kisha ndajnë një rrugë, dy gjuhë për çdo emër vendi, dhe si të vizitoni me respekt.",
      cnr: "Grad u kojem džamija i dvije crkve dijele jednu ulicu, dva jezika za svaki naziv mjesta i kako posjetiti s poštovanjem.",
    },
    sections: [
      {
        heading: { en: "One street, three faiths", sq: "Një rrugë, tri besime", cnr: "Jedna ulica, tri vjere" },
        body: {
          en: ["In Gusinje the Vizier's Mosque, the Orthodox Church of St. Đorđe and the Catholic Church of St. Anton stand on the same street."],
          sq: ["Në Guci, Xhamia e Vezirit, Kisha Ortodokse e Shën Gjergjit dhe Kisha Katolike e Shën Ndout ndodhen në të njëjtën rrugë."],
          cnr: ["U Gusinju se Vezirova džamija, pravoslavna crkva Svetog Đorđa i katolička crkva Svetog Antona nalaze u istoj ulici."],
        },
        sources: ["mne-travel-mountain-towns"],
        status: "source-checked",
      },
      {
        heading: { en: "Two names for most places", sq: "Dy emra për shumicën e vendeve", cnr: "Dva naziva za većinu mjesta" },
        body: {
          en: ["Many places have an Albanian and a Montenegrin name — Vusanje is Vuthaj, Gusinje is Gucia, Zla Kolata is Kollata e Keqe. This guide shows both, so you can recognise them on signs and maps."],
          sq: ["Shumë vende kanë emër shqip dhe malazisht — Vuthaj është Vusanje, Gucia është Gusinje, Kollata e Keqe është Zla Kolata. Ky udhëzues i tregon të dyja, që t'i njihni në tabela dhe harta."],
          cnr: ["Mnoga mjesta imaju albanski i crnogorski naziv — Vusanje je Vuthaj, Gusinje je Gucia, Zla Kolata je Kollata e Keqe. Ovaj vodič prikazuje oba, da biste ih prepoznali na tablama i kartama."],
        },
        sources: ["wiki-gusinje", "wiki-vusanje", "wiki-zla-kolata"],
        status: "source-checked",
      },
      {
        heading: { en: "Visiting with respect", sq: "Vizita me respekt", cnr: "Posjeta s poštovanjem" },
        body: {
          en: [
            "Visit places of worship outside prayer and service times, dress modestly and ask before photographing people.",
            "Meadows and katuns are working farmland: close gates behind you, keep dogs on a lead near livestock and ask before entering private land.",
          ],
          sq: [
            "Vizitoni vendet e kultit jashtë kohës së lutjes dhe shërbesave, vishuni në mënyrë të përshtatshme dhe kërkoni leje para se të fotografoni njerëz.",
            "Livadhet dhe katunet janë toka bujqësore aktive: mbyllni portat pas vetes, mbani qentë me zinxhir pranë bagëtisë dhe kërkoni leje para se të hyni në pronë private.",
          ],
          cnr: [
            "Bogomolje posjećujte van vremena molitve i službi, obucite se pristojno i pitajte prije nego što fotografišete ljude.",
            "Livade i katuni su aktivno poljoprivredno zemljište: zatvarajte kapije za sobom, držite pse na povocu blizu stoke i pitajte prije ulaska na privatni posjed.",
          ],
        },
        sources: [],
        status: "needs-local-review",
      },
      {
        heading: { en: "Food", sq: "Ushqimi", cnr: "Hrana" },
        body: {
          en: ["See Eat & Drink for listings. Each listing shows what the business itself says about its food and dietary options."],
          sq: ["Shihni Ushqim e pije për listimet. Çdo listim tregon çfarë thotë vetë biznesi për ushqimin dhe opsionet dietike."],
          cnr: ["Oglase potražite u rubrici Hrana i piće. Svaki oglas prikazuje šta sam objekat navodi o hrani i posebnim režimima ishrane."],
        },
        sources: [],
        status: "source-checked",
      },
    ],
    owner: "Editorial team (culture)",
    updated: UPDATED,
    verification: v(["mne-travel-mountain-towns", "wiki-gusinje", "wiki-vusanje"], "Visiting customs to be confirmed with local religious communities."),
    translations: DRAFTS,
  },
  {
    slug: "families-and-accessibility",
    kind: "guide",
    topic: "families-access",
    title: { en: "Families and accessibility", sq: "Familjet dhe aksesueshmëria", cnr: "Porodice i pristupačnost" },
    summary: {
      en: "Easy outings, the activities that are not for children, and what we know — and don't yet know — about step-free access.",
      sq: "Dalje të lehta, aktivitetet që nuk janë për fëmijë dhe çfarë dimë — e çfarë nuk dimë ende — për qasjen pa shkallë.",
      cnr: "Lagani izleti, aktivnosti koje nijesu za djecu i šta znamo — a šta još ne znamo — o pristupu bez stepenica.",
    },
    sections: [
      {
        heading: { en: "Easy outings", sq: "Dalje të lehta", cnr: "Lagani izleti" },
        body: {
          en: [
            "Ali Pasha's Springs are about five minutes by car, or an easy 25-minute walk, south of Gusinje.",
            "The Grlja waterfall can be seen a short walk from a parking area on the edge of Vusanje. Rock edges near the fall can be wet — keep children close.",
          ],
          sq: [
            "Burimet e Ali Pashës janë rreth pesë minuta me makinë, ose një shëtitje e lehtë 25-minutëshe, në jug të Gucisë.",
            "Ujëvara e Grlës mund të shihet në pak hapa nga një parking në skaj të Vuthajve. Buzët e shkëmbinjve pranë ujëvarës mund të jenë të lagura — mbajini fëmijët pranë.",
          ],
          cnr: [
            "Alipašini izvori su oko pet minuta kolima, ili laka šetnja od 25 minuta, južno od Gusinja.",
            "Vodopad Grlja može se vidjeti nekoliko koraka od parkinga na rubu Vusanja. Ivice stijena kod vodopada mogu biti mokre — djecu držite uz sebe.",
          ],
        },
        sources: ["lonelyplanet-alipasa", "komoot-grlja-loop"],
        status: "source-checked",
      },
      {
        heading: { en: "Not for families", sq: "Jo për familje", cnr: "Nije za porodice" },
        body: {
          en: ["Entering the Grlja canyon “requires adequate equipment, remarkable preparation, and experience”. Summits such as Zla Kolata are long, demanding mountain days. Neither is a family walk."],
          sq: ["Hyrja në kanionin e Grlës “kërkon pajisje të përshtatshme, përgatitje të jashtëzakonshme dhe përvojë”. Majat si Kollata e Keqe janë ditë të gjata dhe të vështira mali. Asnjëra nuk është shëtitje familjare."],
          cnr: ["Ulazak u kanjon Grlje „zahtijeva adekvatnu opremu, izuzetnu pripremu i iskustvo”. Vrhovi poput Zle Kolate su dugi i zahtjevni planinski dani. Ništa od toga nije porodična šetnja."],
        },
        sources: ["mne-travel-grlja-canyon", "summitpost-zla-kolata-route"],
        status: "source-checked",
      },
      {
        heading: { en: "Accessibility: what we know", sq: "Aksesueshmëria: çfarë dimë", cnr: "Pristupačnost: šta znamo" },
        body: {
          en: [
            "We have not yet checked step-free access, toilets or parking for disabled visitors at any place. Where a business tells us about a limitation — for example, upper floors reachable by stairs only — we show it on its listing.",
            "Please ask places directly before you travel, and tell us what you find so we can add it.",
          ],
          sq: [
            "Ende nuk kemi kontrolluar qasjen pa shkallë, tualetet apo parkimin për vizitorët me aftësi të kufizuara në asnjë vend. Kur një biznes na tregon për një kufizim — për shembull, katet e sipërme të arritshme vetëm me shkallë — e tregojmë në listimin e tij.",
            "Ju lutemi pyesni drejtpërdrejt vendet para udhëtimit dhe na tregoni çfarë gjeni, që ta shtojmë.",
          ],
          cnr: [
            "Još nijesmo provjerili pristup bez stepenica, toalete ni parking za osobe s invaliditetom ni na jednom mjestu. Kada nam objekat javi neko ograničenje — na primjer, gornji spratovi dostupni samo stepenicama — prikazujemo ga u njegovom oglasu.",
            "Molimo vas da se prije puta direktno raspitate i javite nam šta ste saznali, da to dodamo.",
          ],
        },
        sources: [],
        status: "source-checked",
      },
    ],
    owner: "Editorial team (accessibility)",
    updated: UPDATED,
    verification: v(["lonelyplanet-alipasa", "komoot-grlja-loop", "mne-travel-grlja-canyon"]),
    translations: DRAFTS,
  },
  {
    slug: "guides-and-outdoor-preparation",
    kind: "guide",
    topic: "outdoors",
    title: { en: "Guided experiences and outdoor preparation", sq: "Përvoja me udhërrëfyes dhe përgatitja për natyrën", cnr: "Iskustva s vodičem i priprema za prirodu" },
    summary: {
      en: "Routes the national park offers with licensed guides, the state of trail markings, and how to read the route pages on this site.",
      sq: "Itineraret që parku kombëtar ofron me udhërrëfyes të licencuar, gjendja e shenjave të shtigjeve dhe si të lexoni faqet e itinerareve në këtë faqe.",
      cnr: "Ture koje nacionalni park nudi s licenciranim vodičima, stanje markacija i kako čitati stranice ruta na ovom sajtu.",
    },
    sections: [
      {
        heading: { en: "Licensed guides in the national park", sq: "Udhërrëfyes të licencuar në parkun kombëtar", cnr: "Licencirani vodiči u nacionalnom parku" },
        body: {
          en: [
            "The national park has announced routes with licensed tourist guides, including Grbaja valley – Katun Valušnice – Maja Popadija – Talijanka; Vusanje – Ropojana – Lake Ropojana; and Grebaje – Sedlo Brade – Maja Podgojs – Vezirova Brada. Contact the park for current dates and bookings.",
            "This guide does not yet list independent mountain guides: we only add guides whose licences we have checked.",
          ],
          sq: [
            "Parku kombëtar ka njoftuar itinerare me udhërrëfyes turistikë të licencuar, përfshirë luginën e Gërbajës – Katunin e Valushnicës – Majën Popadija – Talijankën; Vuthaj – Ropojanë – Liqeni i Ropojanës; dhe Gërbajë – Sedlo Brade – Maja Podgojs – Vezirova Brada. Kontaktoni parkun për datat dhe rezervimet aktuale.",
            "Ky udhëzues nuk rendit ende udhërrëfyes malorë të pavarur: shtojmë vetëm udhërrëfyes licencat e të cilëve i kemi kontrolluar.",
          ],
          cnr: [
            "Nacionalni park je najavio ture s licenciranim turističkim vodičima, među kojima dolina Grbaja – Katun Valušnice – Maja Popadija – Talijanka; Vusanje – Ropojana – Ropojansko jezero; i Grebaje – Sedlo Brade – Maja Podgojs – Vezirova Brada. Za aktuelne termine i rezervacije obratite se parku.",
            "Ovaj vodič još ne navodi nezavisne planinske vodiče: dodajemo samo vodiče čije smo licence provjerili.",
          ],
        },
        sources: ["np-guided-routes"],
        status: "source-checked",
      },
      {
        heading: { en: "Trails and markings", sq: "Shtigjet dhe shenjat", cnr: "Staze i markacije" },
        body: {
          en: ["The park's management plan counts 13 maintained hiking trails totalling about 200 km, and notes that most trail markings need renewing. Don't rely on markings alone — carry a map and ask locally."],
          sq: ["Plani i menaxhimit të parkut numëron 13 shtigje ecjeje të mirëmbajtura me gjithsej rreth 200 km dhe vëren se shumica e shenjave duhet të rinovohen. Mos u mbështetni vetëm te shenjat — mbani hartë dhe pyesni në vend."],
          cnr: ["Plan upravljanja parkom navodi 13 uređenih planinarsko-pješačkih staza ukupne dužine oko 200 km i ističe da većinu markacija treba obnoviti. Ne oslanjajte se samo na markacije — nosite kartu i raspitajte se na licu mjesta."],
        },
        sources: ["np-prokletije-plan"],
        status: "source-checked",
      },
      {
        heading: { en: "Before you set off", sq: "Para se të nisni", cnr: "Prije polaska" },
        body: {
          en: [
            "Tell someone your route and when you expect to be back, start early, and check the weather and conditions locally on the day.",
            "Download maps for offline use: visitors report that mobile signal in the valleys is unreliable.",
          ],
          sq: [
            "Tregojini dikujt itinerarin dhe kur prisni të ktheheni, nisuni herët dhe kontrolloni motin e kushtet në vend në atë ditë.",
            "Shkarkoni hartat për përdorim pa internet: vizitorët raportojnë se sinjali celular në lugina është i pasigurt.",
          ],
          cnr: [
            "Recite nekome svoju rutu i kada očekujete povratak, krenite rano i istog dana provjerite vrijeme i uslove na licu mjesta.",
            "Preuzmite karte za korišćenje bez interneta: posjetioci navode da je mobilni signal u dolinama nepouzdan.",
          ],
        },
        sources: [],
        status: "needs-local-review",
      },
      {
        heading: { en: "How to read our route pages", sq: "Si të lexoni faqet tona të itinerareve", cnr: "Kako čitati naše stranice ruta" },
        body: {
          en: [
            "Every figure on a route page is shown with the source that published it, and where sources disagree we give the range. No route has yet been walked or checked for this guide, so all are marked “awaiting verification” and must not be used to navigate.",
            "There are no GPS tracks on this site. The tours on the 3D map tell stories; they are not routes.",
          ],
          sq: [
            "Çdo shifër në një faqe itinerari shfaqet me burimin që e ka publikuar, dhe kur burimet nuk pajtohen japim intervalin. Asnjë itinerar nuk është ecur apo kontrolluar ende për këtë udhëzues, prandaj të gjitha janë shënuar “në pritje të verifikimit” dhe nuk duhen përdorur për orientim.",
            "Në këtë faqe nuk ka gjurmë GPS. Turet në hartën 3D tregojnë histori; nuk janë itinerare.",
          ],
          cnr: [
            "Svaki podatak na stranici rute prikazan je uz izvor koji ga je objavio, a kada se izvori ne slažu navodimo raspon. Nijedna ruta još nije prehodana niti provjerena za ovaj vodič, pa su sve označene kao „čeka provjeru” i ne smiju se koristiti za orijentaciju.",
            "Na ovom sajtu nema GPS tragova. Ture na 3D karti pričaju priče; nijesu rute.",
          ],
        },
        sources: [],
        status: "source-checked",
      },
    ],
    owner: "Editorial team (outdoor safety)",
    updated: UPDATED,
    verification: v(["np-guided-routes", "np-prokletije-plan"]),
    translations: DRAFTS,
  },
  {
    slug: "money-connectivity-services",
    kind: "guide",
    topic: "practical",
    title: { en: "Money, connectivity and visitor services", sq: "Paratë, lidhja dhe shërbimet për vizitorët", cnr: "Novac, veza i usluge za posjetioce" },
    summary: {
      en: "The currency, cash, phone signal in the valleys, and where to find official visitor information.",
      sq: "Monedha, paratë në dorë, sinjali i telefonit në lugina dhe ku të gjeni informacion zyrtar për vizitorët.",
      cnr: "Valuta, gotovina, signal u dolinama i gdje naći zvanične informacije za posjetioce.",
    },
    sections: [
      {
        heading: { en: "Money", sq: "Paratë", cnr: "Novac" },
        body: {
          en: [
            "Montenegro uses the euro.",
            "Some local businesses report that they take cash only. We have not verified cash machines in Gusinje, so bring enough cash for your stay.",
          ],
          sq: [
            "Mali i Zi përdor euron.",
            "Disa biznese vendore raportojnë se pranojnë vetëm para në dorë. Nuk kemi verifikuar bankomatet në Guci, prandaj merrni mjaftueshëm para për qëndrimin tuaj.",
          ],
          cnr: [
            "Crna Gora koristi euro.",
            "Neki lokalni objekti navode da primaju samo gotovinu. Bankomate u Gusinju nijesmo provjerili, pa ponesite dovoljno gotovine za boravak.",
          ],
        },
        sources: ["cbcg-euro", "wiki-euro"],
        status: "source-checked",
      },
      {
        heading: { en: "Phone signal and internet", sq: "Sinjali i telefonit dhe interneti", cnr: "Signal i internet" },
        body: {
          en: ["We found no official coverage map. Visitors report that mobile signal is unreliable in the valleys, including Grbaja. Download maps and this guide's pages before heading out."],
          sq: ["Nuk gjetëm hartë zyrtare të mbulimit. Vizitorët raportojnë se sinjali celular është i pasigurt në lugina, përfshirë Gërbajën. Shkarkoni hartat dhe faqet e këtij udhëzuesi para se të nisni."],
          cnr: ["Nijesmo pronašli zvaničnu kartu pokrivenosti. Posjetioci navode da je mobilni signal nepouzdan u dolinama, uključujući Grbaju. Preuzmite karte i stranice ovog vodiča prije polaska."],
        },
        sources: [],
        status: "needs-local-review",
      },
      {
        heading: { en: "Official visitor information", sq: "Informacion zyrtar për vizitorët", cnr: "Zvanične informacije za posjetioce" },
        body: {
          en: ["The Gusinje Tourism Organisation publishes visitor information, events and lists of accommodation and restaurants. National park information, rules and tickets are on the website of National Parks of Montenegro."],
          sq: ["Organizata Turistike e Gucisë publikon informacion për vizitorët, ngjarje dhe lista akomodimi e restorantesh. Informacioni, rregullat dhe biletat e parkut kombëtar gjenden në faqen e Parqeve Kombëtare të Malit të Zi."],
          cnr: ["Turistička organizacija Gusinje objavljuje informacije za posjetioce, događaje i spiskove smještaja i restorana. Informacije, pravila i ulaznice za nacionalni park nalaze se na sajtu Nacionalnih parkova Crne Gore."],
        },
        sources: ["gusinje-to", "togusinje-contact", "np-montenegro"],
        status: "source-checked",
      },
    ],
    owner: "Editorial team",
    updated: UPDATED,
    verification: v(["cbcg-euro", "gusinje-to", "np-montenegro"]),
    translations: DRAFTS,
  },
  {
    slug: "responsible-travel",
    kind: "guide",
    topic: "responsible",
    title: { en: "Responsible travel and park rules", sq: "Udhëtim i përgjegjshëm dhe rregullat e parkut", cnr: "Odgovorno putovanje i pravila parka" },
    summary: {
      en: "Fires, camping, drones and waste in Prokletije National Park — what the law and the park say, and how to leave no trace.",
      sq: "Zjarri, kampingu, dronët dhe mbeturinat në Parkun Kombëtar të Bjeshkëve të Nemuna — çfarë thonë ligji dhe parku, dhe si të mos lini gjurmë.",
      cnr: "Vatra, kampovanje, dronovi i otpad u Nacionalnom parku Prokletije — šta kažu zakon i park i kako ne ostaviti trag.",
    },
    sections: [
      {
        heading: { en: "Fires and camping", sq: "Zjarri dhe kampingu", cnr: "Vatra i kampovanje" },
        body: {
          en: ["Montenegro's Law on National Parks prohibits lighting fires outside places designated for them, and camping outside designated camping places without paying the fee."],
          sq: ["Ligji për Parqet Kombëtare i Malit të Zi ndalon ndezjen e zjarrit jashtë vendeve të caktuara për këtë qëllim dhe kampingun jashtë vendeve të caktuara pa paguar tarifën."],
          cnr: ["Zakon o nacionalnim parkovima Crne Gore zabranjuje loženje vatre van mjesta određenih za tu namjenu i kampovanje van mjesta predviđenog za kampovanje i bez plaćene naknade."],
        },
        sources: ["mne-law-national-parks"],
        status: "source-checked",
      },
      {
        heading: { en: "Drones and filming", sq: "Dronët dhe xhirimet", cnr: "Dronovi i snimanje" },
        body: {
          en: [
            "Commercial filming with a drone in the parks needs consent from the Civil Aviation Agency and the Environmental Protection Agency, plus the park's approval, requested at least 20 days ahead.",
            "A park announcement is titled “Quads, motocross bikes and drones may not enter national parks”. Check the park's rules before flying anything.",
          ],
          sq: [
            "Xhirimi komercial me dron në parqe kërkon pëlqimin e Agjencisë së Aviacionit Civil dhe të Agjencisë për Mbrojtjen e Mjedisit, si dhe miratimin e parkut, të kërkuar të paktën 20 ditë përpara.",
            "Një njoftim i parkut titullohet “Kuadët, motorët kros dhe dronët nuk mund të hyjnë në parqet kombëtare”. Kontrolloni rregullat e parkut para se të fluturoni çfarëdo.",
          ],
          cnr: [
            "Komercijalno snimanje dronom u parkovima zahtijeva saglasnost Agencije za civilno vazduhoplovstvo i Agencije za zaštitu životne sredine, kao i odobrenje parka, zatraženo najmanje 20 dana unaprijed.",
            "Jedno saopštenje parka nosi naslov „Kvadovi, kros motori i dronovi ne mogu u nacionalne parkove”. Provjerite pravila parka prije bilo kakvog letenja.",
          ],
        },
        sources: ["np-filming-rules", "np-drones-news"],
        status: "source-checked",
      },
      {
        heading: { en: "Waste and leaving no trace", sq: "Mbeturinat dhe të mos lini gjurmë", cnr: "Otpad i ne ostavljati trag" },
        body: {
          en: [
            "The park's management plan names illegal dumping as a problem. Take all your rubbish back with you, use toilets where they exist, and keep to paths.",
            "Leave flowers, stones and wildlife where you find them.",
          ],
          sq: [
            "Plani i menaxhimit të parkut e përmend hedhjen e paligjshme të mbeturinave si problem. Merrni të gjitha mbeturinat me vete, përdorni tualetet ku ka dhe qëndroni në shtigje.",
            "Lini lulet, gurët dhe kafshët e egra aty ku i gjeni.",
          ],
          cnr: [
            "Plan upravljanja parkom navodi nelegalno odlaganje otpada kao problem. Odnesite sav otpad sa sobom, koristite toalete gdje postoje i držite se staza.",
            "Ostavite cvijeće, kamenje i divlje životinje tamo gdje ste ih zatekli.",
          ],
        },
        sources: ["np-prokletije-plan"],
        status: "needs-local-review",
      },
    ],
    owner: "Editorial team",
    updated: UPDATED,
    verification: v(["mne-law-national-parks", "np-filming-rules", "np-drones-news", "np-prokletije-plan"]),
    translations: DRAFTS,
  },
  {
    slug: "safety-and-emergencies",
    kind: "guide",
    topic: "outdoors",
    title: { en: "Safety and emergencies", sq: "Siguria dhe emergjencat", cnr: "Bezbjednost i hitni slučajevi" },
    summary: {
      en: "Emergency numbers, mountain rescue, and crossing the border on foot.",
      sq: "Numrat e emergjencës, shpëtimi malor dhe kalimi i kufirit në këmbë.",
      cnr: "Brojevi za hitne slučajeve, gorska služba spašavanja i prelazak granice pješice.",
    },
    sections: [
      {
        heading: { en: "Emergency numbers in Montenegro", sq: "Numrat e emergjencës në Mal të Zi", cnr: "Brojevi za hitne slučajeve u Crnoj Gori" },
        body: {
          en: ["112 — emergency · 122 — police · 123 — fire brigade · 124 — ambulance."],
          sq: ["112 — emergjenca · 122 — policia · 123 — zjarrfikësit · 124 — ndihma e shpejtë."],
          cnr: ["112 — hitne službe · 122 — policija · 123 — vatrogasci · 124 — hitna pomoć."],
        },
        sources: ["wiki-phone-numbers", "canada-travel-mne"],
        status: "source-checked",
      },
      {
        heading: { en: "Mountain rescue", sq: "Shpëtimi malor", cnr: "Gorska služba spašavanja" },
        body: {
          en: ["The Mountain Rescue Service of Montenegro (GSS) directs callers to 112. We do not list other numbers until they are confirmed by the service."],
          sq: ["Shërbimi i Shpëtimit Malor të Malit të Zi (GSS) i drejton thirrjet në 112. Nuk rendisim numra të tjerë derisa t'i konfirmojë shërbimi."],
          cnr: ["Gorska služba spašavanja Crne Gore (GSS) upućuje pozivaoce na 112. Druge brojeve ne navodimo dok ih služba ne potvrdi."],
        },
        sources: ["gss-cg"],
        status: "source-checked",
      },
      {
        heading: { en: "Crossing the border on foot", sq: "Kalimi i kufirit në këmbë", cnr: "Prelazak granice pješice" },
        body: {
          en: ["Hiking across the border into Albania needs permission requested in advance from the police of the country you are leaving — at least 15 days ahead, according to the Peaks of the Balkans procedures. Check the current rules before you go."],
          sq: ["Ecja përtej kufirit në Shqipëri kërkon leje të kërkuar paraprakisht nga policia e vendit nga largoheni — të paktën 15 ditë përpara, sipas procedurave të Majave të Ballkanit. Kontrolloni rregullat aktuale para se të shkoni."],
          cnr: ["Pješačenje preko granice u Albaniju zahtijeva dozvolu unaprijed traženu od policije države iz koje izlazite — najmanje 15 dana ranije, prema procedurama Vrhova Balkana. Provjerite aktuelna pravila prije polaska."],
        },
        sources: ["pob-cross-border", "mne-travel-entry"],
        status: "source-checked",
      },
    ],
    owner: "Editorial team (outdoor safety)",
    updated: UPDATED,
    verification: v(["wiki-phone-numbers", "canada-travel-mne", "gss-cg", "pob-cross-border"], "Numbers to be re-confirmed with official Montenegrin sources before launch."),
    translations: DRAFTS,
  },
];
