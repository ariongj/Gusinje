import { brand } from "@/config/brand";
import { cnr } from "@/i18n/messages/cnr";
import { en } from "@/i18n/messages/en";
import { sq } from "@/i18n/messages/sq";
import { locales, localeNames } from "@/i18n/config";

import styles from "./page.module.css";

const choose = { en: en.chooseLanguage, sq: sq.chooseLanguage, cnr: cnr.chooseLanguage };

/**
 * Static hosting has no server redirects: this page sends visitors to the
 * language their browser prefers, and shows plain links when scripts are off.
 */
const redirect = `(function(){try{var b=${JSON.stringify(brand.basePath)};var l=(navigator.languages||[navigator.language||"en"]).map(function(x){return String(x).toLowerCase()});var t="en";for(var i=0;i<l.length;i++){var c=l[i];if(c.indexOf("sq")===0){t="sq";break}if(c.indexOf("cnr")===0||c.indexOf("sr-me")===0||c.indexOf("sh")===0||c.indexOf("sr")===0||c.indexOf("bs")===0||c.indexOf("hr")===0){t="cnr";break}if(c.indexOf("en")===0){t="en";break}}location.replace(b+"/"+t+"/"+location.hash)}catch(e){}})();`;

export default function LanguageRoot() {
  return (
    <main className={styles.page}>
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <p className={styles.region}>{brand.region}</p>
      <h1 className={styles.title}>{brand.name.en}</h1>
      <ul className={styles.list}>
        {locales.map((l) => (
          <li key={l}>
            <a href={`${brand.basePath}/${l}/`} lang={l} hrefLang={l} className={styles.link}>
              <span>{localeNames[l]}</span>
              <span className={styles.hint}>{choose[l]}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
