import BatEnvelope from "./batEnvelope.js";

type Meta = {
  id: string;
  key: string;
};

type Info = {
  name: string;
  team: string;
};

type Stats = {
  price: number;
  amount: number;
};

type BetV2 = BatEnvelope<{
  meta: Meta;
  info: Info;
  stats: Stats;
}>;

export default BetV2;
