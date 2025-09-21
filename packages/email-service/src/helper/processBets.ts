import redisService from "../services/redisService.js";
import type BetV2 from "@fdj/shared/types/kafka/betV2.js";
import { listKey, ttlKey } from "../helper/formatKeys.js";
import sendBetslipEmail from "../services/emailService.js";

const processBets = async (userId: string): Promise<void> => {
  try {
    const key = listKey(userId);
    const ttl = ttlKey(userId);

    const pipeline = redisService.multi();
    pipeline.lRange(key, 0, -1);
    pipeline.del(key);
    pipeline.del(ttl);

    const [bets] = (await pipeline.exec()) as [string[], unknown];
    if (!bets || bets.length === 0) throw new Error("Failed to execute Redis pipeline");

    const parsedBets = bets.map(bet => JSON.parse(bet) as BetV2);
    await sendBetslipEmail(parsedBets);
  } catch (error) {
    console.error("Error processing bets:", error);
  }
};

export default processBets;
