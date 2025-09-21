import Decimal from "decimal.js";
import { toast } from "react-toastify";
import { BETTING_URL } from "@/constants/api";
import useSportStore from "@/store/sportStore";
import formatAmount from "@/helper/formatAmount";
import useFingerprint from "@/hooks/useFingerprint";
import type BetResult from "@fdj/shared/types/betResult";

const Confirm = () => {
  const { selectedBets, clearSelectedBets } = useSportStore();
  const { hash: currentUserId } = useFingerprint();
  const totalStake = selectedBets.reduce((acc, bet) => acc.plus(bet.amount || 0), new Decimal(0));
  const potentialPayout = selectedBets.reduce(
    (acc, bet) => acc.plus(new Decimal(bet.amount || 0).mul(new Decimal(bet.price || 0))),
    new Decimal(0)
  );

  const handleClick = async () => {
    // Ensure we have a valid userId before proceeding
    if (!currentUserId) {
      toast.error("User identification is still loading. Please wait a moment and try again.", {
        closeButton: false,
        hideProgressBar: true,
        className:
          "!rounded-xs !bg-[#222222] shadow-2xl !text-white !text-sm !font-bold border-l-4 border-red-500 font-smoothing",
      });
      return;
    }

    clearSelectedBets();

    for (let index = 0; index < selectedBets.length; index++) {
      const bet = selectedBets[index];
      if (index === selectedBets.length - 1) bet.isLast = true;

      // Ensure this bet has a valid userId (fallback to current userId if needed)
      const betWithUserId = { ...bet, userId: bet.userId || currentUserId };
      const message = `Placed $${formatAmount(betWithUserId.amount || 0)} bet on ${betWithUserId.name} @ ${formatAmount(betWithUserId.price || 0)}`;
      const className =
        "!rounded-xs !bg-[#222222] shadow-2xl !text-white !text-sm !font-bold border-l-4 border-[#ffe91f] font-smoothing";
      const toastConfig = { closeButton: false, hideProgressBar: true, className };

      // Wait for the delay before placing the bet
      if (index > 0) await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const result = await fetch(`${BETTING_URL}/bet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(betWithUserId),
        });

        if (!result.ok) {
          const errorMessage = await result.text();
          toast.error(`Error placing bet: ${errorMessage}`, toastConfig);
          continue;
        }

        const data: BetResult = await result.json();
        if (!data.success) {
          toast.error("Error placing bet", toastConfig);
          continue;
        }

        toast(message, toastConfig);
      } catch (error) {
        toast.error(`Error placing bet: ${error}`, toastConfig);
      }
    }
  };

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
          onClick={handleClick}
          className="w-43.5 h-14 flex items-center justify-center rounded-sm text-black text-base font-normal bg-[#ffe91f] cursor-pointer disabled:opacity-50 disabled:cursor-auto"
        >
          Place bet
        </button>
      </div>
    </div>
  );
};

export default Confirm;
