"use client";

import { StickyBar } from "@/components/layout/StickyBar";
import { StickyAction, StickyLabel } from "@/components/layout/StickyParts";
import { plural, shortDate } from "@/lib/format";
import { getProperty } from "@/lib/stay/properties";

import { useHomeBooking } from "./HomeBooking";

export function HomeStickyBar() {
  const { search } = useHomeBooking();

  return (
    <StickyBar>
      <StickyLabel>
        {search ? (
          <>
            {getProperty(search.property).name}{" "}
            <em>
              · {shortDate(search.checkin)}, {plural(search.nights, "night")}
            </em>
          </>
        ) : (
          <>
            Eko Katun & Hotel ROSI <em>· booked with the family, no fees</em>
          </>
        )}
      </StickyLabel>
      <StickyAction href={search ? "#results" : "#book"}>{search ? "Your options" : "Check dates"}</StickyAction>
    </StickyBar>
  );
}
