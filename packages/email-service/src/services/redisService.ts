import { createClient } from "redis";

class RedisService {
  private client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({ url: `redis://${process.env.REDIS_HOSTS || "localhost:6379"}` });
    this.client.on("error", err => console.error("Redis Client Error", err));
  }

  async connect(): Promise<void> {
    try {
      console.log("Connecting to Redis...");
      await this.client.connect();
      console.log("Successfully connected to Redis");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log("Disconnecting from Redis...");
      await this.client.quit();
      console.log("Successfully disconnected from Redis");
    } catch (error) {
      console.error("Failed to disconnect from Redis:", error);
      throw error;
    }
  }

  getClient(): ReturnType<typeof createClient> {
    return this.client;
  }
}

// Export a singleton instance
export const redisService = new RedisService();
export default redisService;
