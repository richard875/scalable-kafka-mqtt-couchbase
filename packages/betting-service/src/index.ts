import { Hono } from "hono";
import { serve } from "@hono/node-server";
import kafkaService from "@fdj/shared/services/kafkaService";
import { getOdds, placeBet } from "./controllers/bettingController.js";

// Application instance
const app = new Hono();

// Configuration
const PORT = 3000;

// Routes
app.get("/", c => c.text("Betting Service is Healthy"));
app.get("/odds", getOdds);
app.post("/bet", placeBet);

// Initialize Kafka service
const startServer = async (): Promise<void> => {
  try {
    console.log("Initializing Kafka service...");
    await kafkaService.initialize();

    serve({ fetch: app.fetch, port: PORT }, info => {
      console.log(`Betting service is running on http://localhost:${info.port}`);
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

// Graceful shutdown
process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);

startServer();
