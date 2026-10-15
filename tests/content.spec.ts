/**
 * Content integrity: every reference resolves, every fact has a source, and
 * the rules in src/content/types.ts hold (no invented ratings, WhatsApp only
 * when approved, coordinates inside the region, honest statuses).
 */
import { expect, test } from "@playwright/test";

import { existsSync } from "node:fs";

import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import type { StyleSpecification } from "maplibre-gl";

import { decorateBaseStyle, reliefStyle } from "../src/components/map/mapStyle";
import { businesses, guides, itineraries, places, routes, tours } from "../src/content";
import { demoBusinesses, demoEvents } from "../src/content/demo";
import { aboutPlatform, aboutRegion, partners } from "../src/content/pages";
import { culture, timeline } from "../src/content/history";
import { services } from "../src/content/services";
import { allSources, sources } from "../src/content/sources";
import type { Photo } from "../src/content/types";
import { cnr } from "../src/i18n/messages/cnr";
import { en } from "../src/i18n/messages/en";
import { sq } from "../src/i18n/messages/sq";

const placeSlugs = new Set(places.map((p) => p.slug));
const businessSlugs = new Set(businesses.map((b) => b.slug));
const routeSlugs = new Set(routes.map((r) => r.slug));
const guideSlugs = new Set(guides.map((g) => g.slug));

function expectSource(id: string, where: string) {
  expect(sources[id], `${where}: unknown source "${id}"`).toBeTruthy();
}

test("slugs are unique and URL-safe", () => {
  for (const list of [places, businesses, routes, guides, tours, itineraries]) {
    const slugs = list.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  }
});

