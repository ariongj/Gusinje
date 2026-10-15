/**
 * Long-form page text: About the Region, About this guide, and the proposal
 * for tourism partners. Facts cite sources (ids in ./sources.ts). The partner
 * section is a proposal only — nothing in it is agreed, approved or endorsed.
 */

import type { Localized } from "./types";

export type ProseSection = { heading: Localized; body: Localized<string[]>; sources?: string[] };

export const aboutRegion: { lead: Localized; sections: ProseSection[] } = {
  lead: {
    en: "Gusinje and Vusanje lie in north-eastern Montenegro, close to the border with Albania, where green valleys run up into the limestone walls of the Prokletije.",
    sq: "Gucia dhe Vuthaj ndodhen në verilindje të Malit të Zi, pranë kufirit me Shqipërinë, ku lugina të gjelbra ngjiten drejt mureve gëlqerore të Bjeshkëve të Nemuna.",
    cnr: "Gusinje i Vusanje leže na sjeveroistoku Crne Gore, blizu granice s Albanijom, gdje se zelene doline penju ka krečnjačkim zidovima Prokletija.",
  },
  sections: [
    {
      heading: { en: "The valleys", sq: "Luginat", cnr: "Doline" },
      body: {
        en: [
          "From Gusinje a road runs south to the village of Vusanje, about 4.5 km away, where the Grlja waterfall and the Oko Skakavice spring lie close together. Beyond Vusanje, the Ropojana valley continues to the Albanian border and a seasonal lake.",
          "West of Gusinje, the Grbaja valley lies about 7 km away under the jagged Karanfili massif. Montenegro's highest summit, Zla Kolata, stands on the border about 10 km south of Gusinje.",
        ],
        sq: [
          "Nga Gucia një rrugë shkon në jug drejt fshatit Vuthaj, rreth 4,5 km larg, ku ujëvara e Grlës dhe burimi Oko Skakavice ndodhen pranë njëri-tjetrit. Përtej Vuthajve, lugina e Ropojanës vazhdon deri te kufiri me Shqipërinë dhe një liqen sezonal.",
          "Në perëndim të Gucisë, lugina e Gërbajës ndodhet rreth 7 km larg nën masivin e dhëmbëzuar të Karanfilit. Maja më e lartë e Malit të Zi, Kollata e Keqe, ngrihet në kufi rreth 10 km në jug të Gucisë.",
        ],
        cnr: [
          "Iz Gusinja put vodi na jug do sela Vusanje, oko 4,5 km daleko, gdje su vodopad Grlja i izvor Oko Skakavice blizu jedno drugom. Iza Vusanja dolina Ropojane nastavlja se do granice s Albanijom i sezonskog jezera.",
          "Zapadno od Gusinja, oko 7 km daleko, leži dolina Grbaja ispod nazubljenog masiva Karanfila. Najviši vrh Crne Gore, Zla Kolata, nalazi se na granici oko 10 km južno od Gusinja.",
        ],
      },
      sources: ["mapcarta-gusinje", "summitpost-karanfili", "wiki-gusinje-municipality", "wiki-ropojana"],
    },
    {
      heading: { en: "Prokletije National Park", sq: "Parku Kombëtar i Bjeshkëve të Nemuna", cnr: "Nacionalni park Prokletije" },
      body: {
        en: [
          "Prokletije National Park was established by Montenegro's 2009 Law on National Parks. Its management plan gives an area of 16,630 hectares, in IUCN category II, and the park is managed by the public enterprise National Parks of Montenegro.",
          "The park records most visitors from June to October. Its management plan counts 13 maintained hiking trails of about 200 km in total, and notes that most markings need renewing.",
        ],
        sq: [
          "Parku Kombëtar i Bjeshkëve të Nemuna u themelua me Ligjin për Parqet Kombëtare të Malit të Zi të vitit 2009. Plani i menaxhimit jep një sipërfaqe prej 16.630 hektarësh, në kategorinë II të IUCN, dhe parku administrohet nga ndërmarrja publike Parqet Kombëtare të Malit të Zi.",
          "Parku regjistron më shumë vizitorë nga qershori deri në tetor. Plani i menaxhimit numëron 13 shtigje ecjeje të mirëmbajtura me gjithsej rreth 200 km dhe vëren se shumica e shenjave duhet të rinovohen.",
        ],
        cnr: [
          "Nacionalni park Prokletije osnovan je Zakonom o nacionalnim parkovima Crne Gore iz 2009. Plan upravljanja navodi površinu od 16.630 hektara, u kategoriji II IUCN-a, a parkom upravlja JP Nacionalni parkovi Crne Gore.",
          "Park bilježi najveću posjećenost od juna do oktobra. Plan upravljanja navodi 13 uređenih planinarsko-pješačkih staza ukupne dužine oko 200 km i ističe da većinu markacija treba obnoviti.",
        ],
      },
      sources: ["np-prokletije-plan", "np-plan-2026", "np-montenegro"],
    },
    {
      heading: { en: "Two languages, many names", sq: "Dy gjuhë, shumë emra", cnr: "Dva jezika, mnogo naziva" },
      body: {
        en: [
          "Albanian and Montenegrin are both spoken here, and most places have two names: Gusinje is Gucia, Vusanje is Vuthaj, Zla Kolata is Kollata e Keqe. This guide shows both, with correct spelling, so you can recognise places on signs and maps.",
        ],
        sq: [
          "Këtu flitet edhe shqip edhe malazisht, dhe shumica e vendeve kanë dy emra: Gucia është Gusinje, Vuthaj është Vusanje, Kollata e Keqe është Zla Kolata. Ky udhëzues i tregon të dyja, me drejtshkrim të saktë, që t'i njihni vendet në tabela dhe harta.",
        ],
        cnr: [
          "Ovdje se govore i albanski i crnogorski, a većina mjesta ima dva naziva: Gusinje je Gucia, Vusanje je Vuthaj, Zla Kolata je Kollata e Keqe. Ovaj vodič prikazuje oba, s pravilnim pisanjem, da biste mjesta prepoznali na tablama i kartama.",
        ],
      },
      sources: ["wiki-gusinje", "wiki-vusanje", "wiki-zla-kolata"],
    },
    {
      heading: { en: "One street, three faiths", sq: "Një rrugë, tri besime", cnr: "Jedna ulica, tri vjere" },
      body: {
        en: [
          "In the centre of Gusinje the Vizier's Mosque, the Orthodox Church of St. Đorđe and the Catholic Church of St. Anton stand on the same street. The Vizier's Mosque is described as the oldest preserved mosque in the town.",
        ],
        sq: [
          "Në qendër të Gucisë, Xhamia e Vezirit, Kisha Ortodokse e Shën Gjergjit dhe Kisha Katolike e Shën Ndout ndodhen në të njëjtën rrugë. Xhamia e Vezirit përshkruhet si xhamia më e vjetër e ruajtur në qytet.",
        ],
        cnr: [
          "U centru Gusinja Vezirova džamija, pravoslavna crkva Svetog Đorđa i katolička crkva Svetog Antona nalaze se u istoj ulici. Vezirova džamija opisuje se kao najstarija sačuvana džamija u gradu.",
        ],
      },
      sources: ["mne-travel-mountain-towns", "recultivatur-mosque"],
    },
  ],
};

