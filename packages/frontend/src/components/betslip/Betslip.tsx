import { useState } from "react";
import Header from "./Header";
import BetItem from "./BetItem";
import Confirm from "./Confirm";
import ClearAll from "./ClearAll";
import useSportStore from "@/store/sportStore";

const Betslip = () => {
  const { selectedBets } = useSportStore();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-95 fixed bottom-0 right-10 bg-[#222222] shadow-2xl shadow-gray-900 border-t-4 border-[#ffe91f] font-smoothing">
      <Header isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className={`transition-all duration-300 ${isExpanded ? "max-h-150" : "max-h-0"}`}>
        {selectedBets.length > 1 && <ClearAll />}
        <div className="overflow-y-auto max-h-110">
          {selectedBets.map((bet, index) => (
            <BetItem key={bet.id} bet={bet} isFirst={index === 0} />
          ))}
        </div>
        <Confirm />
      </div>
    </div>
  );
};

export default Betslip;
