import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import kafkaService from "@fdj/shared/services/kafkaService";
import { placeBet } from "./controllers/bettingController.js";

const app = new Hono();
app.use(cors());

// Routes
app.get("/", c => c.text("Server is Healthy"));
app.post("/bet", placeBet);

// Initialize Kafka service
const startServer = async () => {
  try {
    console.log("Initializing Kafka service...");
    await kafkaService.initialize();

    serve({ fetch: app.fetch, port: 3000 }, info => {
      console.log(`Server is running on http://localhost:${info.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const stopServer = async () => {
  console.log("Shutting down gracefully...");
  await kafkaService.disconnect();
  process.exit(0);
};

// Graceful shutdown
process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);

startServer();
