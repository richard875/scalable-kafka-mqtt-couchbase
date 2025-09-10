import Header from "./Header";
import BetItem from "./BetItem";
import Confirm from "./Confirm";
import useSportStore from "@/store/sportStore";

const Betslip = () => {
  const { selectedBets } = useSportStore();

  return (
    <div className="w-95 fixed bottom-0 right-10 bg-[#222222] shadow-2xl shadow-gray-900 border-t-4 border-[#ffe91f] font-smoothing">
      <Header />
      {selectedBets.map(bet => (
        <BetItem key={bet.id} bet={bet} />
      ))}
      <Confirm />
    </div>
  );
};

export default Betslip;
