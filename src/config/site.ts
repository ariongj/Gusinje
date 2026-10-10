/**
 * Brand, contact details and navigation shared by every page.
 * Property-specific details (addresses, check-in times, Booking.com links)
 * live in src/lib/stay/properties.ts.
 */

const EMAIL = "hotelrosigusinje@hotmail.com";

export const site = {
  name: "Hotel & Eko Katun ROSI",
  shortName: "ROSI",
  wordmark: "ROSI",
  /** Small line under the wordmark. */
  subtitle: "Hotel & Eko Katun",
  region: "Gusinje · Vusanje · Montenegro",
  description:
    "Two family-run places to stay in the Accursed Mountains of Montenegro: Eko Katun ROSI in Vusanje — wooden bungalows, farm animals and home cooking beside an old stone tower — and Hotel ROSI, a family hotel with a restaurant in Gusinje.",
  tagline:
    "Two ways to stay in the mountains — a family-run eco katun in Vusanje and a hotel in Gusinje, at the foot of the Prokletije.",
  /** Public URL (no trailing slash), used for canonical URLs, sitemap and structured data. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ariongj.github.io/hotelplav").replace(/\/+$/, ""),
  /** Main number for both properties (Instagram, Facebook, Gusinje Tourism Organisation). */
  phone: { display: "+382 69 610 999", href: "tel:+38269610999" },
  /** Further numbers listed on the family's Instagram profile. */
  otherPhones: [
    { display: "+382 69 544 177", href: "tel:+38269544177" },
    { display: "+382 69 634 835", href: "tel:+38269634835" },
  ],
  email: { display: EMAIL, href: `mailto:${EMAIL}` },
  social: [
    { short: "ig", label: "Instagram", handle: "@rosi_hotel", href: "https://www.instagram.com/rosi_hotel/" },
    {
      short: "fb",
      label: "Facebook",
      handle: "Hotel-Eko Katun ROSI",
      href: "https://www.facebook.com/p/Hotel-Eko-Katun-ROSI-100063753782766/",
    },
  ],
  legal: [{ label: "Photo credits", href: "/credits" }],
  copyrightYear: 2026,
} as const;

export type NavKey = "katun" | "hotel" | "rooms" | "dining" | "experiences" | "tour" | "contact";

export type NavItem = {
  key: NavKey;
  /** Label in the desktop bar. */
  label: string;
  /** Label in the mobile menu and footer. */
  longLabel: string;
  href: string;
};

export const mainNav: readonly NavItem[] = [
  { key: "katun", label: "Eko Katun", longLabel: "Eko Katun ROSI · Vusanje", href: "/katun" },
  { key: "hotel", label: "Hotel", longLabel: "Hotel ROSI · Gusinje", href: "/hotel" },
  { key: "rooms", label: "Stay", longLabel: "Rooms & bungalows", href: "/rooms" },
  { key: "dining", label: "Food", longLabel: "Food & restaurants", href: "/dining" },
  { key: "experiences", label: "Explore", longLabel: "Explore the Prokletije", href: "/experiences" },
  { key: "tour", label: "3D valley", longLabel: "3D valley & guided tour", href: "/tour" },
  { key: "contact", label: "Contact", longLabel: "Contact", href: "/contact" },
];

/** Mobile menu and footer "Explore" list. */
export const exploreNav: readonly { label: string; href: string }[] = [
  ...mainNav.map((item) => ({ label: item.longLabel, href: item.href })),
  { label: "Gallery", href: "/#gallery" },
];

export type Cta = { label: string; href: string };
