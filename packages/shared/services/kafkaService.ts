import { Kafka, logLevel } from "kafkajs";
import type { Admin, Producer, Consumer } from "kafkajs";
import SportsEnum from "@fdj/shared/enums/sportsEnum";

class KafkaService {
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "unibet",
      brokers: ["localhost:9094"], // External port for host access
      logLevel: logLevel.INFO,
    });

    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "unibet-group" });
  }

  async connect(): Promise<void> {
    try {
      console.log("Connecting to Kafka...");
      await this.admin.connect();
      await this.producer.connect();
      console.log("Successfully connected to Kafka");
    } catch (error) {
      console.error("Failed to connect to Kafka:", error);
      throw error;
    }
  }

  async createTopics(): Promise<void> {
    try {
      console.log("Creating Kafka topics...");

      // Get all sports from the enum to create topics
      const topics = Object.values(SportsEnum).map(sport => ({
        topic: sport,
        numPartitions: 1, // Minimum amount of partitions
        replicationFactor: 1, // Single node setup
      }));

      const topicNames = topics.map(t => t.topic);
      console.log("Topics to create:", topicNames);

      // Check which topics already exist
      const existingTopics = await this.admin.listTopics();
      const topicsToCreate = topics.filter(topic => !existingTopics.includes(topic.topic));

      if (topicsToCreate.length > 0) {
        await this.admin.createTopics({ topics: topicsToCreate });
        console.log(
          "Successfully created topics:",
          topicsToCreate.map(t => t.topic)
        );
      } else {
        console.log("All topics already exist");
      }
    } catch (error) {
      console.error("Failed to create topics:", error);
      throw error;
    }
  }

  async publishMessage(topic: string, message: unknown): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message), timestamp: Date.now().toString() }],
      });
      console.log(`Message published to topic ${topic}`);
    } catch (error) {
      console.error(`Failed to publish message to topic ${topic}:`, error);
      throw error;
    }
  }

  async subscribe(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
      throw error;
    }
  }

  async startConsuming(messageHandler: (topic: string, message: unknown) => void): Promise<void> {
    try {
      await this.consumer.connect();

      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          const messageValue = message.value?.toString();
          if (messageValue) {
            try {
              const parsedMessage = JSON.parse(messageValue);
              messageHandler(topic, parsedMessage);
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        },
      });
    } catch (error) {
      console.error("Failed to start consuming:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log("Disconnecting from Kafka...");
      await this.admin.disconnect();
      await this.producer.disconnect();
      await this.consumer.disconnect();
      console.log("Successfully disconnected from Kafka");
    } catch (error) {
      console.error("Failed to disconnect from Kafka:", error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    await this.connect();
    await this.createTopics();
  }

  // Getter methods for accessing Kafka instances
  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(): Consumer {
    return this.consumer;
  }

  getAdmin(): Admin {
    return this.admin;
  }
}

// Export a singleton instance
export const kafkaService = new KafkaService();
export default kafkaService;
