import { type UUID } from "crypto";

export type Odds = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        id: UUID;
        name: string;
        price: number;
      }>;
      link: string;
      sid: string;
    }>;
    link: string;
    sid: string;
  }>;
};
