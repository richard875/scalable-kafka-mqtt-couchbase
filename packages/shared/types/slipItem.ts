import type Outcomes from "./outcomes";

export type SlipItem = Outcomes & {
  key: string;
  team: string;
  amount: number;
};
