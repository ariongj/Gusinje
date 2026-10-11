/**
 * Demo content: invented businesses, guides and events that show how the
 * guide works when it is full. Only in demo builds (NEXT_PUBLIC_DEMO=true —
 * the preview), never in a public launch. Every view of them says "Demo";
 * they carry no phone numbers, emails or ratings, every price is marked as an
 * example, and their booking forms send nothing. Pictures are illustrations
 * drawn for this guide (scripts/illustrations.mjs).
 */

import { brand } from "@/config/brand";

import type { Business, Localized, Photo, TranslationStatus } from "./types";

/** Demo builds: the preview shows a full guide; launches never include this file's content. */
export const DEMO = process.env.NEXT_PUBLIC_DEMO === "true";

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

/* ------------------------------------------------------------ illustrations */

const ALT: Record<string, Localized> = {
  "guesthouse-dusk": { en: "Illustration: a wooden guest house at dusk under snowy peaks", sq: "Ilustrim: një bujtinë prej druri në muzg nën maja me borë", cnr: "Ilustracija: drvena kuća za goste u sumrak ispod snježnih vrhova" },
  "guesthouse-day": { en: "Illustration: a wooden guest house in a meadow with haystacks", sq: "Ilustrim: një bujtinë prej druri në livadh me mullare", cnr: "Ilustracija: drvena kuća za goste na livadi sa stogovima sijena" },
  "kula-golden": { en: "Illustration: a stone tower house in evening light", sq: "Ilustrim: një kullë guri në dritën e mbrëmjes", cnr: "Ilustracija: kamena kula u večernjem svjetlu" },
  "kula-dusk": { en: "Illustration: a stone tower house with lit windows at dusk", sq: "Ilustrim: një kullë guri me dritare të ndriçuara në muzg", cnr: "Ilustracija: kamena kula s osvijetljenim prozorima u sumrak" },
  "katun-day": { en: "Illustration: wooden katun huts and sheep on a summer pasture", sq: "Ilustrim: kasolle druri të katunit dhe dele në bjeshkë", cnr: "Ilustracija: drvene katunske kolibe i ovce na ljetnjoj ispaši" },
  "katun-dawn": { en: "Illustration: two katun huts at dawn", sq: "Ilustrim: dy kasolle katuni në agim", cnr: "Ilustracija: dvije katunske kolibe u zoru" },
  "camp-night": { en: "Illustration: tents and a campfire under the stars", sq: "Ilustrim: tenda dhe zjarr nën yje", cnr: "Ilustracija: šatori i logorska vatra pod zvijezdama" },
  "terrace-dusk": { en: "Illustration: a dinner terrace with string lights at dusk", sq: "Ilustrim: një tarracë darke me drita në muzg", cnr: "Ilustracija: terasa za večeru sa svjetiljkama u sumrak" },
  "terrace-golden": { en: "Illustration: tables on a terrace in golden evening light", sq: "Ilustrim: tavolina në tarracë në dritën e artë të mbrëmjes", cnr: "Ilustracija: stolovi na terasi u zlatnom večernjem svjetlu" },
  "coffee-day": { en: "Illustration: a pot of coffee and a cup with a mountain view", sq: "Ilustrim: xhezve kafeje dhe një filxhan me pamje nga malet", cnr: "Ilustracija: džezva i šoljica kafe s pogledom na planine" },
  "coffee-dawn": { en: "Illustration: morning coffee in front of the peaks", sq: "Ilustrim: kafja e mëngjesit përballë majave", cnr: "Ilustracija: jutarnja kafa ispred vrhova" },
  "guide-dawn": { en: "Illustration: a hiker beside a red-and-white trail mark at dawn", sq: "Ilustrim: një alpinist pranë shenjës kuq e bardhë të shtegut në agim", cnr: "Ilustracija: planinar pored crveno-bijele markacije u zoru" },
  "guide-golden": { en: "Illustration: a hiker with poles looking at the peaks", sq: "Ilustrim: një alpinist me shkopinj që sheh majat", cnr: "Ilustracija: planinar sa štapovima gleda vrhove" },
  "waterfall-day": { en: "Illustration: a waterfall falling into a rocky gorge", sq: "Ilustrim: një ujëvarë që bie në një grykë shkëmbore", cnr: "Ilustracija: vodopad koji pada u stjenoviti kanjon" },
  "shop-day": { en: "Illustration: jars of honey and a wheel of cheese", sq: "Ilustrim: kavanoza mjalti dhe një rrotë djathi", cnr: "Ilustracija: tegle meda i kolut sira" },
  "lake-day": { en: "Illustration: a mountain lake with the peaks reflected in it", sq: "Ilustrim: një liqen malor me majat që pasqyrohen në të", cnr: "Ilustracija: planinsko jezero u kojem se ogledaju vrhovi" },
  "lake-golden": { en: "Illustration: a mountain lake in evening light", sq: "Ilustrim: një liqen malor në dritën e mbrëmjes", cnr: "Ilustracija: planinsko jezero u večernjem svjetlu" },
  "peak-dawn": { en: "Illustration: the peaks at dawn", sq: "Ilustrim: majat në agim", cnr: "Ilustracija: vrhovi u zoru" },
  "valley-golden": { en: "Illustration: the valley with haystacks and sheep", sq: "Ilustrim: lugina me mullare dhe dele", cnr: "Ilustracija: dolina sa stogovima i ovcama" },
  "valley-winter": { en: "Illustration: the valley on a cold morning", sq: "Ilustrim: lugina në një mëngjes të ftohtë", cnr: "Ilustracija: dolina jednog hladnog jutra" },
  "dish-flija": { en: "Illustration: a tray of flija, the layered pie", sq: "Ilustrim: një tepsi me fli", cnr: "Ilustracija: tepsija flije" },
  "dish-burek": { en: "Illustration: a round tray of burek", sq: "Ilustrim: një tepsi e rrumbullakët me byrek", cnr: "Ilustracija: okrugla tepsija bureka" },
  "dish-trout": { en: "Illustration: grilled trout on a plate", sq: "Ilustrim: troftë e pjekur në pjatë", cnr: "Ilustracija: pečena pastrmka na tanjiru" },
  "dish-board": { en: "Illustration: cheese, bread and honey on a board", sq: "Ilustrim: djathë, bukë dhe mjaltë në një dërrasë", cnr: "Ilustracija: sir, hljeb i med na dasci" },
};

