import type { Context } from "hono";
import { placeBetService } from "../services/bettingService.js";

export const placeBet = async (c: Context) => {
  try {
    const betDetails: unknown = await c.req.json();
    const result = await placeBetService(betDetails);

    if (!result.success) {
      // If validation failed, return 400 with detailed errors
      if (result.validationErrors) {
        return c.json({ success: false, error: result.validationErrors }, 400);
      }

      // Other errors return 500
      return c.json({ success: false, error: result.error }, 500);
    }

    return c.json(result, 200);
  } catch (error) {
    console.error("Error in placeBet controller:", error);
    return c.json({ success: false, error: "Failed to process bet request" }, 500);
  }
};
