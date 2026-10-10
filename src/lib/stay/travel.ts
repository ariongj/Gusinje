/**
 * Getting to Gusinje and Vusanje. Distances from Booking.com; driving times
 * computed with OSRM and without border waits; bus times from Rome2rio (see
 * the project fact sheet) — all approximate.
 */
export const gettingHere = [
  {
    label: "By car from Podgorica",
    value: "About 80 km — around 2 hours via Albania (Hani i Hotit – Vermosh – Grnčar) or 3 hours via Andrijevica",
  },
  { label: "By bus", value: "Daily buses Podgorica – Gusinje (about 4 hours); the hotel is a minute from the bus station" },
  { label: "From Tirana airport", value: "About 4 hours by car via Shkodër" },
  { label: "Shuttles", value: "Airport and trailhead transfers on request (extra charge)" },
] as const;
