import SHA256 from "crypto-js/sha256";
import type { Odds } from "@fdj/shared/types/odds";
import type { GroupedOdds } from "@/types/groupedOdds";

const transformEvents = (data: Odds[]): GroupedOdds[] => {
  // Intl formatter for pretty date (system local time)
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // system local
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const grouped: Record<string, Odds[]> = {};

  for (const event of data) {
    event.bookmakers.forEach(bookmaker => {
      bookmaker.markets
        .flatMap(market => market.outcomes)
        .forEach(outcome => {
          const hash = SHA256(`${event.id}-${bookmaker.key}-${outcome.name}`);
          outcome.id = hash.toString();
        });
    });

    const localDate = new Date(event.commence_time);
    const compareDate = new Date(localDate);
    compareDate.setHours(0, 0, 0, 0);

    let formattedDate: string;

    if (compareDate.getTime() === today.getTime()) formattedDate = "Today";
    else if (compareDate.getTime() === tomorrow.getTime()) formattedDate = "Tomorrow";
    else formattedDate = formatter.format(localDate);

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
