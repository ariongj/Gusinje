import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import ui from "@/styles/ui.module.css";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Book your stay", href: "/#book" }} />
      <main>
        <section className={styles.hero} data-nav-anchor>
          <div className={ui.eyebrowLight}>Page not found</div>
          <h1 className={styles.title}>
            This path leads
            <br />
            <em>off the trail.</em>
          </h1>
          <p className={styles.text}>The page you were looking for has moved or no longer exists.</p>
          <div className={styles.actions}>
            <Link href="/" className={ui.btnGold}>
              Back to ROSI
            </Link>
            <Link href="/contact" className={ui.btnOutlineLight}>
              Contact us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
