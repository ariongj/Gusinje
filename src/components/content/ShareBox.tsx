import QRCode from "qrcode";

import { absoluteUrl } from "@/config/brand";
import { href, type Locale } from "@/i18n/config";
import { fill } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";

import { CopyLinkButton } from "./CopyLinkButton";
import styles from "./ShareBox.module.css";

type Props = { lang: Locale; t: Messages; path: string; title: string };

/**
 * A stable link to the page and a QR code for it — generated at build time
 * as SVG, so it prints sharply on cards at accommodation and info points.
 */
export async function ShareBox({ lang, t, path, title }: Props) {
  const url = absoluteUrl(href(lang, path));
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0f3b3fff", light: "#ffffffff" } });
  const download = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const fileName = `qr-${path.replace(/^\//, "").replace(/\//g, "-") || "home"}-${lang}.svg`;
  return (
    <section className={styles.box} aria-labelledby="share-title">
      <h2 id="share-title" className={styles.title}>
        {t.common.share}
      </h2>
      <div className={styles.row}>
        <div className={styles.qr} role="img" aria-label={fill(t.common.qrAlt, { url })} dangerouslySetInnerHTML={{ __html: svg }} />
        <div className={styles.actions}>
          <p className={styles.url}>{url}</p>
          <CopyLinkButton url={url} title={title} />
          <a href={download} download={fileName} className={styles.download}>
            {t.common.qrTitle} (SVG)
          </a>
        </div>
      </div>
    </section>
  );
}
