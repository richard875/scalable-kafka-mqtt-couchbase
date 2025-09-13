import { ODDS_API_KEY } from "../constants.js";
import type { Odds } from "@fdj/shared/types/odds";
import type BetResult from "@fdj/shared/types/betResult";

const BASE_URL = "https://api.the-odds-api.com/v4/sports/";

const getLiveData = async (sport: string): Promise<BetResult> => {
  try {
    const url = `${BASE_URL}${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=au`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Error response from Odds API:", response.statusText);
      return { success: false, error: "Failed to fetch live data from Odds API" };
    }

    const data: Odds[] = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching live data:", error);
    return { success: false, error: "Failed to fetch live data" };
  }
};

export default getLiveData;
