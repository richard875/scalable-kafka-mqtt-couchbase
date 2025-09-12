import type Outcomes from "./outcomes.js";

type SlipItem = Outcomes & {
  key: string;
  team: string;
  amount: number;
};

export default SlipItem;
