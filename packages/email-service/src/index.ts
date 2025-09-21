import { Hono } from "hono";
import { serve } from "@hono/node-server";
import redisService from "./services/redisService.js";
import kafkaService from "@fdj/shared/services/kafkaService";
import { handleMessage } from "./services/sendEmailService.js";
import subscribeToTopics from "@fdj/shared/helpers/subscribeToTopics";

// Application instance
const app = new Hono();

// Configuration
const PORT = 3003;

// Routes
app.get("/", c => c.text("Email Service is Healthy"));

// Initialize Kafka service and subscribe to all sports topics
const startServer = async (): Promise<void> => {
  try {
    console.log("Initializing Redis service...");
    await redisService.connect();

    console.log("Initializing Kafka service...");
    await kafkaService.initialize();

    console.log("Initializing Email service...");
    await subscribeToTopics(handleMessage, "email-service-group");

    serve({ fetch: app.fetch, port: PORT }, info => {
      console.log(`Email service is running on http://localhost:${info.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await cleanup();
    process.exit(1);
  }
};

const cleanup = async (): Promise<void> => {
  try {
    console.log("Cleaning up resources...");
    await kafkaService.disconnect();
    await redisService.disconnect();
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

const stopServer = async (): Promise<void> => {
  console.log("Shutting down gracefully...");
  await cleanup();
  process.exit(0);
};

// Handle graceful shutdown
process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);

// Start the server
startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
