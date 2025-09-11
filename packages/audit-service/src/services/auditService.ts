import SportsEnum from "@fdj/shared/enums/sportsEnum";
import kafkaService from "@fdj/shared/services/kafkaService";
import { handleMessage } from "@audit-service/services/auditLogService.js";

export const subscribeToTopics = async (): Promise<void> => {
  console.log("Subscribing to sports topics for audit logging...");
  const sportsTopics = Object.values(SportsEnum);
  const consumerGroupId = "audit-service-group";

  for (const topic of sportsTopics) {
    await kafkaService.subscribe(topic, consumerGroupId);
    console.log(`Subscribed to topic: ${topic}`);
  }

  // Start consuming messages
  console.log("Starting message consumption for audit logging...");
  await kafkaService.startConsuming(handleMessage, consumerGroupId);

  console.log(`Audit service listening for messages on topics: ${sportsTopics.join(", ")}`);
};
