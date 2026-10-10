import styles from "./ValleyMap.module.css";

/**
 * Illustrative map of the valley from Gusinje up to Vusanje and the
 * Ropojana — not to scale. North is up: Hotel ROSI on the road into Gusinje,
 * Ali Pasha's Springs south of town, Eko Katun ROSI by the bridge below
 * Vusanje, Grlja and Oko Skakavice beyond, and the Ropojana valley running
 * on to the Albanian border.
 */
export function ValleyMap({ titleId = "valley-map-title" }: { titleId?: string }) {
  return (
    <svg className={styles.map} viewBox="0 0 520 480" role="img" aria-labelledby={titleId}>
      <title id={titleId}>
        Illustrative map, not to scale: Hotel ROSI on the road into Gusinje from Plav; Ali Pasha&apos;s Springs about
        2 km south of town; Eko Katun ROSI about 2 km further up the valley, below the village of Vusanje; the Grlja
        waterfall and Oko Skakavice just beyond; the Ropojana valley running south to the Albanian border, with
        Karanfili to the west and Zla Kolata on the border to the south-east.
      </title>
      <defs>
        <pattern id={`${titleId}-dots`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#0f3b3f" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="520" height="480" fill={`url(#${titleId}-dots)`} />

      {/* Mountains */}
      <g className={styles.peaks}>
        <path d="M20 70 L62 22 L98 58 L126 34 L170 82 Z" />
        <path d="M352 340 L384 268 L404 300 L424 254 L452 316 L472 296 L506 372 Z" />
        <path d="M14 430 L52 352 L78 384 L104 336 L140 410 L160 392 L190 466 L14 466 Z" />
        <path d="M262 476 L300 404 L330 440 L356 396 L404 476 Z" />
      </g>
      <text x="64" y="94" className={styles.range}>
        VISITOR
      </text>
      {/* Karanfili rises west of the Ropojana; Zla Kolata stands on the border to the south-east. */}
      <text x="40" y="460" className={styles.range}>
        KARANFILI
      </text>
      <text x="330" y="390" textAnchor="middle" className={styles.range}>
        ZLA KOLATA
      </text>

      {/* Border */}
      <path d="M150 478 C 190 452, 250 470, 300 456 S 380 440, 420 476" className={styles.border} />
      <text x="214" y="472" className={styles.borderLabel}>
        Albania
      </text>

      {/* Rivers: the Ljuča flows out of town towards Lake Plav */}
      <path d="M236 214 C 240 180, 250 150, 262 128 S 300 80, 340 52 S 410 20, 470 6" className={styles.river} />
      <path d="M40 150 C 110 150, 180 136, 262 128" className={styles.river} />
      <path d="M214 372 C 222 330, 228 290, 232 250 S 236 222, 236 214" className={styles.stream} />

      {/* Roads */}
      <path d="M508 30 C 440 52, 380 70, 318 92 S 270 116, 262 128" className={styles.road} />
      <path d="M262 128 C 252 160, 246 200, 246 236 S 238 300, 236 330 S 224 360, 214 372" className={styles.road} />
      <path d="M214 372 C 204 400, 196 430, 190 462" className={styles.track} />

      {/* Gusinje */}
      <g className={styles.town}>
        <rect x="244" y="112" width="12" height="9" rx="1.5" />
        <rect x="260" y="104" width="10" height="8" rx="1.5" />
        <rect x="270" y="122" width="11" height="9" rx="1.5" />
        <rect x="252" y="128" width="9" height="8" rx="1.5" />
        <rect x="234" y="124" width="9" height="8" rx="1.5" />
      </g>
      <text x="186" y="108" className={styles.label}>
        Gusinje
      </text>

      {/* Ali Pasha's Springs */}
      <circle cx="236" cy="214" r="9" className={styles.pool} />
      <text x="254" y="219" className={styles.small}>
        Ali Pasha&apos;s Springs
      </text>

      {/* Vusanje */}
      <g className={styles.town}>
        <rect x="200" y="300" width="9" height="7" rx="1.5" />
        <rect x="212" y="292" width="8" height="7" rx="1.5" />
        <rect x="194" y="312" width="8" height="7" rx="1.5" />
      </g>
      <text x="128" y="300" className={styles.label}>
        Vusanje
      </text>

      {/* Grlja and Oko Skakavice */}
      <path d="M214 372 l-6 10" className={styles.fall} />
      <text x="128" y="376" className={styles.small}>
        Grlja waterfall
      </text>
      <circle cx="198" cy="416" r="7" className={styles.pool} />
      <text x="110" y="420" className={styles.small}>
        Oko Skakavice
      </text>
      <text x="206" y="446" className={styles.valley}>
        Ropojana
      </text>

      {/* Directions out */}
      <text x="512" y="52" textAnchor="end" className={styles.route}>
        Plav · Lake Plav 11 km ↗
      </text>
      <text x="18" y="142" className={styles.route}>
        ← Grnčar border
      </text>

      {/* Hotel ROSI */}
      <g className={styles.pin}>
        <circle cx="318" cy="92" r="15" className={styles.pulse} />
        <circle cx="318" cy="92" r="8.5" />
        <circle cx="318" cy="92" r="3.2" fill="#fff" />
      </g>
      <rect x="334" y="96" width="104" height="28" rx="14" className={styles.tag} />
      <text x="386" y="115" textAnchor="middle" className={styles.tagText}>
        Hotel ROSI
      </text>

      {/* Eko Katun ROSI */}
      <g className={styles.pin}>
        <circle cx="236" cy="330" r="15" className={styles.pulse} />
        <circle cx="236" cy="330" r="8.5" />
        <circle cx="236" cy="330" r="3.2" fill="#fff" />
      </g>
      <rect x="252" y="320" width="136" height="28" rx="14" className={styles.tag} />
      <text x="320" y="339" textAnchor="middle" className={styles.tagText}>
        Eko Katun ROSI
      </text>

      {/* North arrow */}
      <g className={styles.north} transform="translate(484 430)">
        <path d="M0 -18 L7 6 L0 1 L-7 6 Z" />
        <text y="22" textAnchor="middle">
          N
        </text>
      </g>
    </svg>
  );
}
