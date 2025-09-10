import TitleCard from "./TitleCard";
import EventCard from "./EventCard";

const MainContent = () => {
  return (
    <>
      <TitleCard />
      <div className="mt-5 mb-4 select-none">
        <span className="text-[#555555] text-base font-medium">Live & Upcoming</span>
      </div>
      <EventCard />
      <EventCard />
    </>
  );
};

export default MainContent;
