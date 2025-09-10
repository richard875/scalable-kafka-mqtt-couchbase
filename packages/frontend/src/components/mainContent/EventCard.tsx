import { useState } from "react";
import clock from "@/assets/icons/clock.svg";
import type { GroupedOdds } from "@/types/groupedOdds";
import formatIsoToLocalTime from "@/helper/formatIsoToLocalTime";

const EventCard = ({ group }: { group: GroupedOdds }) => {
  const [collapsed, setCollapsed] = useState(false);

  const hasUnibet = group.events.some(event =>
    event.bookmakers.some(bm => bm.key === "unibet" && bm.markets.length > 0)
  );

  // Only render the group if it contains events from the "unibet" bookmaker with markets
  if (!hasUnibet) return null;

  return (
    <div className="border-t-2 border-[#147b45] mb-3 select-none">
      <div
        className="w-full h-11.25 flex items-center justify-between px-4 cursor-pointer bg-white hover:bg-[#f5fffa]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-[#333333] text-sm font-medium">{group.date}</span>
        <span className="text-[#555555] text-xs font-normal">{group.num_events}</span>
      </div>
      {!collapsed && (
        <>
          <div className="w-full h-6 bg-[#dddddd] flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-2 text-[#555555] text-xs font-normal">
              <div className="w-7.5"></div>
              <div className="w-16 text-center">1</div>
              <div className="w-16 text-center">2</div>
              <div className="w-13"></div>
            </div>
          </div>
          {group.events.map(event => {
            const unibet = event.bookmakers.find(bm => bm.key === "unibet");
            if (!unibet || !unibet.markets.length) return null;

            const homeTeam = event.home_team;
            const awayTeam = event.away_team;
            const homeOdds = unibet.markets[0].outcomes.find(outcome => outcome.name === homeTeam);
            const awayOdds = unibet.markets[0].outcomes.find(outcome => outcome.name === awayTeam);
            if (!homeOdds || !awayOdds) return null;

            const randomNum = Math.floor(Math.random() * (900 - 100 + 1)) + 100;

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
                  <div className="w-16 h-9 rounded-xs flex items-center justify-center bg-[#147b45] hover:bg-[#00582c]">
                    <span className="text-white text-sm font-bold">{homeOdds.price}</span>
                  </div>
                  <div className="w-16 h-9 rounded-xs flex items-center justify-center bg-[#147b45] hover:bg-[#00582c]">
                    <span className="text-white text-sm font-bold">{awayOdds.price}</span>
                  </div>
                  <div className="w-13 flex items-center justify-center">
                    <span className="text-[#555555] text-xs font-normal mr-2">+{randomNum}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default EventCard;
