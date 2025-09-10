import type { Odds } from "./odds";

export type GoupedOdds = {
  date: string;
  num_events: number;
  events: Odds;
};
