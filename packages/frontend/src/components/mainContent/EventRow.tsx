import { useMemo } from "react";
import clock from "@/assets/icons/clock.svg";
import type { Odds } from "@/types/odds";
import useSportStore from "@/store/sportStore";
import formatIsoToLocalTime from "@/helper/formatIsoToLocalTime";

const EventRow = ({ event }: { event: Odds }) => {
  const { sport, selectedBets, setSelectedBet } = useSportStore();
  const randomNum = useMemo(() => Math.floor(Math.random() * (900 - 100 + 1)) + 100, []);

  const unibet = event.bookmakers.find(bm => bm.key === "unibet");
  if (!unibet || !unibet.markets.length) return null;

  const homeTeam = event.home_team;
  const awayTeam = event.away_team;
  const team = `${homeTeam} - ${awayTeam}`;
  const homeOdds = unibet.markets[0].outcomes.find(outcome => outcome.name === homeTeam);
  const awayOdds = unibet.markets[0].outcomes.find(outcome => outcome.name === awayTeam);
  if (!homeOdds || !awayOdds) return null;

  const isHomeSelected = selectedBets.map(b => b.id).includes(homeOdds.id);
  const isAwaySelected = selectedBets.map(b => b.id).includes(awayOdds.id);

  return (
    <div
      key={event.id}
      className="w-full h-14 flex items-center justify-between cursor-pointer border-t border-[#dddddd] bg-white hover:bg-[#f5fffa]"
    >
      <div className="flex h-full">
        <div className="w-15 h-full border-r border-[#dddddd] flex items-center justify-center">
          <span className="text-[#555555] text-xs font-normal">
            {formatIsoToLocalTime(event.commence_time)}
          </span>
        </div>
        <div className="flex-1 flex flex-col pl-3 items-start justify-center">
          <span className="text-[#333333] text-sm font-normal">{homeTeam}</span>
          <span className="text-[#333333] text-sm font-normal">{awayTeam}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#555555] text-xs font-normal">
        <div className="w-7.5 flex items-center justify-center">
          <img src={clock} alt="clock" className="w-3.5 h-3.5" />
        </div>
        <div
          onClick={() => setSelectedBet({ ...homeOdds, team, amount: 0, key: sport.key })}
          className={`w-16 h-9 rounded-xs flex items-center justify-center ${isHomeSelected ? "bg-[#ffe71f] hover:bg-[#ffef6e]" : "bg-[#147b45] hover:bg-[#00582c]"}`}
        >
          <span className={`text-sm font-bold ${isHomeSelected ? "text-[#333333]" : "text-white"}`}>
            {homeOdds.price}
          </span>
        </div>
        <div
          onClick={() => setSelectedBet({ ...awayOdds, team, amount: 0, key: sport.key })}
          className={`w-16 h-9 rounded-xs flex items-center justify-center ${isAwaySelected ? "bg-[#ffe71f] hover:bg-[#ffef6e]" : "bg-[#147b45] hover:bg-[#00582c]"}`}
        >
          <span className={`text-sm font-bold ${isAwaySelected ? "text-[#333333]" : "text-white"}`}>
            {awayOdds.price}
          </span>
        </div>
        <div className="w-13 flex items-center justify-center">
          <span className="text-[#555555] text-xs font-normal mr-2">+{randomNum}</span>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
