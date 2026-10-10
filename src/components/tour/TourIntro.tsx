import styles from "./TourIntro.module.css";

/**
 * Page header above the 3D valley: a deep teal gradient with the Prokletije
 * ridgeline drawn along the bottom. It is the nav's scroll anchor: the nav
 * turns solid as the tour band reaches the top, so the toolbar never shows
 * through it while the stage is in view.
 */
export function TourIntro() {
  return (
    <section className={styles.intro} data-nav-anchor>
      <svg className={styles.ridge} viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="tour-ridge-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f7176" stopOpacity="0.42" />
            <stop offset="1" stopColor="#2f7176" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className={styles.ridgeBack}
          d="M0 118 L70 100 L130 108 L205 72 L260 88 L330 46 L385 78 L450 64 L520 96 L600 58 L665 34 L725 70 L805 84 L885 50 L945 64 L1015 28 L1085 66 L1160 80 L1240 52 L1310 76 L1385 66 L1440 84 V200 H0 Z"
        />
        <path
          className={styles.ridgeFront}
          d="M0 136 L90 122 L170 130 L250 104 L320 118 L410 96 L480 114 L560 102 L650 124 L740 98 L820 116 L905 106 L990 126 L1075 100 L1160 118 L1250 108 L1340 124 L1440 112 V200 H0 Z"
          fill="url(#tour-ridge-fill)"
        />
      </svg>

      <div className={styles.inner}>
        <div>
          <div className={styles.kicker} data-reveal="up">
            3D valley &middot; guided tour
          </div>
          <h1 className={styles.title} data-reveal="up" data-delay="80">
            See the valley <em>before you arrive.</em>
          </h1>
        </div>

        <div className={styles.side} data-reveal="up" data-delay="160">
          <p className={styles.lead}>
            Fly up the valley in 3D, from Hotel ROSI in Gusinje to Eko Katun ROSI in Vusanje, the Grlja waterfall and
            the peaks of the Prokletije. Wander at your own pace &mdash; or take the guided tour.
          </p>
          <ul className={styles.tips} aria-label="How to explore">
            <li className={styles.tip}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M2 8h12M2 8l2.5-2.5M2 8l2.5 2.5M14 8l-2.5-2.5M14 8l-2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              Drag to fly around
            </li>
            <li className={styles.tip}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
                <path d="M10.4 10.4 14 14M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Pinch or ctrl + scroll to zoom
            </li>
            <li className={styles.tip}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 14.5s-4.6-4.3-4.6-7.9a4.6 4.6 0 0 1 9.2 0c0 3.6-4.6 7.9-4.6 7.9z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
                <circle cx="8" cy="6.6" r="1.6" fill="currentColor" />
              </svg>
              Tap a marker to learn more
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
