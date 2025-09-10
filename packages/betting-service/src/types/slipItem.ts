import type { Outcomes } from "./outcomes.js";

export type SlipItem = Outcomes & {
  key: string;
  team: string;
  amount: number;
};