export const aboutPlatform: { lead: Localized; sections: ProseSection[] } = {
  lead: {
    en: "An independent visitor guide to Gusinje, Vusanje and the Prokletije, created and hosted by ROSI. It is not an official tourism website and is not endorsed by any tourism organisation or public body.",
    sq: "Një udhëzues i pavarur për vizitorët e Gucisë, Vuthajve dhe Bjeshkëve të Nemuna, i krijuar dhe i mbajtur nga ROSI. Nuk është faqe zyrtare turistike dhe nuk është i miratuar nga asnjë organizatë turistike apo institucion publik.",
    cnr: "Nezavisni vodič za posjetioce Gusinja, Vusanja i Prokletija, koji je napravio i održava ROSI. Nije zvanični turistički sajt i ne podržava ga nijedna turistička organizacija niti javna institucija.",
  },
  sections: [
    {
      heading: { en: "Who runs it", sq: "Kush e drejton", cnr: "Ko ga vodi" },
      body: {
        en: [
          "ROSI is a family business in the valley: Hotel ROSI in Gusinje and Eko Katun ROSI near Vusanje. Both appear in the directory like any other listing, marked as belonging to the host of this guide, and ordered A–Z with the rest. ROSI's own accommodation website is separate.",
        ],
        sq: [
          "ROSI është një biznes familjar në luginë: Hotel ROSI në Guci dhe Eko Katun ROSI pranë Vuthajve. Të dyja shfaqen në drejtori si çdo listim tjetër, të shënuara si pronë e mbajtësit të këtij udhëzuesi, dhe të renditura sipas alfabetit bashkë me të tjerat. Faqja e akomodimit të ROSI-t është e veçantë.",
        ],
        cnr: [
          "ROSI je porodični biznis u dolini: hotel ROSI u Gusinju i Eko Katun ROSI kod Vusanja. Oba se pojavljuju u imeniku kao i svaki drugi oglas, označena kao objekti vlasnika ovog vodiča, i poređana abecedno s ostalima. ROSI-jev sajt za smještaj je odvojen.",
        ],
      },
    },
    {
      heading: { en: "How information is checked", sq: "Si kontrollohet informacioni", cnr: "Kako se provjeravaju informacije" },
      body: {
        en: [
          "Every place, listing, walk and guide shows how it is known: checked on site, checked against published sources, supplied by the business, or not yet verified — with the date of the last check, who keeps it current, and its sources.",
          "Practical facts such as fees, opening times, distances and prices appear only when a source confirms them. Missing facts are shown as missing, never guessed. Where sources disagree, the page says so.",
          "For this first release, the desk checks were made from published sources in October 2026. None of the places has yet been checked on the ground for this guide.",
        ],
        sq: [
          "Çdo vend, listim, shteg dhe udhëzues tregon si dihet: i kontrolluar në vend, i kontrolluar me burime të publikuara, i dhënë nga biznesi, ose ende i paverifikuar — me datën e kontrollit të fundit, kush e mban të përditësuar dhe burimet e tij.",
          "Faktet praktike si tarifat, oraret, distancat dhe çmimet shfaqen vetëm kur një burim i konfirmon. Faktet që mungojnë tregohen si të munguara, kurrë të hamendësuara. Kur burimet nuk pajtohen, faqja e thotë.",
          "Për këtë botim të parë, kontrollet u bënë me burime të publikuara në tetor 2026. Asnjë nga vendet nuk është kontrolluar ende në terren për këtë udhëzues.",
        ],
        cnr: [
          "Svako mjesto, oglas, staza i vodič pokazuje kako se zna: provjereno na licu mjesta, provjereno u objavljenim izvorima, dostavljeno od strane objekta ili još neprovjereno — s datumom posljednje provjere, ko ga održava i izvorima.",
          "Praktične informacije kao što su ulaznice, radno vrijeme, udaljenosti i cijene prikazuju se samo kada ih izvor potvrdi. Ono što nedostaje prikazuje se kao nedostajuće, nikad nagađano. Kada se izvori ne slažu, stranica to navodi.",
          "Za ovo prvo izdanje provjere su rađene u objavljenim izvorima u oktobru 2026. Nijedno mjesto još nije provjereno na terenu za ovaj vodič.",
        ],
      },
    },
    {
      heading: { en: "Listings", sq: "Listimet", cnr: "Oglasi" },
      body: {
        en: [
          "The directory is just starting and does not yet list every business. Listings are ordered A–Z and nobody pays for position. There are no sponsored listings; if they are ever offered, they will be clearly labelled and kept separate from reviews.",
          "Each feature says whether it is self-reported by the business or independently checked. Businesses can submit a listing, claim an existing one after verification, or suggest corrections. Owners will be able to edit only their own listings and will never be able to change reviews.",
        ],
        sq: [
          "Drejtoria sapo ka nisur dhe nuk i rendit ende të gjitha bizneset. Listimet renditen sipas alfabetit dhe askush nuk paguan për pozicionin. Nuk ka listime të sponsorizuara; nëse ofrohen ndonjëherë, do të shënohen qartë dhe do të mbahen të ndara nga vlerësimet.",
          "Çdo veçori tregon nëse është vetëdeklaruar nga biznesi apo kontrolluar në mënyrë të pavarur. Bizneset mund të paraqesin një listim, të marrin në pronësi një ekzistues pas verifikimit, ose të sugjerojnë korrigjime. Pronarët do të mund të redaktojnë vetëm listimet e tyre dhe kurrë nuk do të mund të ndryshojnë vlerësimet.",
        ],
        cnr: [
          "Imenik je tek počeo i još ne navodi sve objekte. Oglasi su poređani abecedno i niko ne plaća za poziciju. Nema sponzorisanih oglasa; ako se ikada ponude, biće jasno označeni i odvojeni od recenzija.",
          "Za svaku stavku piše da li je navodi sam objekat ili je nezavisno provjerena. Objekti mogu prijaviti oglas, preuzeti postojeći nakon provjere ili predložiti ispravke. Vlasnici će moći da uređuju samo svoje oglase i nikada neće moći da mijenjaju recenzije.",
        ],
      },
    },
    {
      heading: { en: "Reviews and tips (not open yet)", sq: "Vlerësimet dhe këshillat (ende jo të hapura)", cnr: "Recenzije i savjeti (još nijesu otvoreni)" },
      body: {
        en: [
          "Reviews and community tips will open once an approved account and moderation service is connected. Until then, every page shows “No reviews yet” and the forms work only as a preview — nothing is sent or stored. No ratings are copied from other websites.",
          "When open: visitors sign in with a verified email address, can edit or delete their own contributions, and can report problems. Moderation removes spam, impersonation, private information and abuse, but not honest criticism. Businesses can reply publicly but cannot change reviews. Safety-related corrections are handled first.",
        ],
        sq: [
          "Vlerësimet dhe këshillat e komunitetit do të hapen sapo të lidhet një shërbim i miratuar llogarish dhe moderimi. Deri atëherë, çdo faqe tregon “Ende pa vlerësime” dhe formularët funksionojnë vetëm si parapamje — asgjë nuk dërgohet as ruhet. Asnjë vlerësim nuk kopjohet nga faqe të tjera.",
          "Kur të hapen: vizitorët hyjnë me një adresë email të verifikuar, mund të redaktojnë ose fshijnë kontributet e tyre dhe mund të raportojnë probleme. Moderimi heq spamin, imitimin, të dhënat private dhe abuzimin, por jo kritikën e ndershme. Bizneset mund të përgjigjen publikisht, por nuk mund t'i ndryshojnë vlerësimet. Korrigjimet që lidhen me sigurinë trajtohen të parat.",
        ],
        cnr: [
          "Recenzije i savjeti zajednice biće otvoreni kada se poveže odobreni servis za naloge i moderaciju. Do tada svaka stranica prikazuje „Još nema recenzija”, a obrasci rade samo kao pregled — ništa se ne šalje niti čuva. Nijedna ocjena nije preuzeta s drugih sajtova.",
          "Kada se otvore: posjetioci se prijavljuju potvrđenom email adresom, mogu da uređuju ili brišu svoje priloge i da prijave probleme. Moderacija uklanja spam, lažno predstavljanje, privatne podatke i uvrede, ali ne i iskrenu kritiku. Objekti mogu javno odgovoriti, ali ne mogu mijenjati recenzije. Ispravke vezane za bezbjednost rješavaju se prve.",
        ],
      },
    },
    {
      heading: { en: "Privacy", sq: "Privatësia", cnr: "Privatnost" },
      body: {
        en: [
          "This site sets no cookies and runs no analytics. My Trip is stored only in your browser; a shared trip link carries the trip itself, after the # sign, which browsers don't send to servers. Pages you open are also saved in your browser so they work without signal; clearing this site's data removes them. “Show where I am” on the map asks your browser for your position and draws it on your screen only; it is never sent or stored. The treasure hunt's passport — your stamps, badges and revealed clues — is stored in your browser only, and “I'm here” compares your position with the place on your device.",
          "The map loads its tiles from OpenFreeMap (OpenStreetMap data) and elevation tiles from Amazon Web Services' open data, and photos load from Wikimedia Commons and, for ROSI's listings, from Booking.com. Those services receive your IP address when your browser fetches them. “Send enquiry” opens your own email app; nothing passes through this site.",
        ],
        sq: [
          "Kjo faqe nuk vendos cookies dhe nuk përdor analitikë. Udhëtimi im ruhet vetëm në shfletuesin tuaj; një lidhje e ndarë udhëtimi mbart vetë udhëtimin, pas shenjës #, të cilën shfletuesit nuk ua dërgojnë serverëve. Faqet që hapni ruhen gjithashtu në shfletuesin tuaj, që të punojnë edhe pa sinjal; fshirja e të dhënave të kësaj faqeje i heq ato. “Trego ku jam” në hartë i kërkon shfletuesit pozicionin tuaj dhe e vizaton vetëm në ekranin tuaj; nuk dërgohet e nuk ruhet kurrë. Pasaporta e gjuetisë së thesarit — vulat, stemat dhe të dhënat e zbuluara — ruhet vetëm në shfletuesin tuaj, dhe “Jam këtu” e krahason pozicionin tuaj me vendin në pajisjen tuaj.",
          "Harta ngarkon pllakat nga OpenFreeMap (të dhëna të OpenStreetMap) dhe pllakat e lartësisë nga të dhënat e hapura të Amazon Web Services, dhe fotot ngarkohen nga Wikimedia Commons dhe, për listimet e ROSI-t, nga Booking.com. Këto shërbime marrin adresën tuaj IP kur shfletuesi juaj i shkarkon. “Dërgo pyetje” hap aplikacionin tuaj të emailit; asgjë nuk kalon përmes kësaj faqeje.",
        ],
        cnr: [
          "Ovaj sajt ne postavlja kolačiće i ne koristi analitiku. Moje putovanje čuva se samo u vašem pregledaču; podijeljeni link putovanja nosi samo putovanje, iza znaka #, koji pregledači ne šalju serverima. Stranice koje otvorite čuvaju se i u vašem pregledaču, da bi radile i bez signala; brisanje podataka ovog sajta ih uklanja. „Prikaži gdje sam” na karti traži od pregledača vašu poziciju i crta je samo na vašem ekranu; nikada se ne šalje niti čuva. Pasoš potrage za blagom — vaši pečati, značke i otkriveni tragovi — čuva se samo u vašem pregledaču, a „Ovdje sam” upoređuje vašu poziciju s mjestom na vašem uređaju.",
          "Karta učitava pločice s OpenFreeMap-a (podaci OpenStreetMap-a) i pločice visina iz otvorenih podataka Amazon Web Services-a, a fotografije s Wikimedia Commons i, za ROSI-jeve oglase, s Booking.com-a. Ti servisi primaju vašu IP adresu kada ih vaš pregledač preuzme. „Pošalji upit” otvara vašu email aplikaciju; ništa ne prolazi kroz ovaj sajt.",
        ],
      },
    },
    {
      heading: { en: "Translations", sq: "Përkthimet", cnr: "Prevodi" },
      body: {
        en: [
          "English is the source language. The Albanian and Montenegrin texts are drafts and are marked as unreviewed until a fluent local editor has checked them.",
        ],
        sq: ["Anglishtja është gjuha burimore. Tekstet shqip dhe malazisht janë drafte dhe shënohen si të pashqyrtuara derisa t'i kontrollojë një redaktor vendas që i flet rrjedhshëm."],
        cnr: ["Engleski je izvorni jezik. Albanski i crnogorski tekstovi su nacrti i označeni su kao nepregledani dok ih ne provjeri lokalni urednik koji tečno govori jezik."],
      },
    },
  ],
};

