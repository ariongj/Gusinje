/**
 * History and culture of Gusinje, Vusanje and the Plav–Gusinje area.
 *
 * Written to be neutral: facts are attributed to their sources, numbers that
 * sources dispute are given as such, and the most contested periods are
 * marked so readers know accounts differ. The Second World War is left out:
 * only one academic viewpoint was found, which is not enough for a fair
 * summary. Like the rest of the desk research, the sources were read in
 * search results quoting them; an editor (ideally a local historian) should
 * review this page before launch.
 */

import type { Localized } from "./types";

export type HistoryEntry = {
  period: Localized;
  title: Localized;
  body: Localized<string[]>;
  sources: string[];
  /** Accounts of this period differ sharply: say so on the page. */
  contested?: boolean;
};

export type CultureEntry = {
  title: Localized;
  body: Localized<string[]>;
  sources: string[];
};

export const historyLead: Localized = {
  en: "From a caravan station on the road between the Adriatic and Kosovo to Montenegro's youngest municipality: a short history of Gusinje and Vusanje, with the sources for every line.",
  sq: "Nga një stacion karvanësh në rrugën mes Adriatikut dhe Kosovës te komuna më e re e Malit të Zi: një histori e shkurtër e Gucisë dhe Vuthajve, me burimet për çdo rresht.",
  cnr: "Od karavanske stanice na putu između Jadrana i Kosova do najmlađe opštine u Crnoj Gori: kratka istorija Gusinja i Vusanja, s izvorima za svaki red.",
};

