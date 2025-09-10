import { useState } from "react";
import EventRow from "./EventRow";
import type { GroupedOdds } from "@/types/groupedOdds";

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
          {group.events.map(event => (
            <EventRow key={event.id} event={event} />
          ))}
        </>
      )}
    </div>
  );
};

export default EventCard;
