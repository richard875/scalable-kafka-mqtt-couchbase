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
      {groupedOdds.length === 0 ? (
        <div className="w-full mt-25 flex items-center justify-center">
          <div className="spinner-loader" />
        </div>
      ) : (
        groupedOdds.map(group => <EventCard key={group.date} group={group} />)
      )}
    </>
  );
};

export default MainContent;
