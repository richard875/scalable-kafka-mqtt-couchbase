import type { Context } from "hono";
import type { SlipItem } from "../types/slipItem.js";

export const placeBet = async (c: Context) => {
  const betDetails: SlipItem = await c.req.json();
  // Process the bet details here (e.g., save to database, validate, etc.)
  console.log("Received bet:", betDetails);
  return c.json({ status: "Bet received", bet: betDetails });
};
