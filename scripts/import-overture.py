"""
Map the valley's businesses from open data: Overture Maps "places"
(https://overturemaps.org, CDLA Permissive 2.0 — records from Meta, Microsoft
and other open sources).

    pip install pyarrow fsspec aiohttp requests
    python3 scripts/import-overture.py            # → src/content/openData.ts

Reads only the parts of the global dataset that cover the valley (Parquet
row-group statistics), keeps visitor-relevant places in Montenegro with a
confidence of at least 0.5, and writes them as directory listings that say
clearly where they come from and that nobody has checked them:

- name, type and position only, plus a link to the business's own website or
  social page when the record has one. No phone numbers or emails: listings
  the business hasn't claimed carry no contact copied from elsewhere.
- a position goes on the map only when it is the business's own: records
  sharing one spot (a town centre the source fell back to) are listed
  without a pin.
- businesses already in the directory (ROSI's and the tourism organisation's
  listings) are not duplicated.

Set OVERTURE_CACHE=places.json to reuse a previous download.
"""

import json
import math
import os
import re
import sys
import unicodedata
from pathlib import Path

RELEASE = "2026-09-23.1"
BASE = "https://overturemaps-us-west-2.s3.amazonaws.com/"
BOX = (19.70, 42.44, 19.97, 42.62)  # xmin, ymin, xmax, ymax: Gusinje, Vusanje, Grbaja, Plav
MIN_CONFIDENCE = 0.5
ROOT = Path(__file__).resolve().parent.parent

AREAS = {
    "gusinje": (42.5619, 19.8339),
    "vusanje": (42.5294, 19.8403),
    "grbaja": (42.5106, 19.7926),
    "ropojana": (42.5019, 19.8158),
    "plav": (42.5975, 19.9410),
}

# Overture category → directory category ("" = name decides).
CATEGORY = {
    "hotel": "",
    "resort": "hotel",
    "lodging": "",
    "private_lodging": "",
    "bed_and_breakfast": "guesthouse",
    "campground": "campsite",
    "restaurant": "restaurant",
    "casual_eatery": "restaurant",
    "fast_food_restaurant": "restaurant",
    "food_and_drink": "restaurant",
    "brewery": "restaurant",
    "bar": "cafe",
    "cafe": "cafe",
    "coffee_shop": "cafe",
    "lounge": "cafe",
    "food_and_beverage_store": "cafe",
    "pharmacy_and_drug_store": "pharmacy",
    "atm": "atm",
    "bank_or_credit_union": "atm",
    "gas_station": "fuel",
    "travel_service": "activity",
}

# Records that are not businesses for visitors, or are places the guide already covers.
SKIP_NAMES = re.compile(r"^(oko skakavice|name not known)$|rosi|dedushi|vucetaj|mountain view inn", re.I)

# The same business listed twice under different spellings: drop the first, keep the second.
SAME_AS = {
    "hotel-restaurant-ada": "hotel-and-restoran-ada",
    "eko-turisticko-naselje-aqua-plav-montenegro": "aqua-resort-plav",
}


def fold(text: str) -> str:
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", fold(name)).strip("-")[:60].rstrip("-")


def metres(a, b) -> float:
    dy = (a[0] - b[0]) * 110570
    dx = (a[1] - b[1]) * 111320 * math.cos(math.radians(a[0]))
    return math.hypot(dx, dy)


def category(row) -> str | None:
    base = CATEGORY.get(row.get("basic_category") or "")
    if base is None:
        return None
    name = fold(row["names"]["primary"])
    if base in ("", "hotel") and re.search(r"camp", name):
        return "campsite"
    if base == "" and re.search(r"katun|bungalow|brvnar|cabin", name):
        return "cabin"
    if base == "" and re.search(r"guest ?house|bujtin|shpi|apartm|hostel|villa|house|kuca|place|selo|village|breath", name):
        return "guesthouse"
    if base == "":
        return "hotel" if row.get("basic_category") == "hotel" else "guesthouse"
    if base == "restaurant" and re.search(r"caff?e|bar\b|shisha", name):
        return "cafe"
    if base == "activity":
        # Guides and activity providers are listed only once their licences are checked:
        # from open data, only tourism organisations (visitor information) come in.
        return "visitor-info" if re.search(r"turisti.+organizacij", name) else None
    return base


