import type { Context } from "hono";
import type BetResult from "@fdj/shared/types/betResult";
import { getOddsData, placeBets } from "../services/bettingService.js";

export const getOdds = async (c: Context): Promise<Response> => {
  try {
    const sport = c.req.query("sport");
    const live = c.req.query("live");

    if (!sport || !live) {
      const errorResponse: BetResult = {
        success: false,
        error: "Missing 'sport' or 'live' query parameter",
      };
      return c.json(errorResponse, 400);
    }

    // Fetch odds from the service layer
    const odds = await getOddsData(sport, live);
    const successResponse: BetResult = { success: true, data: odds };
    return c.json(successResponse, 200);
  } catch (error) {
    console.error("Error fetching odds:", error);
    const errorResponse: BetResult = { success: false, error: "Failed to fetch odds" };
    return c.json(errorResponse, 500);
  }
};

export const placeBet = async (c: Context): Promise<Response> => {
  try {
    const betDetails: unknown = await c.req.json();
    const result = await placeBets(betDetails);

    if (!result.success) {
      // If validation failed, return 400 with detailed errors
      if (result.validationError) {
        const validationErrorResponse: BetResult = {
          success: false,
          error: result.validationError,
        };
        return c.json(validationErrorResponse, 400);
      }

      // Other errors return 500
      const errorResponse: BetResult = { success: false, error: result.error };
      return c.json(errorResponse, 500);
    }

    return c.json(result, 200);
  } catch (error) {
    console.error("Error in placeBet controller:", error);
    const errorResponse: BetResult = { success: false, error: "Failed to process bet request" };
    return c.json(errorResponse, 500);
  }
};
