import { createClient } from "redis";
import { REDIS_HOSTS } from "../constants.js";
import type BetV2 from "@fdj/shared/types/kafka/betV2.js";
import { listKey, ttlKey } from "../helper/formatKeys.js";

const GAP_WINDOW = 600;

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

  async resetBetTimer(userId: string): Promise<void> {
    try {
      const key = ttlKey(userId);
      await this.client.set(key, "1", { expiration: { type: "PX", value: GAP_WINDOW } });
    } catch (error) {
      console.error(`Failed to reset bet timer for user ${userId}:`, error);
      throw error;
    }
  }

  multi() {
    return this.client.multi();
  }

  async expiredKeyListener(callback: (expiredKey: string) => Promise<void>): Promise<void> {
    return await this.client.subscribe("__keyevent@0__:expired", callback);
  }
}

// Export a singleton instance
export const redisService = new RedisService();
export default redisService;
