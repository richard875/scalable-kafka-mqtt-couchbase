import SportsEnum from "@fdj/shared/enums/sportsEnum";
import kafkaService from "@fdj/shared/services/kafkaService";

const handleMessage = (topic: string, message: unknown): void => {
  const msg = `[${new Date().toISOString()}] Received message from topic "${topic}": ${JSON.stringify(message)}`;
  console.log(msg);
};

export const subscribeToTopics = async (): Promise<void> => {
  console.log("Subscribing to sports topics...");
  const sportsTopics = Object.values(SportsEnum);

  for (const topic of sportsTopics) {
    await kafkaService.subscribe(topic);
    console.log(`Subscribed to topic: ${topic}`);
  }

  // Start consuming messages
  console.log("Starting message consumption...");
  await kafkaService.startConsuming(handleMessage);

  console.log(`Listening for messages on topics: ${sportsTopics.join(", ")}`);
};
