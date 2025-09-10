import useSportStore from "@/store/sportStore";
import chevron from "@/assets/icons/chevron.svg";

const Header = () => {
  const { selectedBets, clearSelectedBets } = useSportStore();

  return (
    <>
      <div className="w-full h-13 bg-[#333333] px-4 flex items-center justify-between cursor-pointer">
        <span className="text-[#999999] text-base font-bold">
          Singles ({selectedBets.length})
          {selectedBets.length === 1 ? <> @ {selectedBets[0].price}</> : null}
        </span>
        <img src={chevron} alt="chevron" className="w-5 h-5" />
      </div>
      {selectedBets.length > 1 && (
        <p
          onClick={clearSelectedBets}
          className="w-full px-2.5 py-1.25 text-right text-[#999999] text-[11px] font-normal cursor-pointer"
        >
          Clear betslip
        </p>
      )}
    </>
  );
};

export default Header;
