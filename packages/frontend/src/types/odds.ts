import type { Outcomes } from "./outcomes";

type Markets = {
  key: string;
  last_update: string;
  outcomes: Outcomes[];
  link: string;
  sid: string;
};

type Bookmakers = {
  key: string;
  title: string;
  last_update: string;
  markets: Markets[];
  link: string;
  sid: string;
};

export type Odds = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmakers[];
};
