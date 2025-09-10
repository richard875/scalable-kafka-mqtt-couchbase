import type { Odds } from "@/types/odds";
import type { GoupedOdds } from "@/types/groupedOdds";

const transformEvents = (data: Odds[]): GoupedOdds[] => {
  // Intl formatter for pretty date (system local time)
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // system local
  });

  const grouped: Record<string, Odds[]> = {};

  for (const event of data) {
    const localDate = new Date(event.commence_time);
    const formattedDate = formatter.format(localDate); // e.g. "12 September 2025"

    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(event);
  }

  return Object.entries(grouped).map(([date, events]) => ({
    date,
    num_events: events.length,
    events,
  }));
};

export default transformEvents;
