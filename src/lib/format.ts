/** "3 nights" / "1 night". */
export function plural(count: number, one: string, many = one + "s"): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** "28 Oct" from an ISO date (YYYY-MM-DD), independent of the viewer's time zone. */
export function shortDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
