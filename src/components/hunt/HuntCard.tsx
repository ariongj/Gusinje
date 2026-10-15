"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Hunt.module.css";

/** A hunt's card on the hub: tilts a little towards the pointer, like a card picked up from a table. */
export function HuntCard({ href, children, slug }: { href: string; children: ReactNode; slug: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
  };
  const leave = () => {
    ref.current?.style.removeProperty("--ry");
    ref.current?.style.removeProperty("--rx");
  };
  return (
    <Link ref={ref} href={href} className={cx(styles.huntCard, styles.tilt)} data-hunt={slug} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </Link>
  );
}
