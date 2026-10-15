"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Guidance = {
  active: boolean;
  position: { lat: number; lng: number; accuracy: number } | null;
  /** Compass heading in degrees (0 = north, clockwise), when the device gives one. */
  heading: number | null;
  error: "denied" | "unavailable" | null;
  start: () => void;
  stop: () => void;
};

type OrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };

/**
 * "Hot or cold": the visitor's position and, where the phone offers one, its
 * compass heading, read on the device and never sent anywhere.
 */
export function useGuidance(): Guidance {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState<Guidance["position"]>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<Guidance["error"]>(null);
  const watchRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    setActive(false);
    setPosition(null);
    setHeading(null);
  }, []);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("unavailable");
      return;
    }
    setError(null);
    setActive(true);
    // iPhones ask before sharing the compass.
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    DOE?.requestPermission?.().catch(() => undefined);
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (e) => {
        setError(e.code === e.PERMISSION_DENIED ? "denied" : "unavailable");
        if (e.code === e.PERMISSION_DENIED) stop();
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 20_000 },
    );
  }, [stop]);

  useEffect(() => {
    if (!active) return;
    let last = -10;
    const onOrient = (e: Event) => {
      const o = e as OrientationEvent;
      const h = o.webkitCompassHeading ?? (o.absolute && o.alpha !== null ? (360 - o.alpha) % 360 : null);
      if (h === null || Math.abs(h - last) < 2) return;
      last = h;
      setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute", onOrient);
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrient);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [active]);

  useEffect(() => () => stop(), [stop]);

  return { active, position, heading, error, start, stop };
}
