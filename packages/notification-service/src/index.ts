import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import kafkaService from "@fdj/shared/services/kafkaService";
import { subscribeToTopics } from "@notification-service/services/notificationService.js";

// Application instance
const app = new Hono();

// Configuration
const PORT = 3001;

// Middleware
app.use(cors());

// Routes
app.get("/", c => c.text("Notification Service is Healthy"));

// Initialize Kafka service and subscribe to all sports topics
const startServer = async (): Promise<void> => {
  try {
    console.log("Initializing Kafka service...");
    await kafkaService.initialize();
    await subscribeToTopics();

    serve({ fetch: app.fetch, port: PORT }, info => {
      console.log(`Notification service is running on http://localhost:${info.port}`);
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
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

const stopServer = async (): Promise<void> => {
  console.log("Shutting down gracefully...");
  await cleanup();
  process.exit(0);
};

// Handle shutdown signals
process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);

// Start the server
startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
