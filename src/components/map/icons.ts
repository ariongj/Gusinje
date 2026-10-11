/**
 * Small line icons for map markers (24 × 24, drawn with a 2px stroke in the
 * marker's colour). Constant strings — never built from content.
 */
export const MAP_ICONS = {
  town: "M3 20V10l5-4 5 4v10M13 20v-7l4-3 4 3v7M2 20h20",
  house: "M4 11l8-6 8 6v9h-5v-5H9v5H4z",
  drop: "M12 3.5c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0c0-2.9 2.5-6.3 6-10.5z",
  waterfall: "M5 4h14M8 4v9M12 4v12M16 4v9M4 19c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5",
  lake: "M3 12c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5M3 17c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5",
  mountain: "M3 19l6.5-11 4 6.5 2.5-3.5 5 8z",
  valley: "M2 18l5-9 3 5 2-3 2 3 3-5 5 9z",
  view: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z",
  landmark: "M4 20h16M6 20v-5a6 6 0 0 1 12 0v5M12 9V4M10 5h4",
  bed: "M3 18V8M3 14h18v4M21 14v-1.5A2.5 2.5 0 0 0 18.5 10H11v4M7 12.5a1.5 1.5 0 1 1 0-.01",
  tent: "M3 20l9-15 9 15zM12 5v15M9 20l3-5 3 5",
  cabin: "M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5",
  fork: "M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-1.7 0-3 2.2-3 5v4h3v9",
  cup: "M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3",
  cross: "M9 4h6v5h5v6h-5v5H9v-5H4V9h5z",
  cash: "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM6 10v4M18 10v4",
  fuel: "M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15M4 20h11M5 10h9M14 8l3 2v7a1.5 1.5 0 0 0 3 0V9l-2-2",
  info: "M12 11v6M12 7.5v.01",
  compass: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM15.5 8.5l-2 5-5 2 2-5z",
  bag: "M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2",
  bus: "M6 4h12a2 2 0 0 1 2 2v10H4V6a2 2 0 0 1 2-2zM4 11h16M7 19v-3M17 19v-3",
} as const;

export type MapIcon = keyof typeof MAP_ICONS;
