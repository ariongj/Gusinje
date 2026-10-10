import Link from "next/link";

import { brand } from "@/config/brand";
import { href, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n";

import styles from "./SiteFooter.module.css";

export function SiteFooter({ lang }: { lang: Locale }) {
  const t = getMessages(lang);
  const columns = [
    {
      title: t.footer.explore,
      links: [
        { label: t.nav.explore, path: "/explore" },
        { label: t.nav.places, path: "/places" },
        { label: t.footer.tours, path: "/tours" },
        { label: t.footer.hikes, path: "/hikes" },
        { label: t.nav.about, path: "/about" },
        { label: t.footer.history, path: "/about/history" },
      ],
    },
    {
      title: t.footer.practical,
      links: [
        { label: t.nav.stay, path: "/stay" },
        { label: t.nav.eatDrink, path: "/eat-drink" },
        { label: t.nav.guides, path: "/guides-experiences" },
        { label: t.footer.directory, path: "/directory" },
        { label: t.nav.tips, path: "/travel-tips" },
        { label: t.footer.services, path: "/services" },
        { label: t.nav.plan, path: "/plan" },
      ],
    },
    {
      title: t.footer.project,
      links: [
        { label: t.footer.aboutPlatform, path: "/about/platform" },
        { label: t.footer.contribute, path: "/contribute" },
        { label: t.footer.partners, path: "/partners" },
        { label: t.footer.credits, path: "/credits" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <p className={styles.wordmark}>{brand.name[lang]}</p>
          <p className={styles.region}>{brand.region}</p>
          <p className={styles.note}>{t.meta.independent}</p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className={styles.column}>
            <h2 className={styles.heading}>{column.title}</h2>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.path}>
                  <Link href={href(lang, link.path)} className={styles.link} prefetch={false}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={styles.bottom}>
        <p>
          {t.footer.creator}{" "}
          <a href={brand.creator.website} className={styles.inline}>
            {t.footer.rosiSite}
          </a>
          . {t.footer.notOfficial}
        </p>
        <p>{t.footer.mapData}</p>
        <p>
          © {brand.copyrightYear} ROSI ·{" "}
          <Link href={href(lang, "/admin")} className={styles.inline} prefetch={false}>
            {t.footer.admin}
          </Link>
        </p>
      </div>
    </footer>
  );
}
