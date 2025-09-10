import type { Outcomes } from "./odds";

export type SlipItem = Outcomes & {
  team: string;
  amount: number;
};
