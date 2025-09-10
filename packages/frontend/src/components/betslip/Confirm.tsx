import Decimal from "decimal.js";
import useSportStore from "@/store/sportStore";

const Confirm = () => {
  const { selectedBets } = useSportStore();
  const totalStake = selectedBets.reduce((acc, bet) => acc.plus(bet.amount || 0), new Decimal(0));
  const potentialPayout = selectedBets.reduce(
    (acc, bet) => acc.plus(new Decimal(bet.amount || 0).mul(new Decimal(bet.price || 0))),
    new Decimal(0)
  );

  return (
    <div className={`p-2 pb-3 border-t border-[#333333] ${selectedBets.length < 2 && "pt-3"}`}>
      {selectedBets.length > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[#888888] text-xs font-normal">Total stake:</span>
          <span className="text-white text-base font-normal">${totalStake.toFixed(2)}</span>
        </div>
      )}

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[#888888] text-xs font-normal">Potential payout:</span>
          <span className="text-white text-base font-normal">${potentialPayout.toFixed(2)}</span>
        </div>
        <button
          disabled={
            selectedBets.length === 0 || selectedBets.some(bet => !bet.amount || bet.amount <= 0)
          }
          className="w-43.5 h-14 flex items-center justify-center rounded-sm text-black text-base font-normal bg-[#ffe91f] cursor-pointer disabled:opacity-50 disabled:cursor-auto"
        >
          Place bet
        </button>
      </div>
    </div>
  );
};

export default Confirm;