/** An illustration drawn for this guide, as a photo record (credited as an illustration). */
export function illustration(name: keyof typeof ALT & string): Photo {
  return {
    src: `${brand.basePath}/illustrations/${name}.svg`,
    alt: ALT[name].en,
    altLocalized: { sq: ALT[name].sq, cnr: ALT[name].cnr },
    width: 1600,
    height: 1000,
    credit: { author: "", license: "", href: "", via: "", kind: "illustration" },
    rights: "illustration",
  };
}

/** Demo builds: an illustration for a place that has no photo yet (by its kind). */
export function placeholderPicture(category: string): Photo | undefined {
  if (!DEMO) return undefined;
  const name: Record<string, string> = {
    lake: "lake-day",
    waterfall: "waterfall-day",
    spring: "waterfall-day",
    mountain: "peak-dawn",
    viewpoint: "peak-dawn",
    valley: "valley-winter",
    village: "valley-golden",
    town: "valley-golden",
    culture: "kula-golden",
  };
  return illustration(name[category] ?? "valley-golden");
}

/* ---------------------------------------------------------------- listings */

type DemoInput = Pick<Business, "slug" | "name" | "categories" | "area" | "summary" | "nearby"> & {
  at: [number, number];
  pictures: string[];
  description: Localized<string[]>;
  services?: Localized[];
  hours?: Localized;
  prices?: Localized;
  highlights?: Business["highlights"];
};

const demo = (d: DemoInput): Business => ({
  slug: d.slug,
  kind: "business",
  name: d.name,
  categories: d.categories,
  area: d.area,
  summary: d.summary,
  description: d.description,
  location: { lat: d.at[0], lng: d.at[1], precision: "point", status: "unverified", sources: ["demo-content"] },
  contact: {},
  services: d.services?.map((label) => ({ label, basis: "self-reported" as const })),
  hours: d.hours ? { text: d.hours, basis: "self-reported", asOf: "2026-10" } : undefined,
  prices: d.prices ? { text: d.prices, basis: "self-reported", asOf: "2026-10" } : undefined,
  highlights: d.highlights,
  photos: d.pictures.map(illustration),
  nearby: d.nearby,
  sponsored: false,
  claimed: false,
  verification: { status: "unverified", lastChecked: null, owner: "Editorial team", sources: ["demo-content"], notes: "Demo listing: invented to show how the guide works. Not a real business." },
  translations: DRAFTS,
  origin: { kind: "demo" },
});

const L = (en: string, sq: string, cnr: string): Localized => ({ en, sq, cnr });

