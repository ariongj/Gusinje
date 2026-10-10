"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { stopDuration, type GuideStop } from "./guide";

const subscribeNoop = () => () => {};

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => /^en-GB/i.test(v.lang)) ?? voices.find((v) => /^en/i.test(v.lang));
}

/**
 * Plays a sequence of stops: auto-advances (or waits for the narration to
 * finish when voice is on), with back / next / pause, ← → keys and Escape.
 * `onStop` moves the stage — it is called from the event that changes stop.
 */
export function useGuidedTour(stops: readonly GuideStop[], onStop: (stop: GuideStop) => void) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voice, setVoice] = useState(false);
  /** Bumped whenever the current stop's timer restarts (for the progress bar). */
  const [run, setRun] = useState(0);
  const voiceAvailable = useSyncExternalStore(
    subscribeNoop,
    () => "speechSynthesis" in window,
    () => false,
  );

  const onStopRef = useRef(onStop);
  useEffect(() => {
    onStopRef.current = onStop;
  });
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const last = stops.length - 1;

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(stops.length - 1, i));
      setIndex(next);
      setRun((n) => n + 1);
      onStopRef.current(stops[next]);
    },
    [stops],
  );

  const start = useCallback(() => {
    setActive(true);
    setPlaying(true);
    goTo(0);
  }, [goTo]);

  const exit = useCallback(() => {
    setActive(false);
    if (voiceAvailable) window.speechSynthesis.cancel();
  }, [voiceAvailable]);

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
    utterance.lang = "en-GB";
    utterance.rate = 0.97;
    const chosen = pickVoice();
    if (chosen) utterance.voice = chosen;
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
  }, [active, voice, voiceAvailable, index, last, stops, goTo]);

  useEffect(() => {
    if (!active || !voice || !voiceAvailable) return;
    if (playing) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
  }, [active, voice, voiceAvailable, playing]);

  // Arrow keys step through the tour (capture phase, ahead of page shortcuts).
  // Keys pressed in a dialog (the booking drawer: Escape closes just that) and
  // arrows pressed inside the 360° viewer (they look around) are left alone.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target;
      if (target instanceof HTMLElement && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) {
        return;
      }
      if (target instanceof Element) {
        if (target.closest('[role="dialog"]')) return;
        if (e.key !== "Escape" && target.closest("[data-pano]")) return;
      }
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
    duration: stopDuration(stops[index]),
    start,
    exit,
    next,
    back,
    togglePlay,
    pause,
    toggleVoice,
  };
}
