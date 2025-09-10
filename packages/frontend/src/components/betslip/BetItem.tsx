import { useState } from "react";
import close from "@/assets/icons/close.svg";
import useSportStore from "@/store/sportStore";
import formatAmount from "@/helper/formatAmount";
import type { SlipItem } from "@fdj/shared/types/slipItem";

const BetItem = ({ bet, isFirst }: { bet: SlipItem; isFirst: boolean }) => {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { setSelectedBet, setBetAmount } = useSportStore();

  const handleFocus = () => {
    setIsEditing(true);
    if (bet.amount > 0) setInputValue(bet.amount?.toString() || "");
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = Number(inputValue);
    setBetAmount(bet.id, numValue);
    setInputValue("");
  };

  return (
    <div className={`w-full flex ${isFirst ? "" : "border-t border-[#333333]"}`}>
      <div
        onClick={() => setSelectedBet(bet)}
        className="w-9 flex items-center justify-center border-r border-[#333333] cursor-pointer"
      >
        <img src={close} alt="Close" className="w-5.75 h-5.75" />
      </div>
      <div className="flex-1 px-2.5 py-2 flex justify-between">
        <div className="flex flex-col">
          <div className="mt-1 mb-1 flex flex-col">
            <span className="text-white text-xs font-bold">{bet.name}</span>
            <div className="flex w-fit h-fit bg-[#00953a] rounded-xs mb-0.5">
              <span className="uppercase text-white text-[10px] font-normal px-0.5">Cash Out</span>
            </div>
            <span className="text-[#999999] text-xs font-normal">Including Overtime</span>
          </div>
          <span className="text-white text-xs font-normal cursor-pointer">{bet.team}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="mr-1 mb-1.25 text-white text-sm font-bold">{bet.price}</span>
          <input
            type="text"
            placeholder="$0.00"
            value={isEditing ? inputValue : bet.amount ? formatAmount(bet.amount) : ""}
            onChange={e => setInputValue(e.target.value.replace(/[^0-9.]/g, ""))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-16.5 h-7.5 px-1 bg-white rounded-xs text-[#222222] text-sm font-bold text-right"
          />
        </div>
      </div>
    </div>
  );
};

export default BetItem;
