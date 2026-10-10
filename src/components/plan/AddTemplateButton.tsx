"use client";

import { useState } from "react";

import { useI18n } from "@/i18n/client";
import { tripActions, type Trip } from "@/lib/trip";
import ui from "@/styles/ui.module.css";

/** Copy an itinerary template (or a shared trip) into My Trip. */
export function AddTemplateButton({ trip, label }: { trip: Trip; label?: string }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <div className={ui.actions}>
      <button
        type="button"
        className={ui.button}
        onClick={() => {
          setDone(tripActions.merge(trip));
        }}
      >
        {label ?? t.plan.useTemplate}
      </button>
      <span role="status" className={ui.small}>
        {done ? t.plan.added : ""}
      </span>
    </div>
  );
}
