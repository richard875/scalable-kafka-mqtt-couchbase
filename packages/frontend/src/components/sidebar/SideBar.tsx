import { useEffect } from "react";
import { useQueryState } from "nuqs";
import Sports from "@/constants/sports";
import type { Sport } from "@/types/sport";
import useSportStore from "@/store/sportStore";
import signalIcon from "@/assets/icons/signal.svg";

const SideBar = () => {
  const { sport: selectedSport, setSport, setOdds, liveData, toggleLiveData } = useSportStore();
  const [sportKey, setSportKey] = useQueryState("sport", {
    defaultValue: Sports[0].key,
  });

  useEffect(() => {
    // Find sport by query parameter or use default (first sport)
    const sportFromQuery = Sports.find(sport => sport.key === sportKey) || Sports[0];

    // Only update if the sport has changed
    if (selectedSport.key !== sportFromQuery.key) {
      setSport(sportFromQuery);
      setOdds(sportFromQuery);
    } else if (selectedSport) {
      // Ensure odds are loaded for the current sport
      setOdds(selectedSport);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportKey]);

  useEffect(() => {
    handleClick(selectedSport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveData]);

  const handleClick = (sport: Sport) => {
    setSport(sport);
    setOdds(sport);
    setSportKey(sport.key);
  };

  return (
    <>
      <div className="w-full bg-[#222222]">
        <div className="px-4 h-11 flex items-center">
          <span className="text-[#aaaaaa] text-[10px] font-medium uppercase italic">Live Data</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={signalIcon} alt="Signal" className="w-4 h-4" />
            <span className="text-[#dddddd] text-xs font-normal">Use Live Data</span>
          </div>
          <div
            onClick={toggleLiveData}
            className={`relative w-7.5 h-4.5 rounded-full cursor-pointer transition-colors duration-300 ${
              liveData ? "bg-green-500" : "bg-[#777777]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                liveData ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="w-full bg-[#222222] mt-4">
        <div className="px-4 h-11 flex items-center">
          <span className="text-[#aaaaaa] text-[10px] font-medium uppercase italic">
            All Sports
          </span>
        </div>
        {Sports.map(sport => (
          <div
            key={sport.key}
            onClick={() => handleClick(sport)}
            className="relative px-4 py-3.5 flex items-center gap-2 hover:bg-[#111111] cursor-pointer"
          >
            <img src={sport.icon} alt={sport.title} className="w-4 h-4" />
            <span className="text-[#dddddd] text-xs font-normal">{sport.titleShort}</span>
            {selectedSport.key === sport.key && (
              <div className="absolute inset-y-0 left-0 w-1 bg-[#008944] my-1"></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SideBar;
