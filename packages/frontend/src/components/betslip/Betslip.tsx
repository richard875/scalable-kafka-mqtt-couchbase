import Header from "./Header";
import BetItem from "./BetItem";
import Confirm from "./Confirm";

const Betslip = () => {
  return (
    <div className="w-95 fixed bottom-0 right-10 bg-[#222222] shadow-2xl shadow-gray-900 border-t-4 border-[#ffe91f] font-smoothing">
      <Header />
      <BetItem />
      <Confirm />
    </div>
  );
};

export default Betslip;
