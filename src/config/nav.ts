import type { Messages } from "@/i18n/messages/en";

export type NavKey = keyof Pick<Messages["nav"], "explore" | "hunt" | "places" | "stay" | "eatDrink" | "guides" | "tips" | "plan" | "about">;

/** The main navigation, in order. Paths are without the language prefix. */
export const mainNav: readonly { key: NavKey; path: string }[] = [
  { key: "explore", path: "/explore" },
  { key: "hunt", path: "/hunt" },
  { key: "places", path: "/places" },
  { key: "stay", path: "/stay" },
  { key: "eatDrink", path: "/eat-drink" },
  { key: "guides", path: "/guides-experiences" },
  { key: "tips", path: "/travel-tips" },
  { key: "plan", path: "/plan" },
  { key: "about", path: "/about" },
];
