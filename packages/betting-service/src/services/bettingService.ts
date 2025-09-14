import getLiveData from "../helper/getLiveData.js";
import getMockData from "../helper/getMockData.js";
import type SlipItem from "@fdj/shared/types/slipItem";
import type BetResult from "@fdj/shared/types/betResult";
import SlipItemSchema from "../schemas/slipItemSchema.js";
import kafkaService from "@fdj/shared/services/kafkaService";

export const getOddsData = async (sport: string, live: string): Promise<BetResult> => {
  try {
    const isLive = live === "true";
    const result: BetResult = isLive ? await getLiveData(sport) : await getMockData(sport);

    if (!result.success) {
      return { success: false, error: result.error || "Error fetching odds data" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return { success: false, error: "Failed to fetch odds data" };
  }
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
