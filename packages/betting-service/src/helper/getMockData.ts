import type { Odds } from "@fdj/shared/types/odds";
import type BetResult from "@fdj/shared/types/betResult";

const getMockData = async (sport: string): Promise<BetResult> => {
  try {
    const file = `../mock/${sport}.json`;
    const data: { default: Odds[] } = await import(file, { with: { type: "json" } });
    return { success: true, data: data.default };
  } catch (error) {
    console.error("Error loading mock data:", error);
    return { success: false, error: "Failed to load mock data" };
  }
};

export default getMockData;
