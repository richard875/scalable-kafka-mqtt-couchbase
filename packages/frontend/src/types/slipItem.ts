import type { Outcomes } from "./odds";

export type SlipItem = Outcomes & {
  key: string;
  team: string;
  amount: number;
};
