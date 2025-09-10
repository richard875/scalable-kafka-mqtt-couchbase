import kafkaService from "./kafkaService.js";
import type { SlipItem } from "../types/slipItem.js";

export const placeBetService = async (bet: SlipItem) => {
  try {
    // Publish the bet details to the Kafka topic
    await kafkaService.publishMessage(bet.key, bet);
    return { success: true };
  } catch (error) {
    console.error("Error placing bet:", error);
    return { success: false };
  }
};
