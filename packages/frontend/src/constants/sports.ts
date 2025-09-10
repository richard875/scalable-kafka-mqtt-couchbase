import aussie from "@/assets/icons/aussie.svg";
import baseball from "@/assets/icons/baseball.svg";
import football from "@/assets/icons/football.svg";
import rugby from "@/assets/icons/rugby.svg";
import soccer from "@/assets/icons/soccer.svg";
import type { Sport } from "@/types/sport";
import { SportsEnum } from "@fdj/shared/sportsEnum";

const Sports: Sport[] = [
  {
    key: SportsEnum.PremierLeague,
    urlKey: "soccer_epl",
    titleShort: "Premier League",
    title: "English Premier League",
    icon: soccer,
  },
  {
    key: SportsEnum.NFL,
    urlKey: "americanfootball_nfl",
    titleShort: "NFL",
    title: "National Football League",
    icon: football,
  },
  {
    key: SportsEnum.MLB,
    urlKey: "baseball_mlb",
    titleShort: "MLB",
    title: "Major League Baseball",
    icon: baseball,
  },
  {
    key: SportsEnum.NRL,
    urlKey: "rugbyleague_nrl",
    titleShort: "NRL",
    title: "National Rugby League",
    icon: rugby,
  },
  {
    key: SportsEnum.AFL,
    urlKey: "aussierules_afl",
    titleShort: "AFL",
    title: "Australian Football League",
    icon: aussie,
  },
  {
    key: SportsEnum.MLS,
    urlKey: "soccer_usa_mls",
    titleShort: "MLS",
    title: "Major League Soccer",
    icon: soccer,
  },
];

export default Sports;
