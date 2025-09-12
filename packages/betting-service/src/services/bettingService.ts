import type SlipItem from "@fdj/shared/types/slipItem";
import kafkaService from "@fdj/shared/services/kafkaService";
import SlipItemSchema from "../schemas/slipItemSchema.js";

type BetResult = {
  success: boolean;
  error?: string;
  validationErrors?: string[];
};

export const placeBetService = async (bet: unknown): Promise<BetResult> => {
  try {
    // Validate the bet using Zod schema
    const validationResult = SlipItemSchema.safeParse(bet);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.issues.map(
        issue => `${issue.path.join(".")}: ${issue.message}`
      );

      return { success: false, error: "Validation failed", validationErrors };
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
