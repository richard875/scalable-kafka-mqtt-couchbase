import { createClient } from "redis";
import { REDIS_HOSTS } from "../constants.js";
import { listKey } from "../helper/formatKeys.js";
import type BetV2 from "@fdj/shared/types/kafka/betV2.js";

class RedisService {
  private client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({ url: `redis://${REDIS_HOSTS || "localhost:6379"}` });
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

  async addBet(userId: string, data: BetV2): Promise<void> {
    try {
      const key = listKey(userId);
      await this.client.rPush(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to add bet for user ${userId}:`, error);
      throw error;
    }
  }

  multi() {
    return this.client.multi();
  }
}

// Export a singleton instance
export const redisService = new RedisService();
export default redisService;