export const timeline: HistoryEntry[] = [
  {
    period: { en: "1330", sq: "1330", cnr: "1330" },
    title: { en: "First records", sq: "Shënimet e para", cnr: "Prvi zapisi" },
    body: {
      en: [
        "The Dečani charters of 1330 record the mountains of the Hoti (“Hotina Gora”) in the Plav and Gusinje area, and mention Gusinje as a landmark on the boundary of a donated village.",
      ],
      sq: [
        "Kartat e Deçanit të vitit 1330 shënojnë malet e Hotit (“Hotina Gora”) në zonën e Plavës dhe Gucisë, dhe e përmendin Gucinë si pikë kufiri të një fshati të dhuruar.",
      ],
      cnr: [
        "Dečanske hrisovulje iz 1330. bilježe planine Hota („Hotina Gora”) na području Plava i Gusinja i pominju Gusinje kao međaš jednog darovanog sela.",
      ],
    },
    sources: ["oeaw-gusinje", "wiki-gusinje"],
  },
  {
    period: { en: "14th–15th century", sq: "Shekujt XIV–XV", cnr: "XIV–XV vijek" },
    title: { en: "On the caravan road", sq: "Në rrugën e karvanëve", cnr: "Na karavanskom putu" },
    body: {
      en: [
        "Gusinje was a caravan station on the route linking Dubrovnik and Kotor with Shkodër and Peć. In the Ottoman register of 1485 it appears as a village of the Plav district, held directly by the Sultan.",
      ],
      sq: [
        "Gucia ishte stacion karvanësh në rrugën që lidhte Dubrovnikun dhe Kotorin me Shkodrën dhe Pejën. Në regjistrin osman të vitit 1485 shfaqet si fshat i krahinës së Plavës, në zotërim të drejtpërdrejtë të Sulltanit.",
      ],
      cnr: [
        "Gusinje je bilo karavanska stanica na putu koji je povezivao Dubrovnik i Kotor sa Skadrom i Peći. U osmanskom defteru iz 1485. pojavljuje se kao selo Plavske nahije, u neposrednom posjedu sultana.",
      ],
    },
    sources: ["wiki-gusinje"],
  },
  {
    period: { en: "17th–18th century", sq: "Shekujt XVII–XVIII", cnr: "XVII–XVIII vijek" },
    title: { en: "A fortress, a bazaar and mosques", sq: "Një kështjellë, një çarshi dhe xhamia", cnr: "Tvrđava, čaršija i džamije" },
    body: {
      en: [
        "A Venetian report records a fortress at Gusinje completed in the early 17th century; the town grew up around it, with mosques and a dense trading street, the čaršija.",
        "The Vizier's Mosque is the oldest preserved mosque in the town. Sources date it differently — 1626 (Lonely Planet) or 1765 — and it has been rebuilt several times; it was repaired in 1992 with money from emigrants in the United States.",
      ],
      sq: [
        "Një raport venedikas shënon një kështjellë në Guci të përfunduar në fillim të shekullit XVII; qyteti u rrit rreth saj, me xhami dhe një rrugë tregtare të dendur, çarshinë.",
        "Xhamia e Vezirit është xhamia më e vjetër e ruajtur në qytet. Burimet e datojnë ndryshe — 1626 (Lonely Planet) ose 1765 — dhe është rindërtuar disa herë; u riparua në vitin 1992 me para nga emigrantët në Shtetet e Bashkuara.",
      ],
      cnr: [
        "Jedan mletački izvještaj bilježi tvrđavu u Gusinju završenu početkom XVII vijeka; grad je rastao oko nje, s džamijama i gustom trgovačkom ulicom, čaršijom.",
        "Vezirova džamija je najstarija sačuvana džamija u gradu. Izvori je različito datiraju — 1626. (Lonely Planet) ili 1765. — i više puta je obnavljana; popravljena je 1992. novcem iseljenika u Sjedinjenim Državama.",
      ],
    },
    sources: ["wiki-gusinje", "lonelyplanet-viziers-mosque", "recultivatur-mosque"],
  },
  {
    period: { en: "1878–1880", sq: "1878–1880", cnr: "1878–1880" },
    title: { en: "Ali Pasha of Gusinje and the Congress of Berlin", sq: "Ali Pashë Gucia dhe Kongresi i Berlinit", cnr: "Ali-paša Gusinjski i Berlinski kongres" },
    body: {
      en: [
        "The Congress of Berlin (1878) assigned Plav and Gusinje to Montenegro. Local forces of the League of Prizren, led by Ali Pasha of Gusinje (born in Gusinje in 1828), resisted the transfer. After fighting in 1879–1880, including the battle of Novšiće in December 1879, the area remained Ottoman, and the great powers gave Ulcinj to Montenegro instead.",
        "Casualty figures for these battles differ between sources.",
      ],
      sq: [
        "Kongresi i Berlinit (1878) ia caktoi Plavën dhe Gucinë Malit të Zi. Forcat vendore të Lidhjes së Prizrenit, të udhëhequra nga Ali Pashë Gucia (lindur në Guci më 1828), iu kundërvunë dorëzimit. Pas luftimeve të viteve 1879–1880, përfshirë betejën e Nokshiqit në dhjetor 1879, zona mbeti osmane dhe Fuqitë e Mëdha i dhanë Malit të Zi Ulqinin në vend të saj.",
        "Shifrat e të rënëve në këto beteja ndryshojnë sipas burimeve.",
      ],
      cnr: [
        "Berlinski kongres (1878) dodijelio je Plav i Gusinje Crnoj Gori. Lokalne snage Prizrenske lige, predvođene Ali-pašom Gusinjskim (rođenim u Gusinju 1828), suprotstavile su se predaji. Nakon borbi 1879–1880, uključujući bitku na Novšiću u decembru 1879, područje je ostalo osmansko, a velike sile su Crnoj Gori umjesto njega dale Ulcinj.",
        "Podaci o broju žrtava u ovim bitkama razlikuju se po izvorima.",
      ],
    },
    sources: ["wiki-ali-pasha", "wiki-battles-plav-gusinje", "wiki-novsice"],
  },
  {
    period: { en: "1912–1913", sq: "1912–1913", cnr: "1912–1913" },
    title: { en: "The Balkan Wars", sq: "Luftërat Ballkanike", cnr: "Balkanski ratovi" },
    body: {
      en: [
        "Montenegro took Plav and Gusinje in the First Balkan War in October 1912. The months of military administration that followed brought killings and forced conversions to Orthodoxy. The numbers are disputed, and historians in Albania, Montenegro and Serbia describe the period very differently.",
      ],
      sq: [
        "Mali i Zi e mori Plavën dhe Gucinë në Luftën e Parë Ballkanike në tetor 1912. Muajt e administratës ushtarake që pasuan sollën vrasje dhe konvertime të detyruara në ortodoksi. Numrat janë të kontestuar dhe historianët në Shqipëri, Mal të Zi dhe Serbi e përshkruajnë periudhën shumë ndryshe.",
      ],
      cnr: [
        "Crna Gora je zauzela Plav i Gusinje u Prvom balkanskom ratu u oktobru 1912. Mjeseci vojne uprave koji su uslijedili donijeli su ubistva i prisilna prevođenja u pravoslavlje. Brojke su sporne, a istoričari u Albaniji, Crnoj Gori i Srbiji vrlo različito opisuju taj period.",
      ],
    },
    sources: ["wiki-plav-gusinje-1912"],
    contested: true,
  },
  {
    period: { en: "After 1913", sq: "Pas vitit 1913", cnr: "Poslije 1913." },
    title: { en: "Emigration", sq: "Emigrimi", cnr: "Iseljavanje" },
    body: {
      en: [
        "Many families emigrated, above all to the United States. Wikipedia reports that around nine in ten people from Vusanje left after 1913, mostly for the New York area; today a large diaspora from Plav and Gusinje lives in New York and Chicago. Želimir Žilnik's 1988 film “Brooklyn – Gusinje” tells this story.",
      ],
      sq: [
        "Shumë familje emigruan, mbi të gjitha në Shtetet e Bashkuara. Wikipedia raporton se rreth nëntë në dhjetë banorë të Vuthajve u larguan pas vitit 1913, kryesisht drejt zonës së Nju Jorkut; sot një diasporë e madhe nga Plava dhe Gucia jeton në Nju Jork dhe Çikago. Filmi i Zhelimir Zhilnikut i vitit 1988 “Brooklyn – Gusinje” e tregon këtë histori.",
      ],
      cnr: [
        "Mnoge porodice su se iselile, prije svega u Sjedinjene Države. Wikipedia navodi da je oko devet od deset stanovnika Vusanja otišlo poslije 1913, uglavnom u okolinu Njujorka; danas velika dijaspora iz Plava i Gusinja živi u Njujorku i Čikagu. Film Želimira Žilnika iz 1988. „Brooklyn – Gusinje” priča tu priču.",
      ],
    },
    sources: ["wiki-vusanje", "wiki-mne-diaspora", "film-brooklyn-gusinje"],
  },
  {
    period: { en: "1919–2014", sq: "1919–2014", cnr: "1919–2014" },
    title: { en: "Yugoslavia and a new municipality", sq: "Jugosllavia dhe një komunë e re", cnr: "Jugoslavija i nova opština" },
    body: {
      en: [
        "After the First World War the area became part of the Kingdom of Serbs, Croats and Slovenes, later Yugoslavia; a revolt in the Plav and Gusinje districts in 1919 was put down. Gusinje belonged to Plav municipality from 1953 until 2014, when it became a municipality of its own — the youngest in Montenegro.",
      ],
      sq: [
        "Pas Luftës së Parë Botërore zona u bë pjesë e Mbretërisë së Serbëve, Kroatëve dhe Sllovenëve, më vonë Jugosllavisë; një kryengritje në krahinat e Plavës dhe Gucisë në vitin 1919 u shtyp. Gucia i përkiste komunës së Plavës nga viti 1953 deri në 2014, kur u bë komunë më vete — më e reja në Mal të Zi.",
      ],
      cnr: [
        "Poslije Prvog svjetskog rata područje je ušlo u sastav Kraljevine Srba, Hrvata i Slovenaca, kasnije Jugoslavije; pobuna u plavskom i gusinjskom kraju 1919. je ugušena. Gusinje je pripadalo opštini Plav od 1953. do 2014, kada je postalo zasebna opština — najmlađa u Crnoj Gori.",
      ],
    },
    sources: ["wiki-plav-town", "wiki-gusinje-municipality", "statoids-mne"],
  },
];

