import Sports from "@/constants/sports";
import type { Sport } from "@/types/sport";
import useSportStore from "@/store/sportStore";

const SportSelect = ({ handleChange }: { handleChange: (sport: Sport) => void }) => {
  const { sport: selectedSport } = useSportStore();

  return (
    <div className="w-full bg-[#222222] mt-4">
      <div className="px-4 h-11 flex items-center">
        <span className="text-[#aaaaaa] text-[10px] font-medium uppercase italic">All Sports</span>
      </div>
      {Sports.map(sport => (
        <div
          key={sport.key}
          onClick={() => sport.key !== selectedSport.key && handleChange(sport)}
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
  );
};

export default SportSelect;
