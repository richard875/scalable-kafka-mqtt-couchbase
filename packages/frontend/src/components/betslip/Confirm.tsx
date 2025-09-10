const Confirm = () => {
  return (
    <div className="p-2 pb-3 border-t border-[#333333]">
      <div className="flex items-center justify-between">
        <span className="text-[#888888] text-xs font-normal">Total stake:</span>
        <span className="text-white text-base font-normal">$0.00</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[#888888] text-xs font-normal">Potential payout:</span>
          <span className="text-white text-base font-normal">$0.00</span>
        </div>
        <button className="w-43.5 h-14 flex items-center justify-center rounded-sm text-black text-base font-normal bg-[#ffe91f] cursor-pointer">
          Place bet
        </button>
      </div>
    </div>
  );
};

export default Confirm;
