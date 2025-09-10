import useSportStore from "@/store/sportStore";

const ClearAll = () => {
  const { clearSelectedBets } = useSportStore();

  return (
    <div className="w-full px-2.5 py-1.25 text-right text-[#999999] text-[11px] font-normal border-b border-[#333333]">
      <span onClick={clearSelectedBets} className="w-fit cursor-pointer">
        Clear betslip
      </span>
    </div>
  );
};

export default ClearAll;