export const partners: {
  status: Localized;
  lead: Localized;
  sections: ProseSection[];
  pilotPlaces: Localized<string[]>;
} = {
  status: {
    en: "Proposal only. Nothing on this page has been agreed with, approved by or endorsed by any tourism organisation or public body. Any partnership, use of official logos, sponsorship or data sharing would need a separate written agreement.",
    sq: "Vetëm propozim. Asgjë në këtë faqe nuk është rënë dakord, miratuar apo mbështetur nga ndonjë organizatë turistike apo institucion publik. Çdo partneritet, përdorim i logove zyrtare, sponsorizim apo ndarje të dhënash do të kërkonte marrëveshje të veçantë me shkrim.",
    cnr: "Samo prijedlog. Ništa na ovoj stranici nije dogovoreno, odobreno niti podržano od strane bilo koje turističke organizacije ili javne institucije. Svako partnerstvo, korišćenje zvaničnih logotipa, sponzorstvo ili dijeljenje podataka zahtijevalo bi poseban pisani sporazum.",
  },
  lead: {
    en: "How this guide could support the Gusinje Tourism Organisation, the national park and local businesses — with a small, carefully verified pilot.",
    sq: "Si mund ta mbështeste ky udhëzues Organizatën Turistike të Gucisë, parkun kombëtar dhe bizneset vendore — me një pilot të vogël e të verifikuar me kujdes.",
    cnr: "Kako bi ovaj vodič mogao da podrži Turističku organizaciju Gusinje, nacionalni park i lokalne objekte — kroz mali, pažljivo provjeren pilot.",
  },
  pilotPlaces: {
    en: [
      "Ali Pasha's Springs",
      "Grlja waterfall viewpoint (not the canyon)",
      "Oko Skakavice",
      "Vusanje village centre",
      "Grbaja valley entry point",
      "Ropojana valley entry point",
      "Gusinje centre: the Vizier's Mosque and the churches of St. Đorđe and St. Anton",
      "A visitor-information point",
    ],
    sq: [
      "Burimet e Ali Pashës",
      "Pika e shikimit të ujëvarës së Grlës (jo kanioni)",
      "Oko Skakavice",
      "Qendra e fshatit Vuthaj",
      "Pika e hyrjes në luginën e Gërbajës",
      "Pika e hyrjes në luginën e Ropojanës",
      "Qendra e Gucisë: Xhamia e Vezirit dhe kishat e Shën Gjergjit e të Shën Ndout",
      "Një pikë informacioni për vizitorët",
    ],
    cnr: [
      "Alipašini izvori",
      "Vidikovac na vodopad Grlja (ne kanjon)",
      "Oko Skakavice",
      "Centar sela Vusanje",
      "Ulazni punkt u dolinu Grbaja",
      "Ulazni punkt u dolinu Ropojane",
      "Centar Gusinja: Vezirova džamija i crkve Svetog Đorđa i Svetog Antona",
      "Info-punkt za posjetioce",
    ],
  },
  sections: [
    {
      heading: { en: "For visitors", sq: "Për vizitorët", cnr: "Za posjetioce" },
      body: {
        en: [
          "One place to explore the valley in 3D, on a map or as a list; pages for each place with sources and check dates; walks with honest information about what is and isn't verified; practical tips; and a trip planner that works without an account — in English, Albanian and Montenegrin, and on phones with slow connections.",
        ],
        sq: [
          "Një vend për të eksploruar luginën në 3D, në hartë ose si listë; faqe për çdo vend me burime dhe data kontrolli; shtigje me informacion të ndershëm për atë që është dhe s'është verifikuar; këshilla praktike; dhe një planifikues udhëtimi që punon pa llogari — në anglisht, shqip dhe malazisht, dhe në telefona me lidhje të ngadalta.",
        ],
        cnr: [
          "Jedno mjesto za istraživanje doline u 3D, na karti ili kao spisak; stranice za svako mjesto s izvorima i datumima provjere; staze s iskrenim informacijama o tome šta jeste, a šta nije provjereno; praktični savjeti; i planer putovanja koji radi bez naloga — na engleskom, albanskom i crnogorskom, i na telefonima sa sporim internetom.",
        ],
      },
    },
    {
      heading: { en: "For local businesses", sq: "Për bizneset vendore", cnr: "Za lokalne objekte" },
      body: {
        en: [
          "A free, fair listing: A–Z order, no paid placement, a clear line between what a business says and what has been checked, direct contact links (call, website, email enquiry, WhatsApp where approved), and the chance to claim and maintain their own listing after verification.",
        ],
        sq: [
          "Një listim falas dhe i drejtë: renditje sipas alfabetit, pa pozicion me pagesë, ndarje e qartë mes asaj që thotë biznesi dhe asaj që është kontrolluar, lidhje kontakti direkte (telefon, faqe interneti, pyetje me email, WhatsApp kur miratohet), dhe mundësia për ta marrë në pronësi e për ta mirëmbajtur listimin pas verifikimit.",
        ],
        cnr: [
          "Besplatan i pravičan oglas: abecedni redosljed, bez plaćenih pozicija, jasna razlika između onoga što objekat navodi i onoga što je provjereno, direktni kontakti (poziv, sajt, upit emailom, WhatsApp gdje je odobren) i mogućnost da nakon provjere preuzmu i održavaju svoj oglas.",
        ],
      },
    },
    {
      heading: { en: "The region already has virtual tours", sq: "Rajoni ka tashmë ture virtuale", cnr: "Region već ima virtuelne ture" },
      body: {
        en: [
          "This would not be the region's first virtual tour, and we don't claim it is. What it adds is local depth and maintenance: a connected 3D view, map and list; a directory that is honest about its coverage; multilingual guides; mobile access; and content that shows its sources and is kept up to date.",
        ],
        sq: [
          "Ky nuk do të ishte turi i parë virtual i rajonit dhe nuk pretendojmë se është. Ajo që shton është thellësia vendore dhe mirëmbajtja: pamje 3D, hartë dhe listë të lidhura; një drejtori e ndershme për mbulimin e saj; udhëzues shumëgjuhësh; qasje nga telefoni; dhe përmbajtje që tregon burimet dhe mbahet e përditësuar.",
        ],
        cnr: [
          "Ovo ne bi bila prva virtuelna tura u regionu i to ne tvrdimo. Ono što donosi jeste lokalna dubina i održavanje: povezani 3D prikaz, karta i spisak; imenik koji je iskren o svojoj pokrivenosti; višejezični vodiči; pristup s telefona; i sadržaj koji pokazuje izvore i redovno se ažurira.",
        ],
      },
    },
    {
      heading: { en: "Proposed pilot: 5–8 verified locations", sq: "Pilot i propozuar: 5–8 vende të verifikuara", cnr: "Predloženi pilot: 5–8 provjerenih lokacija" },
      body: {
        en: [
          "Together with local partners, check a small set of places on the ground: exact positions, access, accessibility limits, warnings and seasonal notes, with photos taken with permission. Each would then be marked “checked on site” with the date and the partner responsible.",
          "Candidate locations are listed below; the final choice would be the partners'.",
        ],
        sq: [
          "Së bashku me partnerët vendorë, të kontrollohet në terren një grup i vogël vendesh: pozicionet e sakta, qasja, kufizimet e aksesueshmërisë, paralajmërimet dhe shënimet sezonale, me foto të bëra me leje. Secili do të shënohej pastaj “i kontrolluar në vend” me datën dhe partnerin përgjegjës.",
          "Vendet kandidate renditen më poshtë; zgjedhja përfundimtare do t'u takonte partnerëve.",
        ],
        cnr: [
          "Zajedno s lokalnim partnerima, provjeriti na terenu mali broj mjesta: tačne položaje, pristup, ograničenja pristupačnosti, upozorenja i sezonske napomene, s fotografijama snimljenim uz dozvolu. Svako bi zatim bilo označeno kao „provjereno na licu mjesta” s datumom i odgovornim partnerom.",
          "Kandidati su navedeni ispod; konačan izbor bio bi na partnerima.",
        ],
      },
    },
    {
      heading: { en: "Verification and corrections", sq: "Verifikimi dhe korrigjimet", cnr: "Provjera i ispravke" },
      body: {
        en: [
          "Partners would review content for their area, flag errors through the correction form, and approve official links. Safety-related corrections would be reviewed first. Every record shows who keeps it current and when it was last checked.",
        ],
        sq: [
          "Partnerët do të shqyrtonin përmbajtjen për zonën e tyre, do të sinjalizonin gabimet përmes formularit të korrigjimit dhe do të miratonin lidhjet zyrtare. Korrigjimet që lidhen me sigurinë do të shqyrtoheshin të parat. Çdo regjistrim tregon kush e mban të përditësuar dhe kur u kontrollua për herë të fundit.",
        ],
        cnr: [
          "Partneri bi pregledali sadržaj za svoje područje, prijavljivali greške kroz obrazac za ispravke i odobravali zvanične linkove. Ispravke vezane za bezbjednost pregledale bi se prve. Svaki zapis pokazuje ko ga održava i kada je posljednji put provjeren.",
        ],
      },
    },
    {
      heading: { en: "QR codes at willing locations", sq: "Kode QR në vendet e gatshme", cnr: "QR kodovi na voljnim lokacijama" },
      body: {
        en: [
          "Every page already has a printable QR code. Cards could be placed — only where owners agree — at accommodation and visitor-information points, linking to the place, the map or the guide in the visitor's language.",
        ],
        sq: [
          "Çdo faqe ka tashmë një kod QR për printim. Kartat mund të vendoseshin — vetëm aty ku pajtohen pronarët — në akomodime dhe pika informacioni, me lidhje te vendi, harta ose udhëzuesi në gjuhën e vizitorit.",
        ],
        cnr: [
          "Svaka stranica već ima QR kod za štampu. Kartice bi se mogle postaviti — samo gdje se vlasnici slože — u smještajnim objektima i info-punktovima, s linkom ka mjestu, karti ili vodiču na jeziku posjetioca.",
        ],
      },
    },
    {
      heading: { en: "Link or embed", sq: "Lidhje ose integrim", cnr: "Link ili ugradnja" },
      body: {
        en: [
          "Partners could link to the guide or embed the map on their own website. The embed would show the same places, with attribution, and could be removed at any time.",
        ],
        sq: [
          "Partnerët mund të lidheshin me udhëzuesin ose të integronin hartën në faqen e tyre. Integrimi do të tregonte të njëjtat vende, me atribuim, dhe mund të hiqej në çdo kohë.",
        ],
        cnr: [
          "Partneri bi mogli da postave link ka vodiču ili da ugrade kartu na svoj sajt. Ugrađena karta prikazivala bi ista mjesta, uz navođenje izvora, i mogla bi se ukloniti u svakom trenutku.",
        ],
      },
    },
    {
      heading: { en: "Measuring use, privately", sq: "Matja e përdorimit, në mënyrë private", cnr: "Mjerenje korišćenja, privatno" },
      body: {
        en: [
          "Today the site collects no analytics. For a pilot, we propose cookie-free, aggregate statistics only — page views by language and section, QR scans by location — with no personal data, shared with partners in a monthly summary. This would be switched on only with the partners' agreement and a published privacy notice.",
        ],
        sq: [
          "Sot faqja nuk mbledh analitikë. Për një pilot, propozojmë vetëm statistika të përgjithshme pa cookies — shikime faqesh sipas gjuhës dhe seksionit, skanime QR sipas vendit — pa të dhëna personale, të ndara me partnerët në një përmbledhje mujore. Kjo do të aktivizohej vetëm me pëlqimin e partnerëve dhe me një njoftim privatësie të publikuar.",
        ],
        cnr: [
          "Sajt danas ne prikuplja analitiku. Za pilot predlažemo samo zbirnu statistiku bez kolačića — preglede stranica po jeziku i rubrici, skeniranja QR kodova po lokaciji — bez ličnih podataka, s mjesečnim izvještajem za partnere. To bi se uključilo samo uz saglasnost partnera i objavljeno obavještenje o privatnosti.",
        ],
      },
    },
    {
      heading: {
        en: "Option: the Tourism Organisation's own website",
        sq: "Mundësi: faqja e vetë Organizatës Turistike",
        cnr: "Opcija: sopstveni sajt Turističke organizacije",
      },
      body: {
        en: [
          "Beyond a pilot, the platform could become the Gusinje Tourism Organisation's website if the organisation wanted that. It was built so the name, logo, colours and web address can change in one place, and so the organisation's staff could run it themselves: editors for places and listings, moderators for reviews and corrections, and owners verified for their own listings.",
          "What would change, only after a written agreement: the organisation's name and branding, its own domain, its staff as editors, its listings, events and visitor-information office brought across from its current website with its permission, and an events calendar added. What would not change: every fact keeps its source and check date, listings stay A–Z with nobody paying for position, and ROSI's own listings follow the same rules as everyone else's.",
          "Nothing of this has been discussed with or offered to the organisation yet. This guide does not use its name or logo as its own, and is not its website.",
        ],
        sq: [
          "Përtej një piloti, platforma mund të bëhej faqja e Organizatës Turistike të Gucisë, nëse organizata e dëshiron. Ajo është ndërtuar që emri, logoja, ngjyrat dhe adresa e internetit të ndryshojnë në një vend të vetëm, dhe që stafi i organizatës ta drejtojë vetë: redaktorë për vendet dhe listimet, moderatorë për vlerësimet dhe korrigjimet, dhe pronarë të verifikuar për listimet e tyre.",
          "Çfarë do të ndryshonte, vetëm pas një marrëveshjeje me shkrim: emri dhe identiteti vizual i organizatës, domeni i saj, stafi i saj si redaktorë, listimet, ngjarjet dhe zyra e informimit turistik të sjella nga faqja e saj aktuale me lejen e saj, dhe një kalendar ngjarjesh. Çfarë nuk do të ndryshonte: çdo fakt ruan burimin dhe datën e kontrollit, listimet mbeten A–Zh pa pagesë për pozicion, dhe listimet e vetë ROSI-t ndjekin të njëjtat rregulla si të gjithë të tjerët.",
          "Asgjë nga kjo nuk është diskutuar apo ofruar ende me organizatën. Ky udhëzues nuk e përdor emrin apo logon e saj si të vetin dhe nuk është faqja e saj.",
        ],
        cnr: [
          "Osim pilota, platforma bi mogla postati sajt Turističke organizacije Gusinje, ako organizacija to želi. Napravljena je tako da se naziv, logo, boje i web adresa mijenjaju na jednom mjestu, i da je osoblje organizacije može samo voditi: urednici za mjesta i oglase, moderatori za recenzije i ispravke, i provjereni vlasnici za svoje oglase.",
          "Šta bi se promijenilo, tek nakon pisanog sporazuma: naziv i vizuelni identitet organizacije, njen domen, njeno osoblje kao urednici, njeni oglasi, događaji i turistički info centar preneseni s njenog sadašnjeg sajta uz njenu dozvolu, i dodat kalendar događaja. Šta se ne bi promijenilo: svaka činjenica zadržava izvor i datum provjere, oglasi ostaju po abecedi i niko ne plaća poziciju, a ROSI-jevi oglasi poštuju ista pravila kao i svi ostali.",
          "Ništa od ovoga još nije razgovarano niti ponuđeno organizaciji. Ovaj vodič ne koristi njen naziv ni logo kao svoje i nije njen sajt.",
        ],
      },
    },
  ],
};
