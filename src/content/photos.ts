/**
 * Photo catalogue.
 *
 * Landscape photos are from Wikimedia Commons, used under their free licences:
 * each keeps its author, licence and file page, printed beside the image and
 * on the credits page. Check the file page before reusing a photo elsewhere.
 *
 * ROSI's photos are the property's own pictures, hot-linked from its
 * Booking.com listing until the original files and written permission are
 * collected (rights: "owner-pending"). They appear only on ROSI's own listings.
 */

import type { Photo } from "./types";

const commons = (author: string, license: string, href: string, licenseUrl?: string) => ({
  credit: { author, license, href, licenseUrl, via: "Wikimedia Commons" },
  rights: "free-licence" as const,
});

const rosiCredit = (listing: string) => ({
  credit: {
    author: "Hotel & Eko Katun ROSI",
    license: "© ROSI",
    href: listing,
    via: "Booking.com",
  },
  rights: "owner-pending" as const,
});
const rosiKatun = rosiCredit("https://www.booking.com/hotel/me/ethno-katun-rosi-agrotourism.html");
const rosiHotel = rosiCredit("https://www.booking.com/hotel/me/rosi-gusinje.html");

export const commonsPhotos = {
  gusinjeValley: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Gucia_rr%C3%ABz%C3%AB_Alpeve.jpg/1280px-Gucia_rr%C3%ABz%C3%AB_Alpeve.jpg",
    alt: "Gusinje town in its green valley beneath snow-capped Prokletije peaks, sheep grazing in the foreground",
    altLocalized: {
      sq: "Gucia në luginën e saj të gjelbër nën majat me borë të Bjeshkëve të Nemuna, me dele që kullosin në plan të parë",
      cnr: "Gusinje u zelenoj dolini ispod snijegom pokrivenih vrhova Prokletija, s ovcama na ispaši u prvom planu",
    },
    width: 4032,
    height: 2268,
    ...commons(
      "Planeti",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:Gucia_rr%C3%ABz%C3%AB_Alpeve.jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  gusinjeHouses: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GusinjeHouses.jpg/1280px-GusinjeHouses.jpg",
    alt: "Old and new village houses in Gusinje with mountains behind",
    altLocalized: { sq: "Shtëpi të vjetra dhe të reja fshati në Guci, me male prapa", cnr: "Stare i nove seoske kuće u Gusinju, s planinama u pozadini" },
    width: 2560,
    height: 1920,
    ...commons("Etan J. Tal", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:GusinjeHouses.jpg", "https://creativecommons.org/licenses/by/3.0/"),
  },
  gusinjeHaystacks: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/HayMontenegro.jpg/1280px-HayMontenegro.jpg",
    alt: "Traditional conical haystacks with wooden ladders in Gusinje",
    altLocalized: {
      sq: "Mullarë tradicionalë sanë në formë koni me shkallë druri në Guci",
      cnr: "Tradicionalni stogovi sijena u obliku kupe s drvenim ljestvama u Gusinju",
    },
    width: 2520,
    height: 1556,
    ...commons("Etan J. Tal", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:HayMontenegro.jpg", "https://creativecommons.org/licenses/by/3.0/"),
  },
  gusinjeAerial: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Plav_from_Air.jpg/1280px-Plav_from_Air.jpg",
    alt: "Aerial view of Gusinje (front), Plav and Lake Plav (background) from an aeroplane",
    altLocalized: {
      sq: "Pamje ajrore e Gucisë (përpara), Plavës dhe Liqenit të Plavës (prapa) nga një aeroplan",
      cnr: "Gusinje (naprijed), Plav i Plavsko jezero (u pozadini) iz aviona",
    },
    width: 2500,
    height: 2889,
    ...commons("Albinfo", "Public domain", "https://commons.wikimedia.org/wiki/File:Plav_from_Air.jpg"),
  },
  aliPashaSprings: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Krojet.jpg/1280px-Krojet.jpg",
    alt: "Calm spring pond reflecting snowy mountains, with the Krojet restaurant building on the shore near Gusinje",
    altLocalized: {
      sq: "Pellg i qetë burimi që pasqyron male me borë, me një ndërtesë restoranti në breg, pranë Gucisë",
      cnr: "Mirno jezerce izvora u kojem se ogledaju snježne planine, s restoranom na obali, blizu Gusinja",
    },
    width: 1440,
    height: 810,
    ...commons("GjonBala", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Krojet.jpg", "https://creativecommons.org/licenses/by-sa/4.0/"),
  },
  grlja: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Grla%2C_Vuthaj.jpg/1280px-Grla%2C_Vuthaj.jpg",
    alt: "Grlja waterfall plunging into a deep blue rock pool near Vusanje",
    altLocalized: {
      sq: "Ujëvara e Grlës bie në një pellg shkëmbor blu të thellë pranë Vuthajve",
      cnr: "Vodopad Grlja pada u duboki plavi kameni bazen blizu Vusanja",
    },
    width: 1536,
    height: 2048,
    ...commons("Planeti", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Grla,_Vuthaj.jpg", "https://creativecommons.org/licenses/by-sa/4.0/"),
  },
  blueEye: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Oko_Skakavice_lake%2C_Prokletje_mountain_range%2C_Montenegro.jpg/1280px-Oko_Skakavice_lake%2C_Prokletje_mountain_range%2C_Montenegro.jpg",
    alt: "Oko Skakavice spring pool mirroring bare autumn trees",
    altLocalized: { sq: "Burimi Oko Skakavice pasqyron pemë të zhveshura vjeshte", cnr: "Izvor Oko Skakavice u kojem se ogleda golo jesenje drveće" },
    width: 3264,
    height: 2448,
    ...commons(
      "KpokeJlJla",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:Oko_Skakavice_lake,_Prokletje_mountain_range,_Montenegro.jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  skakavacStream: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Prokletije8.jpg/1280px-Prokletije8.jpg",
    alt: "Clear mountain stream winding through a green meadow with a grazing cow",
    altLocalized: {
      sq: "Përrua i kthjellët malor që gjarpëron nëpër një livadh të gjelbër me një lopë që kullot",
      cnr: "Bistri planinski potok vijuga kroz zelenu livadu na kojoj pase krava",
    },
    width: 3264,
    height: 2448,
    ...commons("Ivan25", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Prokletije8.jpg", "https://creativecommons.org/licenses/by-sa/3.0/"),
  },
  ropojanaRoad: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Heading_West_%2810470602095%29.jpg/1280px-Heading_West_%2810470602095%29.jpg",
    alt: "Gravel road leading from Vusanje into the Ropojana valley between towering limestone walls",
    altLocalized: {
      sq: "Rrugë me zhavorr nga Vuthajt drejt luginës së Ropojanës, mes mureve të larta gëlqerore",
      cnr: "Makadamski put od Vusanja ka dolini Ropojane, između visokih krečnjačkih zidova",
    },
    width: 4880,
    height: 3227,
    ...commons(
      "amir appel from Israel",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Heading_West_(10470602095).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  ropojanaHiker: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/PSK_Balkan_na_Prokletijama.jpg/1280px-PSK_Balkan_na_Prokletijama.jpg",
    alt: "Hiker with a red backpack walking up the wide Ropojana valley",
    altLocalized: {
      sq: "Ecës me çantë të kuqe shpine që ngjitet nëpër luginën e gjerë të Ropojanës",
      cnr: "Planinar s crvenim rancem hoda uz široku dolinu Ropojane",
    },
    width: 2592,
    height: 1728,
    ...commons(
      "Ranacgo",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:PSK_Balkan_na_Prokletijama.jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  ropojanaMeadow: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Peaks_of_the_Balkans_-_234_%2827114594639%29.jpg/1280px-Peaks_of_the_Balkans_-_234_%2827114594639%29.jpg",
    alt: "Panoramic meadow beneath the jagged west wall of the Ropojana valley",
    altLocalized: {
      sq: "Livadh panoramik nën murin e dhëmbëzuar perëndimor të luginës së Ropojanës",
      cnr: "Panoramska livada ispod nazubljenog zapadnog zida doline Ropojane",
    },
    width: 3424,
    height: 1920,
    ...commons(
      "Bruno Rijsman",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_234_(27114594639).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  ropojanaUpper: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Peaks_of_the_Balkans_-_243_%2827114589989%29.jpg/1280px-Peaks_of_the_Balkans_-_243_%2827114589989%29.jpg",
    alt: "Upper Ropojana valley with pines and a chain of jagged limestone peaks",
    altLocalized: {
      sq: "Pjesa e sipërme e luginës së Ropojanës me pisha dhe një varg majash gëlqerore të dhëmbëzuara",
      cnr: "Gornji dio doline Ropojane s borovima i nizom nazubljenih krečnjačkih vrhova",
    },
    width: 5184,
    height: 2920,
    ...commons(
      "Bruno Rijsman",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_243_(27114589989).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  vusanjeVillage: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Peaks_of_the_Balkans_-_226_%2838175752354%29.jpg/1280px-Peaks_of_the_Balkans_-_226_%2838175752354%29.jpg",
    alt: "Houses of Vusanje with a hazy Prokletije massif behind",
    altLocalized: {
      sq: "Shtëpitë e Vuthajve me masivin e mjegullt të Bjeshkëve të Nemuna prapa",
      cnr: "Kuće u Vusanju, iza njih masiv Prokletija u izmaglici",
    },
    width: 5184,
    height: 2920,
    ...commons(
      "Bruno Rijsman",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_226_(38175752354).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  vusanjeStoneHouse: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Peaks_of_the_Balkans_-_227_%2827114603179%29.jpg/1280px-Peaks_of_the_Balkans_-_227_%2827114603179%29.jpg",
    alt: "Old stone farmhouse with a red tractor in Vusanje, peaks rising behind",
    altLocalized: {
      sq: "Shtëpi e vjetër fshati prej guri me një traktor të kuq në Vuthaj, me maja që ngrihen prapa",
      cnr: "Stara kamena seoska kuća s crvenim traktorom u Vusanju, iza nje se dižu vrhovi",
    },
    width: 5184,
    height: 2920,
    ...commons(
      "Bruno Rijsman",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_227_(27114603179).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  vusanjeGuesthouses: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vuthaj%2C_Montenegro.jpg/1280px-Vuthaj%2C_Montenegro.jpg",
    alt: "Wooden cottages and red-roofed houses on a meadow in Vusanje under steep green mountains",
    altLocalized: {
      sq: "Shtëpiza druri dhe shtëpi me çati të kuqe në një livadh në Vuthaj, nën male të pjerrëta të gjelbra",
      cnr: "Drvene kućice i kuće s crvenim krovovima na livadi u Vusanju, ispod strmih zelenih planina",
    },
    width: 1440,
    height: 1080,
    ...commons("Serrity", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Vuthaj,_Montenegro.jpg", "https://creativecommons.org/licenses/by-sa/4.0/"),
  },
  vusanjePeaks: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Prokletije1.jpg/1280px-Prokletije1.jpg",
    alt: "Clouds over snow-streaked Prokletije peaks seen near Vusanje",
    altLocalized: {
      sq: "Re mbi majat e Bjeshkëve të Nemuna me vija bore, parë pranë Vuthajve",
      cnr: "Oblaci nad vrhovima Prokletija prošaranim snijegom, viđeni blizu Vusanja",
    },
    width: 3264,
    height: 2448,
    ...commons("Ivan25", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Prokletije1.jpg", "https://creativecommons.org/licenses/by-sa/3.0/"),
  },
  karanfili: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Karanfili_%28Prokletije%29.jpg/1280px-Karanfili_%28Prokletije%29.jpg",
    alt: "The jagged Karanfili range seen from Talijanka peak",
    altLocalized: { sq: "Vargu i dhëmbëzuar i Karanfilit parë nga maja Talijanka", cnr: "Nazubljeni greben Karanfila viđen s vrha Talijanka" },
    width: 1600,
    height: 1067,
    ...commons(
      "Hladnikm",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:Karanfili_(Prokletije).jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  karanfilWest: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Peaks_of_the_Balkans_-_178_%2838175763354%29.jpg/1280px-Peaks_of_the_Balkans_-_178_%2838175763354%29.jpg",
    alt: "Karanfil from the west above rolling green pastures, Forca to the right",
    altLocalized: {
      sq: "Karanfili nga perëndimi mbi kullota të gjelbra kodrinore, me Forcën në të djathtë",
      cnr: "Karanfil sa zapada iznad zelenih pašnjaka, desno Forca",
    },
    width: 5184,
    height: 2920,
    ...commons(
      "Bruno Rijsman",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_178_(38175763354).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  grbajaUpper: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Peaks_of_the_Balkans_-_164_%2838004410865%29.jpg/1280px-Peaks_of_the_Balkans_-_164_%2838004410865%29.jpg",
    alt: "Karanfili and other high peaks above the upper Grebaje valley",
    altLocalized: {
      sq: "Karanfili dhe maja të tjera të larta mbi pjesën e sipërme të luginës së Gërbajës",
      cnr: "Karanfili i drugi visoki vrhovi iznad gornjeg dijela doline Grbaje",
    },
    width: 5184,
    height: 2920,
    ...commons(
      "Bruno Rijsman",
      "CC BY 2.0",
      "https://commons.wikimedia.org/wiki/File:Peaks_of_the_Balkans_-_164_(38004410865).jpg",
      "https://creativecommons.org/licenses/by/2.0/",
    ),
  },
  grbajaEvening: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Maja_Vukoces_01.jpg/1280px-Maja_Vukoces_01.jpg",
    alt: "Golden evening light on the wall of Maja Vukoces seen from the Grebaje valley",
    altLocalized: {
      sq: "Dritë e artë mbrëmjeje mbi murin e Majës së Vukoçes, parë nga lugina e Gërbajës",
      cnr: "Zlatno večernje svjetlo na zidu Maja Vukoces, viđeno iz doline Grbaje",
    },
    width: 3872,
    height: 2592,
    ...commons(
      "Marko Randjic",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:Maja_Vukoces_01.jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  karanfilWinter: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WK402_WikipediaWeekendTirana2015_Karanfil_076_%28cropped%29.JPG/1280px-WK402_WikipediaWeekendTirana2015_Karanfil_076_%28cropped%29.JPG",
    alt: "Snow-covered Karanfil ridges in winter seen from the air",
    altLocalized: { sq: "Kreshtat e Karanfilit të mbuluara me borë në dimër, parë nga ajri", cnr: "Snijegom prekriveni grebeni Karanfila zimi, iz vazduha" },
    width: 2846,
    height: 1523,
    ...commons(
      "Albinfo",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:WK402_WikipediaWeekendTirana2015_Karanfil_076_(cropped).JPG",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  lakePlavLilies: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Nje_liqe_i_bukur_ne_plav.jpg/1280px-Nje_liqe_i_bukur_ne_plav.jpg",
    alt: "Water lilies and reeds in the clear shallows of Lake Plav beside a wooden jetty",
    altLocalized: {
      sq: "Zambakë uji dhe kallama në cekëtinat e kthjellëta të Liqenit të Plavës pranë një skele druri",
      cnr: "Lokvanji i trska u bistrom plićaku Plavskog jezera pored drvenog mola",
    },
    width: 4080,
    height: 3060,
    ...commons(
      "Feniks.h",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:Nje_liqe_i_bukur_ne_plav.jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  lakePlavShore: {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Liqeni_i_Plav%C3%ABs_nga_perendimi.jpg",
    alt: "Lake Plav with the town of Plav and green hills across the water",
    altLocalized: {
      sq: "Liqeni i Plavës me qytetin e Plavës dhe kodra të gjelbra përtej ujit",
      cnr: "Plavsko jezero s gradom Plavom i zelenim brdima preko vode",
    },
    width: 1280,
    height: 720,
    ...commons(
      "Ismet Azizi",
      "CC0",
      "https://commons.wikimedia.org/wiki/File:Liqeni_i_Plav%C3%ABs_nga_perendimi.jpg",
      "https://creativecommons.org/publicdomain/zero/1.0/",
    ),
  },
  zlaKolataSummit: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Zla_Kolata_summit.jpg/1280px-Zla_Kolata_summit.jpg",
    alt: "360-degree panorama from the summit of Zla Kolata over the Prokletije",
    altLocalized: {
      sq: "Panoramë 360 gradë nga maja e Kollatës së Keqe mbi Bjeshkët e Nemuna",
      cnr: "Panorama od 360 stepeni s vrha Zle Kolate preko Prokletija",
    },
    width: 12000,
    height: 2517,
    ...commons("Pavouk", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Zla_Kolata_summit.jpg", "https://creativecommons.org/licenses/by-sa/4.0/"),
  },
  zlaKolataNorthEast: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Zla_Kolata.JPG/1280px-Zla_Kolata.JPG",
    alt: "The summit of Zla Kolata in the Prokletije, seen from the north-east",
    altLocalized: {
      sq: "Maja e Kollatës së Keqe në Bjeshkët e Nemuna, parë nga verilindja",
      cnr: "Vrh Zle Kolate na Prokletijama, viđen sa sjeveroistoka",
    },
    width: 4847,
    height: 3223,
    ...commons("Pavouk", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Zla_Kolata.JPG", "https://creativecommons.org/licenses/by-sa/4.0/"),
  },
  zlaKolataNorthFace: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/The_North_Face_of_Zla_Kolata_mountain.jpg/1280px-The_North_Face_of_Zla_Kolata_mountain.jpg",
    alt: "The north face of Zla Kolata",
    altLocalized: {
      sq: "Faqja veriore e Kollatës së Keqe",
      cnr: "Sjeverna strana Zle Kolate",
    },
    width: 3264,
    height: 2448,
    ...commons(
      "KpokeJlJla",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:The_North_Face_of_Zla_Kolata_mountain.jpg",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
  lakePlavWide: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Lake_Plav1.JPG/1280px-Lake_Plav1.JPG",
    alt: "Lake Plav (Plavsko jezero)",
    altLocalized: {
      sq: "Liqeni i Plavës",
      cnr: "Plavsko jezero",
    },
    width: 2048,
    height: 1536,
    ...commons("Chlämens", "Public domain", "https://commons.wikimedia.org/wiki/File:Lake_Plav1.JPG"),
  },
  karanfilWinterAerial: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/WK402_WikipediaWeekendTirana2015_Jezerca-Karanfil_075.JPG/1280px-WK402_WikipediaWeekendTirana2015_Jezerca-Karanfil_075.JPG",
    alt: "The central Prokletije from the air in early December, with Jezerca in front and Karanfil behind",
    altLocalized: {
      sq: "Bjeshkët e Nemuna qendrore nga ajri në fillim të dhjetorit, me Jezercën përpara dhe Karanfilin prapa",
      cnr: "Centralne Prokletije iz vazduha početkom decembra, s Jezercom naprijed i Karanfilom iza",
    },
    width: 4912,
    height: 3264,
    ...commons(
      "Albinfo",
      "CC BY-SA 4.0",
      "https://commons.wikimedia.org/wiki/File:WK402_WikipediaWeekendTirana2015_Jezerca-Karanfil_075.JPG",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
  },
} satisfies Record<string, Photo>;

export const rosiPhotos = {
  katunAerial: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/886936299.jpg?k=3f345710e6533a1da409233a1167f792c0d1c9cf2530658b1f7a12e02059ddb8&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/886936299.jpg?k=3f345710e6533a1da409233a1167f792c0d1c9cf2530658b1f7a12e02059ddb8&o=",
    alt: "Eko Katun ROSI from above: the stone main house, a red-roofed pavilion and a row of wooden bungalows on a meadow with grazing sheep, under steep green mountains",
    altLocalized: {
      sq: "Eko Katun ROSI nga lart: shtëpia kryesore prej guri, një pavijon me çati të kuqe dhe një varg bungallosh druri në një livadh me dele që kullosin, nën male të pjerrëta të gjelbra",
      cnr: "Eko Katun ROSI odozgo: glavna kamena kuća, paviljon s crvenim krovom i niz drvenih bungalova na livadi s ovcama, ispod strmih zelenih planina",
    },
    width: 1200,
    height: 900,
    ...rosiKatun,
  },
  katunPath: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/886934318.jpg?k=8d66b202be1ee8304414d674ccc9e25086292ae53250ed5a79aaaf1889586645&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/886934318.jpg?k=8d66b202be1ee8304414d674ccc9e25086292ae53250ed5a79aaaf1889586645&o=",
    alt: "Lantern-lit stone path between wooden bungalows, with a big wooden heart on the lawn and snow-streaked peaks behind",
    altLocalized: {
      sq: "Shteg guri i ndriçuar me fenerë mes bungallove prej druri, me një zemër të madhe druri në lëndinë dhe maja me vija bore prapa",
      cnr: "Kamena staza osvijetljena fenjerima između drvenih bungalova, s velikim drvenim srcem na travnjaku i vrhovima prošaranim snijegom u pozadini",
    },
    width: 1280,
    height: 853,
    ...rosiKatun,
  },
  katunBungalow: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/886934241.jpg?k=69fb52196d1ec386b2be3404008016ea6a0f3b31b4a966d79b3f42886f959bf9&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/886934241.jpg?k=69fb52196d1ec386b2be3404008016ea6a0f3b31b4a966d79b3f42886f959bf9&o=",
    alt: "Wooden bungalow with two chairs on its small porch and a lamp by the door, beside a lantern-lined stone path under a green mountainside",
    altLocalized: {
      sq: "Bungallo druri me dy karrige në verandën e vogël dhe një llambë pranë derës, pranë një shtegu guri me fenerë nën një shpat të gjelbër",
      cnr: "Drveni bungalov s dvije stolice na malom tremu i lampom kraj vrata, pored kamene staze s fenjerima ispod zelene padine",
    },
    width: 1280,
    height: 853,
    ...rosiKatun,
  },
  katunStoneHouse: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/557008354.jpg?k=4289be02f9f1ee464e1071e81a8d82b17c861249727f3ef4a1647e932b7bf806&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/557008354.jpg?k=4289be02f9f1ee464e1071e81a8d82b17c861249727f3ef4a1647e932b7bf806&o=",
    alt: "Two-storey stone house with small arched windows and a red hipped roof, joined to a glazed wooden veranda, with hikers outside and bungalows beyond",
    altLocalized: {
      sq: "Shtëpi guri dykatëshe me dritare të vogla me hark dhe çati të kuqe, e lidhur me një verandë druri me xhama, me ecës jashtë dhe bungallo më tej",
      cnr: "Dvospratna kamena kuća s malim lučnim prozorima i crvenim krovom, spojena sa zastakljenom drvenom verandom, s planinarima ispred i bungalovima dalje",
    },
    width: 1280,
    height: 853,
    ...rosiKatun,
  },
  katunTerrace: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/557016314.jpg?k=a08bed9bf4b1d023505588d7514628d83e0f70f927097afda5e4c84b957c757e&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/557016314.jpg?k=a08bed9bf4b1d023505588d7514628d83e0f70f927097afda5e4c84b957c757e&o=",
    alt: "Wooden picnic tables on the terrace beside the stone-and-timber main building with its Eko Katun ROSI sign, below snow-capped mountains",
    altLocalized: {
      sq: "Tavolina pikniku prej druri në tarracë pranë ndërtesës kryesore prej guri e druri me tabelën Eko Katun ROSI, nën male me borë",
      cnr: "Drveni stolovi za piknik na terasi pored glavne zgrade od kamena i drveta s natpisom Eko Katun ROSI, ispod snijegom pokrivenih planina",
    },
    width: 1200,
    height: 900,
    ...rosiKatun,
  },
  katunTents: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/554542200.jpg?k=975ca97dce14f761fce0cdb8ad7610ce90ab85f9e1e8bf73feb974612fee69e3&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/554542200.jpg?k=975ca97dce14f761fce0cdb8ad7610ce90ab85f9e1e8bf73feb974612fee69e3&o=",
    alt: "Blue tents pitched on the meadow next to the bungalow row, with campers and limestone cliffs behind",
    altLocalized: {
      sq: "Çadra blu të ngritura në livadh pranë vargut të bungallove, me kampues dhe shkëmbinj gëlqerorë prapa",
      cnr: "Plavi šatori podignuti na livadi pored niza bungalova, s kamperima i krečnjačkim liticama u pozadini",
    },
    width: 675,
    height: 900,
    ...rosiKatun,
  },
  hotelBuilding: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/458083717.jpg?k=dbbd1c283fea2da2e0d16a4895d64f2c24501f8cb4bffa68f3ae26091897e3eb&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/458083717.jpg?k=dbbd1c283fea2da2e0d16a4895d64f2c24501f8cb4bffa68f3ae26091897e3eb&o=",
    alt: "The yellow Hotel ROSI building with its glass-walled bar-restaurant above the ground-floor market, a mountain rising behind",
    altLocalized: {
      sq: "Ndërtesa e verdhë e Hotel ROSI me bar-restorantin me mure xhami mbi marketin në katin përdhes, me një mal që ngrihet prapa",
      cnr: "Žuta zgrada hotela ROSI sa zastakljenim bar-restoranom iznad marketa u prizemlju, iza nje se diže planina",
    },
    width: 1200,
    height: 900,
    ...rosiHotel,
  },
  hotelDusk: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/458083506.jpg?k=494105f1890207773626b86f318ae80cdad276fc12d8d04a3abafd52776dada8&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/458083506.jpg?k=494105f1890207773626b86f318ae80cdad276fc12d8d04a3abafd52776dada8&o=",
    alt: "Hotel ROSI at dusk, the set tables of its glass-walled restaurant lit up above the ground-floor market",
    altLocalized: {
      sq: "Hotel ROSI në muzg, tavolinat e shtruara të restorantit me mure xhami të ndriçuara mbi marketin në katin përdhes",
      cnr: "Hotel ROSI u sumrak, s osvijetljenim postavljenim stolovima zastakljenog restorana iznad marketa u prizemlju",
    },
    width: 675,
    height: 900,
    ...rosiHotel,
  },
  hotelGusinjeBlueHour: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/198600193.jpg?k=61ae49910db1a3fdba06e33c49ab7bd9c461066abcd6f3db8991f03ad13392ab&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/198600193.jpg?k=61ae49910db1a3fdba06e33c49ab7bd9c461066abcd6f3db8991f03ad13392ab&o=",
    alt: "Gusinje at blue hour: rooftops, street lights and a lit minaret below snow-capped mountains",
    altLocalized: {
      sq: "Gucia në orën blu: çati, drita rruge dhe një minare e ndriçuar nën male me borë",
      cnr: "Gusinje u plavi sat: krovovi, ulična svjetla i osvijetljeni minaret ispod snijegom pokrivenih planina",
    },
    width: 1200,
    height: 900,
    ...rosiHotel,
  },
  hotelRoofTerrace: {
    src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/256143440.jpg?k=83921c0a58feb433c9fe9d3856c853a6346ee21e606e443716a1763e2dca4b68&o=",
    srcSmall: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/256143440.jpg?k=83921c0a58feb433c9fe9d3856c853a6346ee21e606e443716a1763e2dca4b68&o=",
    alt: "The hotel’s tiled roof terrace with a railing, a lamp post and the ROSI restaurant sign, looking over the street to wooded mountains",
    altLocalized: {
      sq: "Tarraca me pllaka në çatinë e hotelit, me parmak, shtyllë ndriçimi dhe tabelën e restorantit ROSI, me pamje nga rruga dhe malet me pyje",
      cnr: "Popločana krovna terasa hotela s ogradom, stubom rasvjete i natpisom restorana ROSI, s pogledom na ulicu i šumovite planine",
    },
    width: 1200,
    height: 900,
    ...rosiHotel,
  },
} satisfies Record<string, Photo>;
