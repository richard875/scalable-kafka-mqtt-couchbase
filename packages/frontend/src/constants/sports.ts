import aussie from "@/assets/icons/aussie.svg";
import baseball from "@/assets/icons/baseball.svg";
import football from "@/assets/icons/football.svg";
import rugby from "@/assets/icons/rugby.svg";
import soccer from "@/assets/icons/soccer.svg";

export type Sport = {
  key: string;
  titleShort: string;
  title: string;
  icon: string;
};

const Sports: Sport[] = [
  {
    key: "premierLeague",
    titleShort: "Premier League",
    title: "English Premier League",
    icon: soccer,
  },
  {
    key: "nfl",
    titleShort: "NFL",
    title: "National Football League",
    icon: football,
  },
  {
    key: "mlb",
    titleShort: "MLB",
    title: "Major League Baseball",
    icon: baseball,
  },
  {
    key: "nrl",
    titleShort: "NRL",
    title: "National Rugby League",
    icon: rugby,
  },
  {
    key: "afl",
    titleShort: "AFL",
    title: "Australian Football League",
    icon: aussie,
  },
  {
    key: "mls",
    titleShort: "MLS",
    title: "Major League Soccer",
    icon: soccer,
  },
];

export default Sports;
