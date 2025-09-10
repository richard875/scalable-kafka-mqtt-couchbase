import useSportStore from "@/store/sportStore";

const ClearAll = () => {
  const { clearSelectedBets } = useSportStore();

  return (
    <p
      onClick={clearSelectedBets}
      className="w-full px-2.5 py-1.25 text-right text-[#999999] text-[11px] font-normal cursor-pointer"
    >
      Clear betslip
    </p>
  );
};

export default ClearAll;
