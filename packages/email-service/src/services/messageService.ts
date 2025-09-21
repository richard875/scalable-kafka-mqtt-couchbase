import redisService from "./redisService.js";
import processBets from "../helper/processBets.js";
import type BetV2 from "@fdj/shared/types/kafka/betV2.js";
import type BatEnvelope from "@fdj/shared/types/kafka/batEnvelope.js";

const BET_SCHEMA_VERSION = "v2";

const handleMessage = async (topic: string, message: BatEnvelope<unknown>): Promise<void> => {
  try {
    if (
      (!message || message.version !== BET_SCHEMA_VERSION) &&
      process.env.NODE_ENV !== "production"
    ) {
      throw new Error("DEV Only Error: Invalid message format or unsupported version");
    }

    const localMessage = message as BetV2;
    if (!localMessage.payload.meta.userId) throw new Error("Missing userId in message payload");

    const userId = localMessage.payload.meta.userId;
    const isLast = localMessage.payload.meta.isLast;

    // Store the bet in Redis
    await redisService.addBet(userId, localMessage);

    // If it's the last message in the batch, process bets immediately
    // Add fallback to process bets after a timeout if no new messages arrive
    if (isLast) await processBets(userId);
    else await redisService.resetBetTimer(userId);
  } catch (error) {
    console.error(`Failed to perform email service for topic ${topic}:`, error);
    // Don't re-throw the error to prevent message processing from stopping
    // Instead, log the error and continue processing other messages
  }
};

export default handleMessage;
