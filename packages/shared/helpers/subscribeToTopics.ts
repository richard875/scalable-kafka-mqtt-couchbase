import SportsEnum from "../enums/sportsEnum.js";
import kafkaService from "../services/kafkaService.js";
import type BatEnvelope from "../types/kafka/batEnvelope.js";

const subscribeToTopics = async (
  messageHandler: (topic: string, message: BatEnvelope<unknown>) => Promise<void> | void,
  consumerGroupId: string
): Promise<void> => {
  console.log("Subscribing to sports topics...");
  const sportsTopics = Object.values(SportsEnum);

  for (const topic of sportsTopics) {
    await kafkaService.subscribe(topic, consumerGroupId);
    console.log(`Subscribed to topic: ${topic}`);
  }

  // Start consuming messages
  console.log("Starting message consumption...");
  await kafkaService.startConsuming(messageHandler, consumerGroupId);

  console.log(`Listening for messages on topics: ${sportsTopics.join(", ")}`);
};

export default subscribeToTopics;
