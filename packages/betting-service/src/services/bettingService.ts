import type SlipItem from "@fdj/shared/types/slipItem";
import kafkaService from "@fdj/shared/services/kafkaService";

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
