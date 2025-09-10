import useSportStore from "@/store/sportStore";
import chevron from "@/assets/icons/chevron.svg";

type Props = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
};

const Header = ({ isExpanded, setIsExpanded }: Props) => {
  const { selectedBets } = useSportStore();

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full h-13 bg-[#333333] px-4 flex items-center justify-between cursor-pointer"
    >
      <span className="text-[#999999] text-base font-bold">
        Singles ({selectedBets.length})
        {selectedBets.length === 1 ? <> @ {selectedBets[0].price}</> : null}
      </span>
      <img src={chevron} alt="chevron" className="w-5 h-5" />
    </div>
  );
};

export default Header;