export const culture: CultureEntry[] = [
  {
    title: { en: "Mosques and churches", sq: "Xhamitë dhe kishat", cnr: "Džamije i crkve" },
    body: {
      en: [
        "Besides the Vizier's Mosque, Wikipedia lists the Čekaj mosque (1687) and the New Mosque of 1899, known as “Radončića” after the family brotherhood that built it — the town's mosques were built by different brotherhoods. In the centre, the Orthodox Church of St. Đorđe and the Catholic Church of St. Anton stand on the same street as the Vizier's Mosque.",
      ],
      sq: [
        "Përveç Xhamisë së Vezirit, Wikipedia rendit xhaminë Çekaj (1687) dhe Xhaminë e Re të vitit 1899, të njohur si “e Radonçiqëve” sipas vëllazërisë që e ndërtoi — xhamitë e qytetit i ndërtuan vëllazëri të ndryshme. Në qendër, Kisha Ortodokse e Shën Gjergjit dhe Kisha Katolike e Shën Ndout ndodhen në të njëjtën rrugë me Xhaminë e Vezirit.",
      ],
      cnr: [
        "Osim Vezirove džamije, Wikipedia navodi džamiju Čekaj (1687) i Novu džamiju iz 1899, poznatu kao „Radončića” po bratstvu koje ju je podiglo — gradske džamije podigla su različita bratstva. U centru, pravoslavna crkva Svetog Đorđa i katolička crkva Svetog Antona nalaze se u istoj ulici kao Vezirova džamija.",
      ],
    },
    sources: ["wiki-gusinje", "mne-travel-mountain-towns"],
  },
  {
    title: { en: "Katuns: summers in the mountains", sq: "Katunet: verat në mal", cnr: "Katuni: ljeta u planini" },
    body: {
      en: [
        "Katuns are the summer settlements of the shepherds who take their flocks up to the high pastures. Visitors can stay in some of them, and longer hikes can include nights in the shepherds' traditional wooden huts. On the Peaks of the Balkans, shepherds are at the katuns from about late June to late September.",
      ],
      sq: [
        "Katunet janë vendbanimet verore të barinjve që i ngjitin kopetë në kullotat e larta. Vizitorët mund të qëndrojnë në disa prej tyre, dhe ecjet më të gjata mund të përfshijnë netë në kasollet tradicionale prej druri të barinjve. Në Majat e Ballkanit, barinjtë janë në katune përafërsisht nga fundi i qershorit deri në fund të shtatorit.",
      ],
      cnr: [
        "Katuni su ljetna naselja čobana koji izvode stada na visoke pašnjake. Posjetioci mogu odsjesti u nekima od njih, a duže ture mogu uključiti noćenja u tradicionalnim drvenim kolibama čobana. Na Vrhovima Balkana čobani su na katunima otprilike od kraja juna do kraja septembra.",
      ],
    },
    sources: ["mne-travel-prokletije", "pob-babino-plav"],
  },
  {
    title: { en: "Gusinj Summer", sq: "Vera e Gucisë", cnr: "Gusinjsko ljeto" },
    body: {
      en: [
        "Every summer the town holds “Gusinj Summer”, a programme of concerts and events organised by the Municipality, the Tourism Organisation and the Centre for Culture. The 2025 edition ran from 13 July to 5 August; dates for each year are announced by the organisers.",
      ],
      sq: [
        "Çdo verë qyteti organizon “Verën e Gucisë”, një program koncertesh dhe ngjarjesh nga Komuna, Organizata Turistike dhe Qendra e Kulturës. Edicioni 2025 zgjati nga 13 korriku deri më 5 gusht; datat e çdo viti i shpallin organizatorët.",
      ],
      cnr: [
        "Svakog ljeta grad organizuje „Gusinjsko ljeto”, program koncerata i događaja koji priređuju Opština, Turistička organizacija i Centar za kulturu. Izdanje 2025. trajalo je od 13. jula do 5. avgusta; datume za svaku godinu objavljuju organizatori.",
      ],
    },
    sources: ["gusinje-travel-summer-2025"],
  },
  {
    title: { en: "The springs' old belief", sq: "Besimi i vjetër i burimeve", cnr: "Staro vjerovanje o izvorima" },
    body: {
      en: [
        "As the tourism organisation tells it, people believe the water of Ali Pasha's Springs keeps the body young and strengthens the spirit — and that a marriage made there will be long and happy.",
      ],
      sq: [
        "Siç e tregon organizata turistike, njerëzit besojnë se uji i Burimeve të Ali Pashës e mban trupin të ri dhe e forcon shpirtin — dhe se një martesë e lidhur aty do të jetë e gjatë dhe e lumtur.",
      ],
      cnr: [
        "Kako to priča turistička organizacija, vjeruje se da voda Alipašinih izvora čuva tijelo mladim i jača duh — i da će brak sklopljen tu biti dug i srećan.",
      ],
    },
    sources: ["gusinje-travel-ali-pasha-springs"],
  },
  {
    title: { en: "Languages and people", sq: "Gjuhët dhe njerëzit", cnr: "Jezici i ljudi" },
    body: {
      en: [
        "At the 2023 census Gusinje municipality had 3,933 inhabitants. The mother tongues recorded were mainly Bosnian (1,973) and Albanian (1,301), followed by Montenegrin (421) and Serbian (129). Place names come in Albanian and Montenegrin forms — Gusinje and Gucia, Vusanje and Vuthaj.",
        "Where the names come from is not settled: for Gusinje, scholars have proposed both a Slavic word for “goose” and an older Illyrian place name; for Vuthaj, the linguist Eqrem Çabej proposed an Albanian word meaning “settled”.",
      ],
      sq: [
        "Në regjistrimin e vitit 2023 komuna e Gucisë kishte 3.933 banorë. Gjuhët amtare të regjistruara ishin kryesisht boshnjakishtja (1.973) dhe shqipja (1.301), pastaj malazezishtja (421) dhe serbishtja (129). Emrat e vendeve kanë forma shqipe dhe malazeze — Gucia dhe Gusinje, Vuthaj dhe Vusanje.",
        "Prejardhja e emrave nuk është e sigurt: për Gucinë janë propozuar si një fjalë sllave për “patë”, ashtu edhe një emër vendi më i vjetër ilir; për Vuthajn, gjuhëtari Eqrem Çabej propozoi një fjalë shqipe me kuptimin “i vendosur”.",
      ],
      cnr: [
        "Po popisu iz 2023. opština Gusinje imala je 3.933 stanovnika. Zabilježeni maternji jezici bili su uglavnom bosanski (1.973) i albanski (1.301), zatim crnogorski (421) i srpski (129). Nazivi mjesta imaju albanski i crnogorski oblik — Gusinje i Gucia, Vusanje i Vuthaj.",
        "Porijeklo naziva nije utvrđeno: za Gusinje su predložene i slovenska riječ za „gusku” i stariji ilirski toponim; za Vusanje je lingvista Eqrem Çabej predložio albansku riječ sa značenjem „nastanjen”.",
      ],
    },
    sources: ["citypopulation-gusinje", "wiki-gusinje", "wiki-vusanje"],
  },
  {
    title: { en: "Nearby: the Redžepagić tower in Plav", sq: "Afër: kulla e Rexhepagajve në Plavë", cnr: "U blizini: Redžepagića kula u Plavu" },
    body: {
      en: [
        "In Plav stands the Redžepagić tower, a fortified stone house officially dated 1671 — though possibly older — with walls over a metre thick and a wooden upper storey with jutting balconies.",
      ],
      sq: [
        "Në Plavë ndodhet kulla e Rexhepagajve, një shtëpi guri e fortifikuar e datuar zyrtarisht në vitin 1671 — ndoshta edhe më e vjetër — me mure më të trasha se një metër dhe një kat të sipërm prej druri me ballkone të dala.",
      ],
      cnr: [
        "U Plavu se nalazi Redžepagića kula, utvrđena kamena kuća zvanično datirana 1671. — možda i starija — sa zidovima debljim od metra i drvenim gornjim spratom s isturenim balkonima.",
      ],
    },
    sources: ["lonelyplanet-redzepagic"],
  },
];
