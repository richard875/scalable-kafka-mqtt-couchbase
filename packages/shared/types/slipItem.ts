import type Outcomes from "./outcomes";

type SlipItem = Outcomes & {
  key: string;
  team: string;
  amount: number;
};

export default SlipItem;
