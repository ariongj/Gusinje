"use client";

import { useEffect } from "react";

/**
 * Drives the scroll reveals declared with data-reveal (styles in
 * globals.css). Mounted once in the root layout; picks up elements added by
 * client-side navigation through a MutationObserver.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    // Hydrated after the CSS fallback already showed everything: skip the
    // animations rather than hiding content again.
    const late = performance.now() > 2800;
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      root.setAttribute("data-reveal-ready", "");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // In view, or already scrolled past (e.g. landing on /#book).
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const track = (el: Element) => {
      if (el.hasAttribute("data-revealed")) return;
      if (late) reveal(el);
      else io.observe(el);
    };

    document.querySelectorAll("[data-reveal]").forEach(track);
    root.setAttribute("data-reveal-ready", "");

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) track(node);
          node.querySelectorAll("[data-reveal]").forEach(track);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
