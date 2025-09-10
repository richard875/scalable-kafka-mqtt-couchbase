import type { Odds } from "./odds";

export type GroupedOdds = {
  date: string;
  num_events: number;
  events: Odds[];
};
