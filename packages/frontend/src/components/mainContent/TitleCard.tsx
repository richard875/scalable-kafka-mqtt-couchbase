import useSportStore from "@/store/sportStore";

const TitleCard = () => {
  const { sport } = useSportStore();

  return (
    <div className="w-full bg-white flex flex-col gap-4 p-4 pb-3">
      <span className="text-[#808080] text-xs font-normal">{sport.title}</span>
      <span className="text-[#111111] text-lg font-normal">{sport.titleShort}</span>
    </div>
  );
};

export default TitleCard;
