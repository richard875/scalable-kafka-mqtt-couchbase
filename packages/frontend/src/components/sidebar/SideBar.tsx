import { useEffect } from "react";
import { useQueryState } from "nuqs";
import LiveData from "./LiveData";
import SportSelect from "./SportSelect";
import Sports from "@/constants/sports";
import type { Sport } from "@/types/sport";
import useSportStore from "@/store/sportStore";

const SideBar = () => {
  const { setSport, setOdds } = useSportStore();
  const [sportKey, setSportKey] = useQueryState("sport", { defaultValue: Sports[0].key });

  useEffect(() => {
    // Find sport by query parameter or use default (first sport)
    const sportFromQuery = Sports.find(sport => sport.key === sportKey) || Sports[0];
    setSport(sportFromQuery);
    setOdds(sportFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportKey]);

  const handleChange = (sport: Sport) => {
    setSport(sport);
    setOdds(sport);
    setSportKey(sport.key);
  };

  return (
    <>
      <LiveData handleChange={handleChange} />
      <SportSelect handleChange={handleChange} />
    </>
  );
};

export default SideBar;
