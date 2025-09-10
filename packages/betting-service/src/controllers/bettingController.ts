import type { Context } from "hono";
import type { SlipItem } from "../types/slipItem.js";
import { placeBetService } from "@betting-service/services/bettingService.js";

export const placeBet = async (c: Context) => {
  const betDetails: SlipItem = await c.req.json();
  const result = await placeBetService(betDetails);
  return c.json(result, result.success ? 200 : 400);
};
