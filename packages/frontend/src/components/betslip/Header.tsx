import chevron from "@/assets/icons/chevron.svg";

const Header = () => {
  return (
    <div className="w-full h-13 bg-[#333333] px-4 flex items-center justify-between cursor-pointer">
      <span className="text-[#999999] text-base font-bold">Singles (1) @ 1.98</span>
      <img src={chevron} alt="chevron" className="w-5 h-5" />
    </div>
  );
};

export default Header;