def download() -> list:
    import fsspec
    import pyarrow.parquet as pq
    import requests

    prefix = f"release/{RELEASE}/theme=places/type=place/"
    keys = re.findall(r"<Key>([^<]+)</Key>", requests.get(BASE, params={"list-type": "2", "prefix": prefix}, timeout=60).text)
    fs = fsspec.filesystem("https", client_kwargs={"trust_env": True}, block_size=2**20)
    rows = []
    for key in keys:
        pf = pq.ParquetFile(fs.open(BASE + key))
        md = pf.metadata
        names = [md.schema.column(i).path for i in range(md.num_columns)]
        idx = {n: names.index(n) for n in ["bbox.xmin", "bbox.xmax", "bbox.ymin", "bbox.ymax"]}
        groups = []
        for g in range(md.num_row_groups):
            st = {k: md.row_group(g).column(i).statistics for k, i in idx.items()}
            if all(s is not None and s.has_min_max for s in st.values()) and (
                st["bbox.xmax"].max < BOX[0] or st["bbox.xmin"].min > BOX[2] or st["bbox.ymax"].max < BOX[1] or st["bbox.ymin"].min > BOX[3]
            ):
                continue
            groups.append(g)
        if groups:
            cols = [c for c in pf.schema_arrow.names if c != "geometry"]
            for row in pf.read_row_groups(groups, columns=cols).to_pylist():
                b = row["bbox"]
                if BOX[0] <= b["xmin"] <= BOX[2] and BOX[1] <= b["ymin"] <= BOX[3]:
                    rows.append(row)
        print(key.rsplit("/", 1)[-1][:12], len(groups), "row groups", file=sys.stderr)
    return rows


def place_points() -> list:
    """Mapped places of the guide (slug, lat, lng), read from places.ts."""
    text = (ROOT / "src/content/places.ts").read_text()
    out = []
    for block in re.split(r"\n  \{\n", text)[1:]:
        slug = re.search(r'slug: "([^"]+)"', block)
        loc = re.search(r"location: \{\s*lat: ([\d.]+),\s*lng: ([\d.]+)", block)
        if slug and loc:
            out.append((slug.group(1), float(loc.group(1)), float(loc.group(2))))
    return out


def website(row) -> dict | None:
    for url in row.get("websites") or []:
        if not url or not url.startswith("http") or re.search(r"4sq\.com|facebook\.com", url):
            continue
        url = re.sub(r"\?aid=\d+.*$", "", url)  # booking.com affiliate codes
        return {"url": url}
    return None


def social(row) -> list:
    out = []
    for url in row.get("socials") or []:
        if "facebook.com" in url:
            out.append({"label": "Facebook", "url": url})
            break
    return out


def main():
    cache = os.environ.get("OVERTURE_CACHE")
    rows = json.load(open(cache)) if cache and Path(cache).exists() else download()
    if cache and not Path(cache).exists():
        json.dump(rows, open(cache, "w"), default=str, ensure_ascii=False)

    # Every record's spot, filtered or not: a business sharing its spot with any other record has no position of its own.
    spots = [(round(r["bbox"]["ymin"], 6), round(r["bbox"]["xmin"], 6)) for r in rows]

    kept = []
    for row in rows:
        country = (row.get("addresses") or [{}])[0].get("country")
        name = re.sub(r"\s+", " ", (row.get("names") or {}).get("primary") or "").strip()
        cat = category(row) if name else None
        if country != "ME" or not cat or (row.get("confidence") or 0) < MIN_CONFIDENCE or SKIP_NAMES.search(name) or slugify(name) in SAME_AS:
            continue
        b = row["bbox"]
        kept.append({"row": row, "name": name, "cat": cat, "pt": (round(b["ymin"], 6), round(b["xmin"], 6))})

    places = place_points()
    seen = set()
    listings = []
    for k in sorted(kept, key=lambda k: fold(k["name"])):
        slug = base = slugify(k["name"])
        n = 2
        while slug in seen:
            slug, n = f"{base}-{n}", n + 1
        seen.add(slug)
        # A spot shared with another record is a fallback (a town centre), not the business's own.
        own = sum(1 for spot in spots if metres(k["pt"], spot) <= 25) == 1
        area = min(AREAS, key=lambda a: metres(k["pt"], AREAS[a]))
        near = sorted((metres(k["pt"], (lat, lng)), s) for s, lat, lng in places)
        listings.append(
            {
                "slug": slug,
                "name": k["name"],
                "category": k["cat"],
                "area": area,
                "location": {"lat": k["pt"][0], "lng": k["pt"][1]} if own else None,
                "nearby": [s for d, s in near if d < 1500][:3],
                "website": website(k["row"]),
                "social": social(k["row"]),
                "overtureId": k["row"]["id"],
                "confidence": round(k["row"]["confidence"], 2),
            }
        )

    out = ROOT / "src/content/openData.ts"
    out.write_text(
        "// Generated by scripts/import-overture.py from Overture Maps places\n"
        f"// (release {RELEASE}, CDLA Permissive 2.0). Do not edit by hand: a business\n"
        "// that claims its listing moves to businesses.ts with what it supplies.\n\n"
        'import type { OpenDataListing } from "./types";\n\n'
        f'export const OVERTURE_RELEASE = "{RELEASE}";\n\n'
        f"export const openDataListings: OpenDataListing[] = {json.dumps(listings, ensure_ascii=False, indent=2)};\n"
    )
    mapped = sum(1 for l in listings if l["location"])
    print(f"{len(listings)} listings ({mapped} with their own position) → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