export const demoBusinesses: Business[] = [
  /* ------------------------------------------------------------- stay */
  demo({
    slug: "demo-kulla-e-gurit",
    name: "Kulla e Gurit Guesthouse",
    categories: ["guesthouse"],
    area: "gusinje",
    at: [42.5598, 19.8302],
    nearby: ["gusinje", "viziers-mosque"],
    pictures: ["kula-golden", "kula-dusk", "dish-board"],
    summary: L(
      "Rooms in a restored stone tower house, a short walk from the old bazaar.",
      "Dhoma në një kullë guri të restauruar, pak hapa nga çarshia e vjetër.",
      "Sobe u obnovljenoj kamenoj kuli, nadomak stare čaršije.",
    ),
    description: {
      en: ["Four rooms on three floors of a stone kula, with thick walls that keep summers cool.", "Breakfast of homemade cheese, honey and pite is served in the garden when the weather allows."],
      sq: ["Katër dhoma në tre kate të një kulle guri, me mure të trasha që e mbajnë verën të freskët.", "Mëngjesi me djathë shtëpie, mjaltë dhe pite shërbehet në oborr kur e lejon moti."],
      cnr: ["Četiri sobe na tri sprata kamene kule, s debelim zidovima koji ljeti čuvaju svježinu.", "Doručak s domaćim sirom, medom i pitom služi se u bašti kad vrijeme dozvoli."],
    },
    services: [L("Breakfast included", "Mëngjesi i përfshirë", "Doručak uključen"), L("Garden", "Oborr", "Bašta"), L("Free parking", "Parking falas", "Besplatan parking")],
    prices: L("Example: double room from €40 a night", "Shembull: dhomë dyshe nga 40 € nata", "Primjer: dvokrevetna soba od 40 € po noći"),
    highlights: {
      title: L("Rooms", "Dhomat", "Sobe"),
      items: [
        { label: L("Tower room with mountain view", "Dhomë në kullë me pamje nga malet", "Soba u kuli s pogledom na planine"), detail: "€55" },
        { label: L("Double room", "Dhomë dyshe", "Dvokrevetna soba"), detail: "€40" },
        { label: L("Family room (4)", "Dhomë familjare (4)", "Porodična soba (4)"), detail: "€70" },
      ],
    },
  }),
  demo({
    slug: "demo-hotel-alpinist",
    name: "Hotel Alpinist",
    categories: ["hotel"],
    area: "gusinje",
    at: [42.5641, 19.8381],
    nearby: ["gusinje"],
    pictures: ["guesthouse-day", "terrace-golden"],
    summary: L(
      "A small hotel for hikers: early breakfast, packed lunches and a drying room for boots.",
      "Një hotel i vogël për alpinistët: mëngjes herët, drekë për rrugë dhe dhomë për tharjen e këpucëve.",
      "Mali hotel za planinare: rani doručak, lanč paketi i prostorija za sušenje cipela.",
    ),
    description: {
      en: ["Twelve rooms, a restaurant on the ground floor and a map wall with the valley's routes.", "Staff can arrange transfers to Vusanje and Grbaja trailheads."],
      sq: ["Dymbëdhjetë dhoma, restorant në katin përdhes dhe një mur me hartën e shtigjeve të luginës.", "Stafi mund të organizojë transferta deri te fillimet e shtigjeve në Vuthaj dhe Gërbajë."],
      cnr: ["Dvanaest soba, restoran u prizemlju i zid s mapom staza u dolini.", "Osoblje može organizovati prevoz do polazišta staza u Vusanju i Grbaji."],
    },
    services: [L("Breakfast from 6:00", "Mëngjes nga ora 6:00", "Doručak od 6:00"), L("Packed lunches", "Drekë për rrugë", "Lanč paketi"), L("Boot drying room", "Dhomë për tharjen e këpucëve", "Prostorija za sušenje obuće")],
    prices: L("Example: double room from €55 a night", "Shembull: dhomë dyshe nga 55 € nata", "Primjer: dvokrevetna soba od 55 € po noći"),
  }),
  demo({
    slug: "demo-vruja-riverside-rooms",
    name: "Vruja Riverside Rooms",
    categories: ["guesthouse"],
    area: "gusinje",
    at: [42.5512, 19.8268],
    nearby: ["ali-pashas-springs"],
    pictures: ["guesthouse-dusk"],
    summary: L(
      "Quiet rooms by the river, a few minutes' walk from Ali Pasha's Springs.",
      "Dhoma të qeta pranë lumit, disa minuta në këmbë nga Krojet e Ali Pashës.",
      "Mirne sobe pored rijeke, nekoliko minuta hoda od Alipašinih izvora.",
    ),
    description: {
      en: ["Five rooms with balconies over the water, and a shared kitchen for longer stays."],
      sq: ["Pesë dhoma me ballkone mbi ujë dhe një kuzhinë e përbashkët për qëndrime më të gjata."],
      cnr: ["Pet soba s balkonima iznad vode i zajednička kuhinja za duže boravke."],
    },
    services: [L("Shared kitchen", "Kuzhinë e përbashkët", "Zajednička kuhinja"), L("Balconies", "Ballkone", "Balkoni")],
    prices: L("Example: room from €35 a night", "Shembull: dhomë nga 35 € nata", "Primjer: soba od 35 € po noći"),
  }),
  demo({
    slug: "demo-bjeshka-cabins",
    name: "Bjeshka Wooden Cabins",
    categories: ["cabin"],
    area: "vusanje",
    at: [42.5272, 19.8381],
    nearby: ["vusanje", "oko-skakavice"],
    pictures: ["katun-dawn", "guesthouse-day"],
    summary: L(
      "Wooden cabins at the edge of Vusanje, with a wood stove and a terrace each.",
      "Kabina druri në skaj të Vuthajve, secila me sobë druri dhe tarracë.",
      "Drvene brvnare na ivici Vusanja, svaka s pećkom na drva i terasom.",
    ),
    description: {
      en: ["Six cabins for two to four people. Oko Skakavice is a short walk away; the Ropojana valley begins up the road."],
      sq: ["Gjashtë kabina për dy deri në katër persona. Syri i Skakavicës është pak larg në këmbë; lugina e Ropojanës fillon më lart."],
      cnr: ["Šest brvnara za dvije do četiri osobe. Oko Skakavice je nadomak; dolina Ropojane počinje uz put."],
    },
    services: [L("Wood stove", "Sobë druri", "Peć na drva"), L("Private terrace", "Tarracë private", "Privatna terasa"), L("Breakfast on request", "Mëngjes me kërkesë", "Doručak na zahtjev")],
    prices: L("Example: cabin for two from €45 a night", "Shembull: kabinë për dy nga 45 € nata", "Primjer: brvnara za dvoje od 45 € po noći"),
  }),
  demo({
    slug: "demo-shtepia-e-bletes",
    name: "Shtëpia e Bletës B&B",
    categories: ["guesthouse"],
    area: "vusanje",
    at: [42.5311, 19.8429],
    nearby: ["vusanje", "grlja"],
    pictures: ["guesthouse-day", "shop-day"],
    summary: L(
      "A family B&B with its own beehives — honey at breakfast and a walk to Grlja.",
      "Një B&B familjar me koshere të veta — mjaltë në mëngjes dhe një shëtitje deri te Grlja.",
      "Porodični B&B sa sopstvenim košnicama — med za doručkom i šetnja do Grlje.",
    ),
    description: {
      en: ["Three rooms in a family house; the hosts keep bees in the meadow behind it."],
      sq: ["Tri dhoma në një shtëpi familjare; mikpritësit mbajnë bletë në livadhin prapa saj."],
      cnr: ["Tri sobe u porodičnoj kući; domaćini drže pčele na livadi iza nje."],
    },
    services: [L("Breakfast included", "Mëngjesi i përfshirë", "Doručak uključen"), L("Honey for sale", "Mjaltë në shitje", "Med na prodaju")],
    prices: L("Example: double room from €38 a night", "Shembull: dhomë dyshe nga 38 € nata", "Primjer: dvokrevetna soba od 38 € po noći"),
  }),
  demo({
    slug: "demo-katun-lisa",
    name: "Katun Lisa",
    categories: ["cabin"],
    area: "grbaja",
    at: [42.5121, 19.7959],
    nearby: ["grbaja", "karanfili"],
    pictures: ["katun-day", "dish-board"],
    summary: L(
      "Summer huts in the Grbaja valley under Karanfili — open while the herds are up.",
      "Kasolle verore në luginën e Gërbajës nën Karanfil — të hapura sa janë bagëtitë në bjeshkë.",
      "Ljetnje kolibe u dolini Grbaje ispod Karanfila — otvorene dok je stoka na ispaši.",
    ),
    description: {
      en: ["Simple wooden huts, a shared washroom and dinner from the katun kitchen: cheese, kaçamak and lamb."],
      sq: ["Kasolle të thjeshta druri, banjë e përbashkët dhe darkë nga kuzhina e katunit: djathë, kaçamak dhe mish qengji."],
      cnr: ["Jednostavne drvene kolibe, zajedničko kupatilo i večera iz katunske kuhinje: sir, kačamak i jagnjetina."],
    },
    services: [L("Half board", "Gjysmë pension", "Polupansion"), L("Shared washroom", "Banjë e përbashkët", "Zajedničko kupatilo")],
    hours: L("Example season: June to September", "Shembull sezoni: qershor–shtator", "Primjer sezone: jun–septembar"),
    prices: L("Example: €30 per person with dinner", "Shembull: 30 € për person me darkë", "Primjer: 30 € po osobi s večerom"),
  }),
  demo({
    slug: "demo-ropojana-camp",
    name: "Ropojana Camp",
    categories: ["campsite"],
    area: "ropojana",
    at: [42.5068, 19.8215],
    nearby: ["ropojana", "vusanje"],
    pictures: ["camp-night"],
    summary: L(
      "Tent pitches and rented tents at the mouth of the Ropojana valley.",
      "Vende për tenda dhe tenda me qira në hyrje të luginës së Ropojanës.",
      "Mjesta za šatore i šatori za iznajmljivanje na ulazu u dolinu Ropojane.",
    ),
    description: {
      en: ["A meadow with fresh water, a fire pit and toilets. Bring warm layers: nights are cold even in August."],
      sq: ["Një livadh me ujë të freskët, vatër zjarri dhe tualete. Merrni rroba të ngrohta: netët janë të ftohta edhe në gusht."],
      cnr: ["Livada s pitkom vodom, ognjištem i toaletima. Ponesite toplu odjeću: noći su hladne i u avgustu."],
    },
    services: [L("Tents for rent", "Tenda me qira", "Šatori za iznajmljivanje"), L("Fire pit", "Vatër zjarri", "Ognjište"), L("Drinking water", "Ujë i pijshëm", "Pitka voda")],
    prices: L("Example: pitch from €8 per person", "Shembull: vend nga 8 € për person", "Primjer: mjesto od 8 € po osobi"),
  }),
  demo({
    slug: "demo-meadow-lodge",
    name: "Meadow Lodge",
    categories: ["guesthouse"],
    area: "gusinje",
    at: [42.5531, 19.8392],
    nearby: ["gusinje", "ali-pashas-springs"],
    pictures: ["valley-golden", "guesthouse-dusk"],
    summary: L(
      "Apartments among hay meadows between Gusinje and the springs.",
      "Apartamente mes livadheve me bar midis Gucisë dhe burimeve.",
      "Apartmani među livadama između Gusinja i izvora.",
    ),
    description: {
      en: ["Two apartments with kitchens and a garden with views of the whole range."],
      sq: ["Dy apartamente me kuzhinë dhe një oborr me pamje nga i gjithë vargu malor."],
      cnr: ["Dva apartmana s kuhinjom i baštom s pogledom na cijeli masiv."],
    },
    services: [L("Kitchen", "Kuzhinë", "Kuhinja"), L("Garden", "Oborr", "Bašta")],
    prices: L("Example: apartment from €50 a night", "Shembull: apartament nga 50 € nata", "Primjer: apartman od 50 € po noći"),
  }),

  /* ------------------------------------------------------- eat & drink */
  demo({
    slug: "demo-restaurant-te-ujevara",
    name: "Restaurant te Ujëvara",
    categories: ["restaurant"],
    area: "vusanje",
    at: [42.5241, 19.8438],
    nearby: ["grlja", "vusanje"],
    pictures: ["terrace-dusk", "dish-flija", "dish-trout"],
    summary: L(
      "Mountain cooking on a terrace above the Grlja gorge: flija, trout and lamb.",
      "Gatime malore në një tarracë mbi grykën e Grlës: fli, troftë dhe mish qengji.",
      "Planinska kuhinja na terasi iznad kanjona Grlje: flija, pastrmka i jagnjetina.",
    ),
    description: {
      en: ["Flija is baked slowly in layers under a lid heaped with embers — order it ahead for a group.", "Trout comes from the springs below the village."],
      sq: ["Flia piqet ngadalë shtresë pas shtrese nën saç me prush — porositni më herët për grup.", "Trofta vjen nga burimet poshtë fshatit."],
      cnr: ["Flija se peče polako, sloj po sloj, pod sačem s žarom — za grupu je naručite unaprijed.", "Pastrmka je iz izvora ispod sela."],
    },
    hours: L("Example hours: every day 10:00–22:00", "Shembull orari: çdo ditë 10:00–22:00", "Primjer radnog vremena: svaki dan 10:00–22:00"),
    highlights: {
      title: L("On the menu", "Në meny", "Na meniju"),
      items: [
        { label: L("Flija with sour cream (for 4)", "Fli me kos (për 4)", "Flija s kiselim mlijekom (za 4)"), detail: "€20" },
        { label: L("Grilled river trout", "Troftë lumi në skarë", "Pastrmka sa žara"), detail: "€11" },
        { label: L("Lamb under the sač", "Qengj nën saç", "Jagnjetina ispod sača"), detail: "€14" },
        { label: L("Kaçamak with cheese", "Kaçamak me djathë", "Kačamak sa sirom"), detail: "€6" },
      ],
    },
  }),
  demo({
    slug: "demo-mountain-tavern-stani",
    name: "Mountain Tavern Stani",
    categories: ["restaurant"],
    area: "grbaja",
    at: [42.5098, 19.7902],
    nearby: ["grbaja"],
    pictures: ["katun-day", "dish-board"],
    summary: L(
      "A shepherds' tavern at the head of the Grbaja valley — cheese, bread and soup after the climb.",
      "Një tavernë barinjsh në krye të luginës së Gërbajës — djathë, bukë dhe supë pas ngjitjes.",
      "Čobanska krčma na kraju doline Grbaje — sir, hljeb i čorba poslije uspona.",
    ),
    description: {
      en: ["Long wooden tables, food from the katun and a view straight up to Karanfili."],
      sq: ["Tavolina të gjata druri, ushqim nga katuni dhe pamje drejt e në Karanfil."],
      cnr: ["Dugi drveni stolovi, hrana iz katuna i pogled pravo na Karanfile."],
    },
    hours: L("Example season: May to October", "Shembull sezoni: maj–tetor", "Primjer sezone: maj–oktobar"),
    highlights: {
      title: L("On the menu", "Në meny", "Na meniju"),
      items: [
        { label: L("Katun cheese board", "Pjatë me djathë katuni", "Daska katunskih sireva"), detail: "€8" },
        { label: L("Lamb soup", "Supë qengji", "Jagnjeća čorba"), detail: "€5" },
        { label: L("Homemade bread and kajmak", "Bukë shtëpie me kajmak", "Domaći hljeb i kajmak"), detail: "€4" },
      ],
    },
  }),
  demo({
    slug: "demo-trout-house-vruja",
    name: "Trout House Vruja",
    categories: ["restaurant"],
    area: "gusinje",
    at: [42.5486, 19.8263],
    nearby: ["ali-pashas-springs"],
    pictures: ["dish-trout", "terrace-golden"],
    summary: L(
      "Fresh trout by the springs south of Gusinje, grilled or baked.",
      "Troftë e freskët pranë burimeve në jug të Gucisë, në skarë ose në furrë.",
      "Svježa pastrmka kod izvora južno od Gusinja, sa žara ili iz rerne.",
    ),
    description: {
      en: ["Tables under the trees by the water; children can watch the fish ponds."],
      sq: ["Tavolina nën pemë pranë ujit; fëmijët mund të shohin pellgjet me peshq."],
      cnr: ["Stolovi ispod drveća kraj vode; djeca mogu gledati ribnjake."],
    },
    hours: L("Example hours: 11:00–21:00, closed Mondays", "Shembull orari: 11:00–21:00, e hënë mbyllur", "Primjer radnog vremena: 11:00–21:00, ponedjeljkom zatvoreno"),
    highlights: {
      title: L("On the menu", "Në meny", "Na meniju"),
      items: [
        { label: L("Trout from the grill", "Troftë në skarë", "Pastrmka sa roštilja"), detail: "€10" },
        { label: L("Baked trout with potatoes", "Troftë në furrë me patate", "Pastrmka iz rerne s krompirom"), detail: "€12" },
        { label: L("Seasonal salad", "Sallatë stinore", "Sezonska salata"), detail: "€4" },
      ],
    },
  }),
  demo({
    slug: "demo-cafe-carshia",
    name: "Café Çarshia",
    categories: ["cafe"],
    area: "gusinje",
    at: [42.5627, 19.8352],
    nearby: ["gusinje", "viziers-mosque"],
    pictures: ["coffee-day", "coffee-dawn"],
    summary: L(
      "Coffee in a copper pot and sweets on the old bazaar street.",
      "Kafe në xhezve bakri dhe ëmbëlsira në rrugën e çarshisë së vjetër.",
      "Kafa iz bakrene džezve i kolači u ulici stare čaršije.",
    ),
    description: {
      en: ["Morning coffee with the town; in the evening, tea and baklava on the street terrace."],
      sq: ["Kafja e mëngjesit me qytetin; në mbrëmje çaj dhe bakllava në tarracën e rrugës."],
      cnr: ["Jutarnja kafa s gradom; uveče čaj i baklava na terasi u ulici."],
    },
    hours: L("Example hours: 7:00–23:00", "Shembull orari: 7:00–23:00", "Primjer radnog vremena: 7:00–23:00"),
    highlights: {
      title: L("On the menu", "Në meny", "Na meniju"),
      items: [
        { label: L("Coffee in a džezva", "Kafe në xhezve", "Kafa iz džezve"), detail: "€1.50" },
        { label: L("Baklava", "Bakllava", "Baklava"), detail: "€2" },
        { label: L("Mountain tea", "Çaj mali", "Planinski čaj"), detail: "€1.50" },
      ],
    },
  }),
  demo({
    slug: "demo-bakery-lule",
    name: "Bakery Lule",
    categories: ["cafe"],
    area: "gusinje",
    at: [42.5609, 19.8364],
    nearby: ["gusinje"],
    pictures: ["dish-burek"],
    summary: L(
      "Burek and pite from early morning — the hikers' breakfast stop.",
      "Byrek dhe pite që nga mëngjesi herët — ndalesa e mëngjesit për alpinistët.",
      "Burek i pita od ranog jutra — doručak za planinare.",
    ),
    description: {
      en: ["Cheese, meat and spinach burek by weight, yoghurt to go, and bread for the trail."],
      sq: ["Byrek me djathë, mish dhe spinaq me peshë, kos për rrugë dhe bukë për shtegun."],
      cnr: ["Burek sa sirom, mesom i zeljem na vagu, jogurt za ponijeti i hljeb za stazu."],
    },
    hours: L("Example hours: 5:30–14:00", "Shembull orari: 5:30–14:00", "Primjer radnog vremena: 5:30–14:00"),
  }),
  demo({
    slug: "demo-katun-kitchen",
    name: "Katun Kitchen",
    categories: ["restaurant"],
    area: "vusanje",
    at: [42.5262, 19.8452],
    nearby: ["vusanje", "grlja"],
    pictures: ["dish-flija", "katun-dawn"],
    summary: L(
      "Home cooking in Vusanje: what the family made today, served at one long table.",
      "Gatim shtëpie në Vuthaj: çfarë gatoi familja sot, e shërbyer në një tavolinë të gjatë.",
      "Domaća kuhinja u Vusanju: ono što je porodica danas skuvala, za jednim dugim stolom.",
    ),
    description: {
      en: ["No menu — dinner is set at seven and changes daily. Tell the hosts by noon if you're coming."],
      sq: ["Pa meny — darka shtrohet në orën shtatë dhe ndryshon çdo ditë. Lajmëroni mikpritësit deri në mesditë."],
      cnr: ["Bez menija — večera je u sedam i mijenja se svaki dan. Javite domaćinima do podneva."],
    },
    prices: L("Example: dinner €15 per person", "Shembull: darka 15 € për person", "Primjer: večera 15 € po osobi"),
  }),
  demo({
    slug: "demo-honey-cheese-bjeshka",
    name: "Bjeshka Honey & Cheese",
    categories: ["shop"],
    area: "vusanje",
    at: [42.5302, 19.839],
    nearby: ["vusanje"],
    pictures: ["shop-day", "dish-board"],
    summary: L(
      "Mountain honey, katun cheese and dried herbs from the valley's farms.",
      "Mjaltë mali, djathë katuni dhe bimë të thata nga fermat e luginës.",
      "Planinski med, katunski sir i suvo bilje sa farmi iz doline.",
    ),
    description: {
      en: ["A farm shop in a wooden barn. Taste before you buy."],
      sq: ["Një dyqan ferme në një hambar druri. Provoni para se të blini."],
      cnr: ["Prodavnica na farmi u drvenoj štali. Probajte prije kupovine."],
    },
    hours: L("Example hours: 9:00–19:00", "Shembull orari: 9:00–19:00", "Primjer radnog vremena: 9:00–19:00"),
  }),

  /* -------------------------------------------- guides and experiences */
  demo({
    slug: "demo-bjeshka-guides",
    name: "Bjeshka Mountain Guides",
    categories: ["guide"],
    area: "gusinje",
    at: [42.5612, 19.8347],
    nearby: ["gusinje", "karanfili", "zla-kolata"],
    pictures: ["guide-dawn", "guide-golden"],
    summary: L(
      "Day hikes and summits with licensed mountain guides — Volušnica, Talijanka, Zla Kolata.",
      "Ecje njëditore dhe maja me udhërrëfyes malor të licencuar — Volushnica, Talijanka, Kollata e Keqe.",
      "Jednodnevne ture i vrhovi s licenciranim planinskim vodičima — Volušnica, Talijanka, Zla Kolata.",
    ),
    description: {
      en: ["Small groups, guides who speak Albanian, Montenegrin, English and German, and the right route for the weather on the day."],
      sq: ["Grupe të vogla, udhërrëfyes që flasin shqip, malazezisht, anglisht dhe gjermanisht, dhe shtegu i duhur për motin e ditës."],
      cnr: ["Male grupe, vodiči koji govore albanski, crnogorski, engleski i njemački, i prava staza za vrijeme tog dana."],
    },
    highlights: {
      title: L("Tours", "Turet", "Ture"),
      items: [
        { label: L("Volušnica from Grbaja (full day)", "Volushnica nga Gërbaja (ditë e plotë)", "Volušnica iz Grbaje (cijeli dan)"), detail: "€60" },
        { label: L("Zla Kolata summit (long day)", "Maja e Kollatës së Keqe (ditë e gjatë)", "Vrh Zle Kolate (dug dan)"), detail: "€90" },
        { label: L("Ropojana valley walk (half day)", "Ecje në luginën e Ropojanës (gjysmë dite)", "Šetnja dolinom Ropojane (pola dana)"), detail: "€35" },
      ],
    },
    prices: L("Example: prices per person, groups of 4–8", "Shembull: çmime për person, grupe 4–8", "Primjer: cijene po osobi, grupe 4–8"),
  }),
  demo({
    slug: "demo-ropojana-horse-trails",
    name: "Ropojana Horse Trails",
    categories: ["activity"],
    area: "vusanje",
    at: [42.5208, 19.8338],
    nearby: ["ropojana", "vusanje"],
    pictures: ["valley-golden"],
    summary: L(
      "Gentle rides up the Ropojana valley on mountain horses — no experience needed.",
      "Shëtitje të qeta me kuaj malorë në luginën e Ropojanës — pa nevojë për përvojë.",
      "Mirno jahanje dolinom Ropojane na planinskim konjima — iskustvo nije potrebno.",
    ),
    description: {
      en: ["Two- and four-hour rides with a local horseman, helmets provided."],
      sq: ["Shëtitje dy dhe katër orëshe me një kalorës vendas, me helmeta."],
      cnr: ["Jahanje od dva i četiri sata s lokalnim konjušarem, kacige obezbijeđene."],
    },
    prices: L("Example: 2 hours €30 per person", "Shembull: 2 orë 30 € për person", "Primjer: 2 sata 30 € po osobi"),
  }),
  demo({
    slug: "demo-valley-bike-rental",
    name: "Valley Bike Rental",
    categories: ["rental"],
    area: "gusinje",
    at: [42.5633, 19.8327],
    nearby: ["gusinje", "ali-pashas-springs"],
    pictures: ["valley-winter"],
    summary: L(
      "E-bikes and mountain bikes for the springs, Vusanje and Plav lake.",
      "Biçikleta elektrike dhe malore për burimet, Vuthajt dhe liqenin e Plavës.",
      "Električni i brdski bicikli za izvore, Vusanje i Plavsko jezero.",
    ),
    description: {
      en: ["Helmets, locks and a route card in three languages with every bike."],
      sq: ["Helmetë, dry dhe kartë shtegu në tri gjuhë me çdo biçikletë."],
      cnr: ["Kaciga, katanac i karta rute na tri jezika uz svaki bicikl."],
    },
    prices: L("Example: e-bike €25 a day", "Shembull: biçikletë elektrike 25 € në ditë", "Primjer: električni bicikl 25 € dnevno"),
  }),
];

