import { listKey } from "../helper/formatKeys.js";
import redisService from "../services/redisService.js";
import type BetV2 from "@fdj/shared/types/kafka/betV2.js";

const processBets = async (userId: string): Promise<void> => {
  const key = listKey(userId);

  const pipeline = redisService.multi();
  pipeline.lRange(key, 0, -1);
  pipeline.del(key);

  const [bets] = (await pipeline.exec()) as [string[], unknown];
  if (!bets || bets.length === 0) throw new Error("Failed to execute Redis pipeline");

  const parsedBets = bets.map(bet => JSON.parse(bet) as BetV2);
  console.log(JSON.stringify(parsedBets, null, 2));
};

export default processBets;
