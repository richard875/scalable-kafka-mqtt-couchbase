import { useEffect } from "react";
import { useQueryState, parseAsBoolean } from "nuqs";
import type { Sport } from "@/types/sport";
import useSportStore from "@/store/sportStore";
import signalIcon from "@/assets/icons/signal.svg";

const LiveData = ({ handleChange }: { handleChange: (sport: Sport) => void }) => {
  const { sport: selectedSport, liveData, toggleLiveData } = useSportStore();
  const [live, setLive] = useQueryState("live", parseAsBoolean.withDefault(true));

  useEffect(() => {
    toggleLiveData(live);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    setLive(!live);
    toggleLiveData();
    handleChange(selectedSport);
  };

  return (
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
          onClick={handleClick}
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
  );
};

export default LiveData;
