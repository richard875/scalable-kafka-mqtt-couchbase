import Sports from "@/constants/sports";

const SideBar = () => {
  return (
    <div className="w-full bg-[#222222]">
      <div className="px-4 h-11 flex items-center">
        <span className="text-[#aaaaaa] text-[10px] font-medium uppercase italic">All Sports</span>
      </div>
      {Sports.map(sport => (
        <div
          key={sport.key}
          className="relative px-4 py-3.5 flex items-center gap-2 hover:bg-[#111111] cursor-pointer"
        >
          <img src={sport.icon} alt={sport.title} className="w-4 h-4" />
          <span className="text-[#dddddd] text-xs font-normal">{sport.titleShort}</span>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
