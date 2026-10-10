import type { Metadata } from "next";

import { Explorer } from "@/components/explore/Explorer";
import { getMessages, resolveLocale } from "@/i18n";
import { exploreItems, exploreTours } from "@/lib/explore-data";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/explore">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/explore", title: t.explore.title, description: t.explore.intro });
}

export default async function ExplorePage({ params }: PageProps<"/[lang]/explore">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  // Full screen: the explorer draws its own title bar.
  return <Explorer title={t.explore.title} lead={t.explore.intro} items={exploreItems(lang)} tours={exploreTours(lang)} />;
}
