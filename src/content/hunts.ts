/**
 * Treasure hunts: clues that lead to real places of the guide. Every clue is
 * written from facts already on the place's page (its summary, highlights or
 * description) — nothing is invented for the game. Finding a place means
 * standing there ("I'm here", checked on the visitor's device) or marking it
 * by hand; see src/lib/passport.ts.
 */

import type { MapIcon } from "@/components/map/icons";

import type { Localized, TranslationStatus } from "./types";

export type HuntClue = { place: string; clue: Localized };

export type Hunt = {
  slug: string;
  title: Localized;
  tagline: Localized;
  intro: Localized;
  icon: MapIcon;
  clues: HuntClue[];
  translations: TranslationStatus;
};

const DRAFTS: TranslationStatus = { sq: "unreviewed", cnr: "unreviewed" };

export const hunts: Hunt[] = [
  {
    slug: "waters-of-the-valley",
    icon: "drop",
    title: { en: "Waters of the valley", sq: "Ujërat e luginës", cnr: "Vode doline" },
    tagline: { en: "Springs, falls and a lake that disappears", sq: "Burime, ujëvara dhe një liqen që zhduket", cnr: "Izvori, vodopadi i jezero koje nestaje" },
    intro: {
      en: "Cold karst water shapes this valley. Five clues lead you from an easy pool near town to a lake that is a meadow by September.",
      sq: "Uji i ftohtë karstik e ka formuar këtë luginë. Pesë të dhëna ju çojnë nga një pellg i lehtë pranë qytetit deri te një liqen që në shtator është livadh.",
      cnr: "Hladna kraška voda oblikuje ovu dolinu. Pet tragova vodi vas od lako dostupnog jezerca kod grada do jezera koje je do septembra livada.",
    },
    clues: [
      {
        place: "ali-pashas-springs",
        clue: {
          en: "Cold water rises from many mouths into one broad, clear pool, about two kilometres south of town. An easy walk — but find where the water begins.",
          sq: "Ujë i ftohtë del nga shumë gojë në një pellg të gjerë e të kthjellët, rreth dy kilometra në jug të qytetit. Një shëtitje e lehtë — por gjeni ku nis uji.",
          cnr: "Hladna voda izvire iz mnogih usta u jedno široko, bistro jezerce, oko dva kilometra južno od grada. Laka šetnja — ali pronađite gdje voda počinje.",
        },
      },
      {
        place: "grlja",
        clue: {
          en: "On the edge of a village, a river drops about fifteen metres into a canyon so narrow that only roped, experienced groups go in. Stand at the edge and look down.",
          sq: "Në skaj të një fshati, një lumë bie rreth pesëmbëdhjetë metra në një kanion aq të ngushtë sa hyjnë vetëm grupe me litar e përvojë. Qëndroni në skaj dhe shikoni poshtë.",
          cnr: "Na rubu jednog sela rijeka pada oko petnaest metara u kanjon toliko uzak da u njega ulaze samo iskusne grupe s užadima. Stanite na rub i pogledajte dolje.",
        },
      },
      {
        place: "oko-skakavice",
        clue: {
          en: "Walk on from the waterfall, about a kilometre and a half, to the valley's clear 'eye': a spring pool above the village.",
          sq: "Vazhdoni nga ujëvara, rreth një kilometër e gjysmë, deri te 'syri' i kthjellët i luginës: një pellg burimi mbi fshat.",
          cnr: "Nastavite od vodopada, oko kilometar i po, do bistrog 'oka' doline: izvorskog jezerca iznad sela.",
        },
      },
      {
        place: "ropojana",
        clue: {
          en: "A long glacial trench runs south to the border between limestone walls. At its head lies a lake that fills in early summer and is a meadow by August or September.",
          sq: "Një luginë e gjatë akullnajore shkon në jug deri në kufi, mes mureve gëlqerore. Në krye të saj shtrihet një liqen që mbushet në fillim të verës dhe në gusht a shtator është livadh.",
          cnr: "Dugačka ledenička dolina pruža se na jug do granice, između krečnjačkih zidova. Na njenom kraju leži jezero koje se puni početkom ljeta, a do avgusta ili septembra je livada.",
        },
      },
      {
        place: "kusija-waterfall",
        clue: {
          en: "The village has a second, shyer waterfall: unlike its famous neighbour, which falls all year, this one runs dry at one point in the year.",
          sq: "Fshati ka edhe një ujëvarë të dytë, më të turpshme: ndryshe nga fqinja e saj e famshme, që bie gjithë vitin, kjo thahet në një kohë të vitit.",
          cnr: "Selo ima i drugi, stidljiviji vodopad: za razliku od slavnog susjeda, koji pada cijele godine, ovaj u jednom trenutku godine presuši.",
        },
      },
    ],
    translations: DRAFTS,
  },
  {
    slug: "summit-seeker",
    icon: "mountain",
    title: { en: "Summit seeker", sq: "Kërkuesi i majave", cnr: "Tragač za vrhovima" },
    tagline: { en: "The high walls of the Prokletije", sq: "Muret e larta të Bjeshkëve të Nemuna", cnr: "Visoki zidovi Prokletija" },
    intro: {
      en: "Five clues to the peaks that frame the valley — some seen from the valley floor, some earned on a long mountain day. Check conditions locally before any climb.",
      sq: "Pesë të dhëna për majat që rrethojnë luginën — disa shihen nga fundi i luginës, disa fitohen me një ditë të gjatë mali. Kontrolloni kushtet në vend para çdo ngjitjeje.",
      cnr: "Pet tragova do vrhova koji uokviruju dolinu — neki se vide s dna doline, neki se zaslužuju dugim planinskim danom. Provjerite uslove na licu mjesta prije svakog uspona.",
    },
    clues: [
      {
        place: "karanfili",
        clue: {
          en: "A row of jagged limestone teeth rises above a green valley. Best admired from the valley floor, or from the summit across from it.",
          sq: "Një varg dhëmbësh gëlqerorë të thepisur ngrihet mbi një luginë të gjelbër. Admirohet më mirë nga fundi i luginës, ose nga maja përballë.",
          cnr: "Niz nazubljenih krečnjačkih zuba uzdiže se iznad zelene doline. Najbolje se divi s dna doline, ili s vrha preko puta.",
        },
      },
      {
        place: "volusnica",
        clue: {
          en: "At 1,879 metres the whole wall of Karanfili faces you. A classic day's walk from the Grbaja valley.",
          sq: "Në 1.879 metra, gjithë muri i Karanfilit ju qëndron përballë. Një shëtitje klasike një-ditore nga lugina e Gërbajës.",
          cnr: "Na 1.879 metara cijeli zid Karanfila stoji pred vama. Klasična jednodnevna šetnja iz doline Grbaje.",
        },
      },
      {
        place: "zla-kolata",
        clue: {
          en: "The roof of Montenegro stands on the border with Albania, about ten kilometres south of town — a long, demanding day from Vusanje.",
          sq: "Çatia e Malit të Zi qëndron në kufi me Shqipërinë, rreth dhjetë kilometra në jug të qytetit — një ditë e gjatë e kërkuese nga Vuthaj.",
          cnr: "Krov Crne Gore stoji na granici s Albanijom, oko deset kilometara južno od grada — dug, zahtjevan dan iz Vusanja.",
        },
      },
      {
        place: "rosni-vrh",
        clue: {
          en: "The top of the Bjelič massif, about 2,524 metres and described as the third highest in the country, usually approached from Gusinje through Grbaja.",
          sq: "Kreu i masivit të Beliçit, rreth 2.524 metra dhe i përshkruar si i treti më i lartë në vend, zakonisht i afrohesh nga Gucia përmes Gërbajës.",
          cnr: "Vrh masiva Bjelič, oko 2.524 metra i opisan kao treći najviši u zemlji, obično se prilazi iz Gusinja preko Grbaje.",
        },
      },
      {
        place: "talijanka-popadija",
        clue: {
          en: "Two summits above Grbaja on the Albanian border, joined with Volušnica in one themed hike by the tourism organisation.",
          sq: "Dy maja mbi Gërbajë, në kufi me Shqipërinë, të lidhura me Volushnicën në një ecje tematike të organizatës turistike.",
          cnr: "Dva vrha iznad Grbaje na granici s Albanijom, povezana s Volušnicom u jednu tematsku šetnju turističke organizacije.",
        },
      },
    ],
    translations: DRAFTS,
  },
  {
    slug: "stories-of-the-valley",
    icon: "landmark",
    title: { en: "Stories of the valley", sq: "Rrëfimet e luginës", cnr: "Priče doline" },
    tagline: { en: "Town, villages and old stones", sq: "Qyteti, fshatrat dhe gurët e vjetër", cnr: "Grad, sela i staro kamenje" },
    intro: {
      en: "Five clues to the places where people live and have always lived: a town where two valleys begin, a village at a waterfall, a street with three faiths.",
      sq: "Pesë të dhëna për vendet ku njerëzit jetojnë dhe kanë jetuar gjithmonë: një qytet ku nisin dy lugina, një fshat te një ujëvarë, një rrugë me tri fe.",
      cnr: "Pet tragova do mjesta gdje ljudi žive i oduvijek su živjeli: grad gdje počinju dvije doline, selo kod vodopada, ulica s tri vjere.",
    },
    clues: [
      {
        place: "gusinje",
        clue: {
          en: "The small town where the valleys begin: the road south and the way west both start here, and a mosque shares the central street with two churches.",
          sq: "Qyteti i vogël ku nisin luginat: rruga në jug dhe ajo në perëndim nisin të dyja këtu, dhe një xhami ndan rrugën qendrore me dy kisha.",
          cnr: "Gradić u kojem počinju doline: put na jug i put na zapad počinju ovdje, a džamija dijeli glavnu ulicu s dvije crkve.",
        },
      },
      {
        place: "viziers-mosque",
        clue: {
          en: "The oldest mosque still standing in town, protected by law, on the central street with the churches of St. Đorđe and St. Anton for neighbours.",
          sq: "Xhamia më e vjetër që qëndron ende në qytet, e mbrojtur me ligj, në rrugën qendrore me kishat e Shën Gjergjit dhe Shën Antonit për fqinjë.",
          cnr: "Najstarija sačuvana džamija u gradu, zaštićena zakonom, u glavnoj ulici sa crkvama Sv. Đorđa i Sv. Antona za susjede.",
        },
      },
      {
        place: "vusanje",
        clue: {
          en: "A mountain village about 4.5 kilometres south of town, with a waterfall on its edge and the start of the Peaks of the Balkans stage to Theth.",
          sq: "Një fshat malor rreth 4,5 kilometra në jug të qytetit, me një ujëvarë në skaj dhe nisjen e etapës së Majave të Ballkanit për në Theth.",
          cnr: "Planinsko selo oko 4,5 kilometra južno od grada, s vodopadom na rubu i početkom etape Vrhova Balkana ka Thethu.",
        },
      },
      {
        place: "grbaja",
        clue: {
          en: "A green valley about seven kilometres from town under the walls of Karanfili, inside the national park — where the classic day hikes begin.",
          sq: "Një luginë e gjelbër rreth shtatë kilometra nga qyteti nën muret e Karanfilit, brenda parkut kombëtar — ku nisin ecjet klasike një-ditore.",
          cnr: "Zelena dolina oko sedam kilometara od grada pod zidovima Karanfila, unutar nacionalnog parka — gdje počinju klasične jednodnevne ture.",
        },
      },
      {
        place: "grncar-valley",
        clue: {
          en: "Follow the river that comes from Albania to the place where it meets the Vruja at the town and takes a new name, the Ljuča.",
          sq: "Ndiqni lumin që vjen nga Shqipëria deri aty ku takohet me Vrujën te qyteti dhe merr një emër të ri, Lluçën.",
          cnr: "Pratite rijeku koja dolazi iz Albanije do mjesta gdje se kod grada spaja s Vrujom i dobija novo ime, Ljuča.",
        },
      },
    ],
    translations: DRAFTS,
  },
  {
    slug: "hidden-gems",
    icon: "lake",
    title: { en: "Hidden gems", sq: "Perlat e fshehura", cnr: "Skriveni dragulji" },
    tagline: { en: "Lesser-known places worth the detour", sq: "Vende më pak të njohura që ia vlejnë devijimin", cnr: "Manje poznata mjesta vrijedna zaobilaska" },
    intro: {
      en: "Three lakes around Plav and Visitor. None has a verified map position yet, so these are found the old way — and marked by hand once you've been.",
      sq: "Tre liqene rreth Plavës dhe Visitorit. Asnjëri nuk ka ende pozicion të verifikuar në hartë, prandaj gjenden në mënyrën e vjetër — dhe shënohen me dorë kur të keni qenë.",
      cnr: "Tri jezera oko Plava i Visitora. Nijedno još nema provjerenu poziciju na karti, pa se nalaze na stari način — i označavaju ručno kad budete bili.",
    },
    clues: [
      {
        place: "lake-plav",
        clue: {
          en: "A glacial lake at 906 metres beside a town, between the Prokletije and the Visitor range — about two kilometres long and up to nine metres deep.",
          sq: "Një liqen akullnajor në 906 metra pranë një qyteti, mes Bjeshkëve të Nemuna dhe vargut të Visitorit — rreth dy kilometra i gjatë dhe deri në nëntë metra i thellë.",
          cnr: "Ledeničko jezero na 906 metara pored grada, između Prokletija i Visitora — dugo oko dva kilometra i duboko do devet metara.",
        },
      },
      {
        place: "hridsko-lake",
        clue: {
          en: "A small lake at about 1,970 metres above Plav, inside a strict nature reserve of the national park. Tread lightly.",
          sq: "Një liqen i vogël rreth 1.970 metra mbi Plavë, brenda një rezervati të rreptë natyror të parkut kombëtar. Ecni lehtë.",
          cnr: "Malo jezero na oko 1.970 metara iznad Plava, unutar strogog rezervata prirode nacionalnog parka. Gazite lagano.",
        },
      },
      {
        place: "lake-visitor",
        clue: {
          en: "High on a mountain west of Plav lies a small lake known for an island that floats.",
          sq: "Lart në një mal në perëndim të Plavës shtrihet një liqen i vogël i njohur për një ishull që pluskon.",
          cnr: "Visoko na planini zapadno od Plava leži malo jezero poznato po ostrvu koje pluta.",
        },
      },
    ],
    translations: DRAFTS,
  },
];

export const getHunt = (slug: string) => hunts.find((h) => h.slug === slug);

export function huntsForPlace(placeSlug: string): Hunt[] {
  return hunts.filter((h) => h.clues.some((c) => c.place === placeSlug));
}
