import TitleCard from "./TitleCard";
import EventCard from "./EventCard";
import useSportStore from "@/store/sportStore";

const MainContent = () => {
  const { groupedOdds } = useSportStore();

  return (
    <>
      <TitleCard />
      <div className="mt-5 mb-4 select-none">
        <span className="text-[#555555] text-base font-medium">Live & Upcoming</span>
      </div>
      {groupedOdds.map(group => (
        <EventCard key={group.date} group={group} />
      ))}
    </>
  );
};

export default MainContent;