/* ------------------------------------------------------------------ events */

export type DemoEvent = { slug: string; title: Localized; when: Localized; where: Localized; text: Localized; picture: string };

export const demoEvents: DemoEvent[] = [
  {
    slug: "summer-festival",
    title: L("Summer festival in Gusinje", "Festivali i verës në Guci", "Ljetnji festival u Gusinju"),
    when: L("Example: first week of August", "Shembull: java e parë e gushtit", "Primjer: prva sedmica avgusta"),
    where: L("Gusinje, town centre", "Gucia, qendra", "Gusinje, centar grada"),
    text: L("Music, dance and food on the square, when families who live abroad come home for the summer.", "Muzikë, valle dhe ushqim në shesh, kur familjet që jetojnë jashtë kthehen për verë.", "Muzika, igra i hrana na trgu, kad se porodice iz inostranstva vrate za ljeto."),
    picture: "terrace-dusk",
  },
  {
    slug: "katun-cheese-day",
    title: L("Katun cheese day", "Dita e djathit të katunit", "Dan katunskog sira"),
    when: L("Example: mid-September", "Shembull: mesi i shtatorit", "Primjer: sredina septembra"),
    where: L("Grbaja valley", "Lugina e Gërbajës", "Dolina Grbaje"),
    text: L("Herders bring down the summer's cheese; tastings, music and a walk among the katuns.", "Barinjtë sjellin djathin e verës; shijime, muzikë dhe ecje mes katuneve.", "Čobani donose ljetnji sir; degustacije, muzika i šetnja među katunima."),
    picture: "katun-day",
  },
  {
    slug: "springs-clean-up",
    title: L("Springs clean-up morning", "Mëngjes pastrimi te burimet", "Jutro čišćenja izvora"),
    when: L("Example: a Saturday in May", "Shembull: një e shtunë në maj", "Primjer: jedna subota u maju"),
    where: L("Ali Pasha's Springs", "Krojet e Ali Pashës", "Alipašini izvori"),
    text: L("Volunteers tidy the paths before the season; coffee and burek for everyone who helps.", "Vullnetarët pastrojnë shtigjet para sezonit; kafe dhe byrek për këdo që ndihmon.", "Volonteri čiste staze prije sezone; kafa i burek za sve koji pomognu."),
    picture: "waterfall-day",
  },
  {
    slug: "trail-run",
    title: L("Valley trail run", "Vrapim në shtegun e luginës", "Trka dolinom"),
    when: L("Example: late June", "Shembull: fundi i qershorit", "Primjer: kraj juna"),
    where: L("Gusinje to Vusanje", "Nga Gucia në Vuthaj", "Od Gusinja do Vusanja"),
    text: L("Short and long courses from the town up to the waterfalls, with a family walk alongside.", "Shtigje të shkurtra dhe të gjata nga qyteti deri te ujëvarat, me një shëtitje familjare krahas.", "Kratka i duga staza od grada do vodopada, uz porodičnu šetnju."),
    picture: "guide-golden",
  },
];