test("source ids are unique and every cited source exists", () => {
  const ids = allSources.map((s) => s.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const s of allSources) {
    expect(s.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    if (s.url) expect(s.url).toMatch(/^https?:\/\//);
  }
  for (const r of [...places, ...businesses, ...routes, ...guides, ...tours, ...itineraries]) {
    for (const id of r.verification.sources) expectSource(id, `${r.kind}:${r.slug}`);
  }
  for (const p of places) {
    for (const id of p.location?.sources ?? []) expectSource(id, `place:${p.slug} location`);
    for (const id of p.officialLinks ?? []) expectSource(id, `place:${p.slug} official`);
  }
  for (const b of businesses) {
    for (const id of b.listings ?? []) expectSource(id, `business:${b.slug} listing`);
    for (const id of b.location?.sources ?? []) expectSource(id, `business:${b.slug} location`);
  }
  for (const r of routes) {
    for (const f of [r.distanceKm, r.ascentM, r.duration, r.difficulty, r.seasonality]) if (f) expectSource(f.source, `route:${r.slug}`);
    for (const id of [...r.officialLinks, ...(r.permits?.sources ?? [])]) expectSource(id, `route:${r.slug}`);
  }
  for (const g of guides) for (const s of g.sections) for (const id of s.sources) expectSource(id, `guide:${g.slug}`);
  for (const section of [...aboutRegion.sections, ...aboutPlatform.sections, ...partners.sections]) for (const id of section.sources ?? []) expectSource(id, "pages");
});

test("cross-references point at real records", () => {
  for (const p of places) for (const r of p.routes ?? []) expect(routeSlugs.has(r), `place ${p.slug} → route ${r}`).toBe(true);
  for (const b of businesses) {
    for (const n of b.nearby) expect(placeSlugs.has(n), `business ${b.slug} → place ${n}`).toBe(true);
    if (b.partOf) expect(businessSlugs.has(b.partOf)).toBe(true);
  }
  for (const r of routes) {
    for (const p of r.places) expect(placeSlugs.has(p), `route ${r.slug} → place ${p}`).toBe(true);
    if (r.start?.place) expect(placeSlugs.has(r.start.place)).toBe(true);
  }
  for (const t of tours)
    for (const s of t.stops) if (s.ref) expect((s.ref.kind === "place" ? placeSlugs : businessSlugs).has(s.ref.slug), `tour ${t.slug} → ${s.ref.slug}`).toBe(true);
  const sets = { place: placeSlugs, business: businessSlugs, route: routeSlugs, guide: guideSlugs };
  for (const i of itineraries) for (const d of i.days) for (const s of d.stops) expect(sets[s.ref.kind].has(s.ref.slug), `itinerary ${i.slug} → ${s.ref.slug}`).toBe(true);
});

test("coordinates are inside the region and carry sources", () => {
  for (const r of [...places, ...businesses]) {
    if (!r.location) continue;
    expect(r.location.lat, r.slug).toBeGreaterThan(42.3);
    expect(r.location.lat, r.slug).toBeLessThan(42.75);
    expect(r.location.lng, r.slug).toBeGreaterThan(19.6);
    expect(r.location.lng, r.slug).toBeLessThan(20.1);
    expect(r.location.sources.length, r.slug).toBeGreaterThan(0);
  }
});

test("tour cameras point only at mapped places", () => {
  for (const tour of tours) {
    for (const stop of tour.stops) {
      if (typeof stop.view === "string") continue;
      expect(places.find((p) => p.slug === (stop.view as { place: string }).place)?.location, `${tour.slug} → ${stop.view.place}`).toBeTruthy();
    }
  }
});

test("listings follow the directory rules", () => {
  for (const b of businesses) {
    expect(b.sponsored).toBe(false);
    for (const phone of b.contact.phones ?? []) {
      if (phone.whatsapp) {
        expect(phone.whatsapp.approved).toBe(true);
        expectSource(phone.whatsapp.source, `${b.slug} whatsapp`);
      }
    }
    if (b.hours) expect(b.hours.asOf).toMatch(/^\d{4}-\d{2}/);
    if (b.prices) expect(b.prices.asOf).toMatch(/^\d{4}-\d{2}/);
    // Self-reported listings must be owned by the business; unclaimed ones carry no contact copied from elsewhere.
    if (!b.claimed && b.categories[0] !== "visitor-info") {
      expect(b.contact.phones, `${b.slug} unclaimed listing has a phone number`).toBeUndefined();
      expect(b.contact.email, `${b.slug} unclaimed listing has an email`).toBeUndefined();
    }
  }
  const rosi = businesses.filter((b) => b.name.toUpperCase().includes("ROSI"));
  expect(rosi.length).toBeGreaterThan(0);
  for (const b of rosi) expect(b.disclosure, `${b.slug} must disclose the host relationship`).toBe("platform-creator");
});

test("businesses from open map data say so and carry nothing copied beyond name, type, position and own pages", () => {
  const open = businesses.filter((b) => b.origin?.kind === "open-data");
  expect(open.length).toBeGreaterThan(0);
  for (const b of open) {
    expect(b.verification.status, b.slug).toBe("unverified");
    expect(b.verification.sources).toContain("overture-places");
    expect(b.claimed).toBe(false);
    expect(b.contact.phones, `${b.slug} phone`).toBeUndefined();
    expect(b.contact.email, `${b.slug} email`).toBeUndefined();
    expect(b.photos).toHaveLength(0);
    expect(b.hours).toBeUndefined();
    expect(b.prices).toBeUndefined();
    if (b.location) {
      expect(b.location.status).toBe("unverified");
      // Inside the valley and Plav, on the Montenegrin side.
      expect(b.location.lat).toBeGreaterThan(42.44);
      expect(b.location.lat).toBeLessThan(42.62);
      expect(b.location.lng).toBeGreaterThan(19.7);
      expect(b.location.lng).toBeLessThan(19.97);
    }
  }
  // No business is listed twice (curated and open data).
  const names = businesses.map((b) => b.name.toLowerCase().replace(/[^a-z]/g, ""));
  expect(new Set(names).size).toBe(names.length);
});

test("demo content (preview builds) is labelled, invents no contacts or ratings, and stays apart from real listings", () => {
  const real = new Set(businesses.filter((b) => b.origin?.kind !== "demo").map((b) => b.name.toLowerCase().replace(/[^a-z]/g, "")));
  const slugs = new Set(businesses.filter((b) => b.origin?.kind !== "demo").map((b) => b.slug));
  for (const b of demoBusinesses) {
    expect(b.origin?.kind, b.slug).toBe("demo");
    expect(b.slug.startsWith("demo-"), b.slug).toBe(true);
    expect(slugs.has(b.slug)).toBe(false);
    expect(real.has(b.name.toLowerCase().replace(/[^a-z]/g, "")), `${b.name} looks like a real listing`).toBe(false);
    expect(b.contact.phones).toBeUndefined();
    expect(b.contact.email).toBeUndefined();
    expect(b.contact.website).toBeUndefined();
    expect(b.verification.status).toBe("unverified");
    for (const photo of b.photos) {
      expect(photo.rights).toBe("illustration");
      expect(existsSync(`public${photo.src.replace(/^\/[^/]+(?=\/illustrations)/, "")}`), photo.src).toBe(true);
    }
    expect(b.location, b.slug).not.toBeNull();
    expect(b.location!.lat).toBeGreaterThan(42.44);
    expect(b.location!.lat).toBeLessThan(42.62);
    for (const field of [b.summary, ...(b.prices ? [b.prices.text] : []), ...(b.hours ? [b.hours.text] : [])]) {
      expect(field.sq, b.slug).toBeTruthy();
      expect(field.cnr, b.slug).toBeTruthy();
    }
    // Prices and hours are examples, and say so.
    if (b.prices) expect(b.prices.text.en).toMatch(/^Example/);
    if (b.hours) expect(b.hours.text.en).toMatch(/^Example/);
    for (const n of b.nearby) expect(placeSlugs.has(n), `${b.slug} → ${n}`).toBe(true);
  }
  for (const e of demoEvents) expect(e.when.en).toMatch(/^Example/);
});

test("routes never imply navigable tracks or unverified status", () => {
  for (const r of routes) {
    expect(r.track).toBe("none");
    if (r.status === "published") {
      for (const f of [r.distanceKm, r.ascentM, r.duration, r.difficulty, r.seasonality]) expect(f, `${r.slug} published without all key facts`).toBeTruthy();
      expect(r.verification.status).toBe("field-verified");
    }
    if (r.type === "cross-border") expect(r.permits, `${r.slug} needs permit guidance`).toBeTruthy();
    if (r.type === "canyon") expect(r.guide).toBe("required");
  }
});

test("photos carry credits and rights", () => {
  const photos: Photo[] = [...places.flatMap((p) => p.photos), ...businesses.flatMap((b) => b.photos)];
  for (const p of photos) {
    expect(p.credit.author.length).toBeGreaterThan(1);
    expect(p.credit.href).toMatch(/^https:\/\//);
    expect(p.alt.length).toBeGreaterThan(10);
    if (p.rights === "free-licence" && p.credit.license !== "Public domain") expect(p.credit.licenseUrl, p.src).toMatch(/^https:\/\/creativecommons\.org\//);
  }
  // Owner photos (rights pending) only appear on the owner's own listings.
  for (const p of places) for (const photo of p.photos) expect(photo.rights).toBe("free-licence");
});

test("text exists in all three languages", () => {
  for (const p of places) {
    for (const field of [p.name, p.summary]) {
      expect(field.sq, `${p.slug} sq`).toBeTruthy();
      expect(field.cnr, `${p.slug} cnr`).toBeTruthy();
    }
    expect(p.description.sq?.length).toBe(p.description.en.length);
    expect(p.description.cnr?.length).toBe(p.description.en.length);
  }
  for (const r of [...businesses, ...routes, ...guides, ...tours, ...itineraries]) {
    expect(r.translations.sq, `${r.slug}`).toBeTruthy();
    expect(r.translations.cnr, `${r.slug}`).toBeTruthy();
  }
});

test("UI translations are complete and not just English copies", () => {
  const flat = (o: unknown, prefix = ""): [string, string][] =>
    typeof o === "string"
      ? [[prefix, o]]
      : Array.isArray(o)
        ? o.flatMap((v, i) => flat(v, `${prefix}[${i}]`))
        : Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => flat(v, prefix ? `${prefix}.${k}` : k));
  const english = new Map(flat(en));
  for (const [name, dict] of [
    ["sq", sq],
    ["cnr", cnr],
  ] as const) {
    const entries = flat(dict);
    const keys = new Set(entries.map(([k]) => k.replace(/\[\d+\]$/, "")));
    for (const k of english.keys()) expect(keys.has(k.replace(/\[\d+\]$/, "")), `${name} missing ${k}`).toBe(true);
    // Allow identical short strings (codes, names like "Wi-Fi"); flag long untranslated ones.
    // home.welcome greets in all three languages at once.
    const same = entries.filter(([k, v]) => english.get(k) === v && v.length > 18 && !k.startsWith("verification.owners") && k !== "home.welcome");
    expect(same.map(([k]) => k), `${name}: strings still in English`).toEqual([]);
    expect(dict.meta.status, `${name} must stay marked for review until a fluent editor checks it`).toBe("unreviewed");
  }
});

test("useful services: sources exist, all languages, official numbers only", () => {
  const langs = ["en", "sq", "cnr"] as const;
  for (const service of services) {
    for (const id of service.verification.sources) expect(sources[id], `${service.slug} → ${id}`).toBeTruthy();
    for (const lang of langs) {
      expect(service.name[lang], `${service.slug} name ${lang}`).toBeTruthy();
      expect(service.summary[lang], `${service.slug} summary ${lang}`).toBeTruthy();
      if (service.facts) expect(service.facts[lang]?.length, `${service.slug} facts ${lang}`).toBe(service.facts.en.length);
      if (service.hours) expect(service.hours[lang], `${service.slug} hours ${lang}`).toBeTruthy();
    }
    // Phone numbers only where an official source publishes them (emergency numbers); no listing phones.
    for (const phone of service.phones ?? []) expect(["112", "122", "123", "124"]).toContain(phone.number);
    if (service.slug !== "local-guides") expect(service.verification.sources.length, service.slug).toBeGreaterThan(0);
  }
});

test("history and culture: every entry is sourced and in all three languages", () => {
  for (const entry of [...timeline, ...culture]) {
    expect(entry.sources.length, entry.title.en).toBeGreaterThan(0);
    for (const id of entry.sources) expect(sources[id], `${entry.title.en} → ${id}`).toBeTruthy();
    for (const lang of ["en", "sq", "cnr"] as const) {
      expect(entry.title[lang], `${entry.title.en} ${lang}`).toBeTruthy();
      expect(entry.body[lang]?.length, `${entry.title.en} ${lang}`).toBe(entry.body.en.length);
    }
  }
});

test("journeys and tours share the ?tour= link: slugs never collide", () => {
  const slugs = [...tours.map((t) => t.slug), ...itineraries.map((i) => i.slug)];
  expect(new Set(slugs).size).toBe(slugs.length);
});

test("the map's own layers (height tint, contours, paths, peaks) make a valid style over the base map and on their own", () => {
  const layer = (id: string, type: "background" | "fill" | "line" | "symbol", sourceLayer?: string) =>
    ({ id, type, ...(sourceLayer ? { source: "openmaptiles", "source-layer": sourceLayer } : {}) }) as StyleSpecification["layers"][number];
  const base: StyleSpecification = {
    version: 8,
    glyphs: "https://example.test/fonts/{fontstack}/{range}.pbf",
    sources: { openmaptiles: { type: "vector", url: "https://example.test/tiles.json" } },
    layers: [
      layer("background", "background"),
      layer("landcover_wood", "fill", "landcover"),
      layer("water", "fill", "water"),
      layer("road_minor", "line", "transportation"),
      layer("road_one_way_arrow", "symbol", "transportation"),
      layer("poi_r1", "symbol", "poi"),
      layer("poi_transit", "symbol", "poi"),
      layer("label_village", "symbol", "place"),
    ],
  };
  const contours = "contour://valley/{z}/{x}/{y}";
  const decorated = decorateBaseStyle(base, contours);
  for (const style of [decorated, decorateBaseStyle(base, null), reliefStyle(contours), reliefStyle(null)]) {
    expect(validateStyleMin(style).map((e) => e.message)).toEqual([]);
  }
  const ids = decorated.layers.map((l) => l.id);
  // Tint and contours under the water; paths over the roads and under the names; peaks on top.
  expect(ids.indexOf("valley-relief")).toBeLessThan(ids.indexOf("water"));
  expect(ids.indexOf("valley-contour-lines")).toBeLessThan(ids.indexOf("water"));
  expect(ids.indexOf("valley-trails")).toBeGreaterThan(ids.indexOf("road_minor"));
  expect(ids.indexOf("valley-trails")).toBeLessThan(ids.indexOf("road_one_way_arrow"));
  expect(ids.at(-1)).toBe("valley-peaks");
  // Shops and cafés from the base map stay hidden; bus and train stops stay.
  const find = (id: string) => decorated.layers.find((l) => l.id === id)!;
  expect(find("poi_r1").layout).toMatchObject({ visibility: "none" });
  expect(find("poi_transit").layout?.visibility).toBeUndefined();
  // The style passed in is left alone.
  expect(base.layers.find((l) => l.id === "poi_r1")).not.toHaveProperty("layout");
});
