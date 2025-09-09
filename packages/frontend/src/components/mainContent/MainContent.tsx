import clock from "@/assets/icons/clock.svg";

const MainContent = () => {
  return (
    <>
      <div className="w-full bg-white flex flex-col gap-4 p-4 pb-3">
        <span className="text-[#808080] text-xs font-normal">English Premier League</span>
        <span className="text-[#111111] text-lg font-normal">Premier League</span>
      </div>
      <div className="mt-5 mb-4">
        <span className="text-[#555555] text-base font-medium">Live & Upcoming</span>
      </div>
      <div className="border-t-2 border-[#147b45]">
        <div className="w-full h-11.25 flex items-center justify-between px-4 cursor-pointer bg-white hover:bg-[#f5fffa]">
          <span className="text-[#333333] text-sm font-medium">12 September 2025</span>
          <span className="text-[#555555] text-xs font-normal">1</span>
        </div>
        <div className="w-full h-6 bg-[#dddddd] flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2 text-[#555555] text-xs font-normal">
            <div className="w-7.5"></div>
            <div className="w-16 text-center">1</div>
            <div className="w-16 text-center">2</div>
            <div className="w-13"></div>
          </div>
        </div>
        <div className="w-full h-14 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f5fffa]">
          <div className="flex h-full">
            <div className="w-15 h-full border-r border-[#dddddd] flex items-center justify-center">
              <span className="text-[#555555] text-xs font-normal">19:40</span>
            </div>
            <div className="flex-1 flex flex-col pl-3 items-start justify-center">
              <span className="text-[#333333] text-sm font-normal">Sydney</span>
              <span className="text-[#333333] text-sm font-normal">Melbourne</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#555555] text-xs font-normal">
            <div className="w-7.5 flex items-center justify-center">
              <img src={clock} alt="clock" className="w-3.5 h-3.5" />
            </div>
            <div className="w-16 h-9 rounded-xs flex items-center justify-center bg-[#147b45] hover:bg-[#00582c]">
              <span className="text-white text-sm font-bold">1.79</span>
            </div>
            <div className="w-16 h-9 rounded-xs flex items-center justify-center bg-[#147b45] hover:bg-[#00582c]">
              <span className="text-white text-sm font-bold">1.98</span>
            </div>
            <div className="w-13 flex items-center justify-center">
              <span className="text-[#555555] text-xs font-normal mr-2">+565</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;
