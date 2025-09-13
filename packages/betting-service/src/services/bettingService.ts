import type { Odds } from "@fdj/shared/types/odds";
import type SlipItem from "@fdj/shared/types/slipItem";
import type BetResult from "@fdj/shared/types/betResult";
import kafkaService from "@fdj/shared/services/kafkaService";
import SlipItemSchema from "../schemas/slipItemSchema.js";
import getLiveData from "@betting-service/helper/getLiveData.js";
import getMockData from "@betting-service/helper/getMockData.js";

export const getOddsData = async (sport: string, live: string): Promise<Odds[]> => {
  const isLive = live === "true";
  return isLive ? await getLiveData(sport) : await getMockData(sport);
};

export const placeBets = async (bet: unknown): Promise<BetResult> => {
  try {
    // Validate the bet using Zod schema
    const validationResult = SlipItemSchema.safeParse(bet);
    if (!validationResult.success) {
      const validationError = validationResult.error.issues
        .map(issue => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      return { success: false, error: "Validation failed", validationError };
    }

    const validatedBet = validationResult.data as SlipItem;
    await kafkaService.publishMessage(validatedBet.key, validatedBet);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error placing bet:", errorMessage);

    return { success: false, error: `Failed to place bet: ${errorMessage}` };
  }
};
