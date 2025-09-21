import { Ajv } from "ajv";
import getLiveData from "../helper/getLiveData.js";
import getMockData from "../helper/getMockData.js";
import BetV1Schema from "../schemas/betV1Schema.js";
import BetV2Schema from "../schemas/betV2Schema.js";
import BetV1 from "@fdj/shared/types/kafka/betV1.js";
import BetV2 from "@fdj/shared/types/kafka/betV2.js";
import type SlipItem from "@fdj/shared/types/slipItem";
import type BetResult from "@fdj/shared/types/betResult";
import SlipItemSchema from "../schemas/slipItemSchema.js";
import kafkaService from "@fdj/shared/services/kafkaService";

const ajv = new Ajv();

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

    const validatedBet: SlipItem = validationResult.data;
    const kafkaTopic = validatedBet.key;

    // Construct the JSON schemas for Ajv validation
    const betV1: BetV1 = {
      version: "v1",
      payload: validatedBet,
    };

    const betV2: BetV2 = {
      version: "v2",
      payload: {
        meta: { id: validatedBet.id, key: validatedBet.key, userId: validatedBet.userId },
        info: { name: validatedBet.name, team: validatedBet.team, isLast: validatedBet.isLast },
        stats: { price: validatedBet.price, amount: validatedBet.amount },
      },
    };

    // Validate against both BetV1 and BetV2 schemas
    const validateV1 = ajv.compile(BetV1Schema);
    const validateV2 = ajv.compile(BetV2Schema);

    const isValidV1 = validateV1(betV1);
    const isValidV2 = validateV2(betV2);

    // Publish to Kafka if valid
    if (isValidV1) await kafkaService.publishMessage(kafkaTopic, betV1);
    if (isValidV2) await kafkaService.publishMessage(kafkaTopic, betV2);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error placing bet:", errorMessage);

    return { success: false, error: `Failed to place bet: ${errorMessage}` };
  }
};
