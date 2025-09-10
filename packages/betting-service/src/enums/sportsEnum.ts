export const SportsEnum = {
  PremierLeague: "premierLeague",
  NFL: "nfl",
  MLB: "mlb",
  NRL: "nrl",
  AFL: "afl",
  MLS: "mls",
} as const;

export type SportsEnum = (typeof SportsEnum)[keyof typeof SportsEnum];
