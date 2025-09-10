import type { Outcomes } from "./outcomes.js";

export type SlipItem = Outcomes & {
  team: string;
  amount: number;
};
