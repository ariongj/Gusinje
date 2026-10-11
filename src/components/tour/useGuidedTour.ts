"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";

/** What the hook needs from a stop. */
export type TimedStop = { title: string; text: string };

/** How long a stop stays up when the tour plays without voice. */
export function stopDuration(stop: TimedStop): number {
  const words = stop.text.split(/\s+/).length;
  return Math.min(14000, Math.max(8000, 5200 + words * 260));
}

/** Speech-synthesis language prefixes to look for, per site language (closest available voice for Montenegrin). */
const VOICE_LANGS: Record<Locale, string[]> = { en: ["en-GB", "en"], sq: ["sq"], cnr: ["sr", "hr", "bs"] };

function pickVoice(lang: Locale): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  for (const prefix of VOICE_LANGS[lang]) {
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
    if (voice) return voice;
  }
  return undefined;
}

/**
 * Plays a sequence of stops: auto-advances (or waits for the narration to
 * finish when voice is on), with back / next / pause / restart, ← → keys and
 * Escape. `onStop` moves the stage — it is called from the event that
 * changes stop.
 */
export function useGuidedTour<S extends TimedStop>(stops: readonly S[], onStop: (stop: S, index: number) => void, lang: Locale) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voice, setVoice] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  /** Bumped whenever the current stop's timer restarts (for the progress bar). */
  const [run, setRun] = useState(0);

  const onStopRef = useRef(onStop);
  useEffect(() => {
    onStopRef.current = onStop;
  });
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Voice only where the browser has a voice for this language.
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const check = () => setVoiceAvailable(!!pickVoice(lang));
    check();
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
  }, [lang]);

  const last = stops.length - 1;

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(stops.length - 1, i));
      setIndex(next);
      setRun((n) => n + 1);
      onStopRef.current(stops[next], next);
    },
    [stops],
  );

  // Step by step unless the visitor presses Play: the tour waits for "Next".
  const start = useCallback(() => {
    setActive(true);
    setPlaying(false);
    goTo(0);
  }, [goTo]);

  const restart = useCallback(() => {
    goTo(0);
  }, [goTo]);

  const exit = useCallback(() => {
    setActive(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const next = useCallback(() => {
    if (index >= last) exit();
    else goTo(index + 1);
  }, [index, last, exit, goTo]);

  const back = useCallback(() => goTo(index - 1), [index, goTo]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
    setRun((n) => n + 1);
  }, []);

  const pause = useCallback(() => setPlaying(false), []);

  // Turning voice off cancels speech through the voice effect's cleanup.
  const toggleVoice = useCallback(() => {
    setVoice((v) => !v);
    setRun((n) => n + 1);
  }, []);

  // Silent mode: advance on a timer.
  useEffect(() => {
    if (!active || !playing || voice || index >= last) return;
    const timer = setTimeout(() => goTo(index + 1), stopDuration(stops[index]));
    return () => clearTimeout(timer);
  }, [active, playing, voice, index, last, stops, goTo, run]);

  // Voice mode: read the stop, then move on once it has been said.
  useEffect(() => {
    if (!active || !voice || !voiceAvailable) return;
    const synth = window.speechSynthesis;
    const stop = stops[index];
    const utterance = new SpeechSynthesisUtterance(`${stop.title}. ${stop.text}`);
    const chosen = pickVoice(lang);
    if (chosen) {
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
    }
    utterance.rate = 0.97;
    let timer: ReturnType<typeof setTimeout> | undefined;
    utterance.onend = () => {
      if (playingRef.current && index < last) timer = setTimeout(() => goTo(index + 1), 900);
    };
    synth.cancel();
    synth.speak(utterance);
    if (!playingRef.current) synth.pause();
    return () => {
      clearTimeout(timer);
      utterance.onend = null;
      synth.cancel();
    };
  }, [active, voice, voiceAvailable, index, last, stops, goTo, lang]);

  useEffect(() => {
    if (!active || !voice || !voiceAvailable) return;
    if (playing) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
  }, [active, voice, voiceAvailable, playing]);

  // Arrow keys step through the tour; Escape ends it. Keys typed into fields
  // and pressed inside dialogs are left alone.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target;
      if (target instanceof HTMLElement && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return;
      if (target instanceof Element && target.closest('[role="dialog"]')) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        back();
      } else if (e.key === "Escape") {
        exit();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [active, next, back, exit]);

  // Stop talking if the page goes away mid-sentence.
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  return {
    active,
    index,
    stop: stops[index],
    total: stops.length,
    isLast: index >= last,
    playing,
    voice,
    voiceAvailable,
    /** Changes whenever the progress bar should restart. */
    runKey: `${index}-${run}`,
    duration: stops[index] ? stopDuration(stops[index]) : 0,
    start,
    restart,
    exit,
    next,
    back,
    goTo,
    togglePlay,
    pause,
    toggleVoice,
  };
}
