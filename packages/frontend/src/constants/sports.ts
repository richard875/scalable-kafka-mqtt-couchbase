import aussie from "@/assets/icons/aussie.svg";
import baseball from "@/assets/icons/baseball.svg";
import football from "@/assets/icons/football.svg";
import rugby from "@/assets/icons/rugby.svg";
import soccer from "@/assets/icons/soccer.svg";

export type Sport = {
  key: string;
  urlKey: string;
  titleShort: string;
  title: string;
  icon: string;
};

const Sports: Sport[] = [
  {
    key: "premierLeague",
    urlKey: "soccer_epl",
    titleShort: "Premier League",
    title: "English Premier League",
    icon: soccer,
  },
  {
    key: "nfl",
    urlKey: "americanfootball_nfl",
    titleShort: "NFL",
    title: "National Football League",
    icon: football,
  },
  {
    key: "mlb",
    urlKey: "baseball_mlb",
    titleShort: "MLB",
    title: "Major League Baseball",
    icon: baseball,
  },
  {
    key: "nrl",
    urlKey: "rugbyleague_nrl",
    titleShort: "NRL",
    title: "National Rugby League",
    icon: rugby,
  },
  {
    key: "afl",
    urlKey: "aussierules_afl",
    titleShort: "AFL",
    title: "Australian Football League",
    icon: aussie,
  },
  {
    key: "mls",
    urlKey: "soccer_usa_mls",
    titleShort: "MLS",
    title: "Major League Soccer",
    icon: soccer,
  },
];

export default Sports;
