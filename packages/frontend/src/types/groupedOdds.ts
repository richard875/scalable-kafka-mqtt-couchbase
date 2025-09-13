import type { Odds } from "@fdj/shared/types/odds";

export type GroupedOdds = {
  date: string;
  num_events: number;
  events: Odds[];
};
