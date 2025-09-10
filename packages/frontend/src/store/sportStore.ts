import { create } from "zustand";
import Sports from "@/constants/sports";
import type { Odds } from "@/types/odds";
import type { Sport } from "@/types/sport";
import type { GroupedOdds } from "@/types/groupedOdds";
import transformEvents from "@/helper/transformEvents";

type SportStore = {
  sport: Sport;
  odds: Odds[];
  groupedOdds: GroupedOdds[];
  setSport: (sport: Sport) => void;
  setOdds: (sport: Sport) => Promise<void>;
};

const useSportStore = create<SportStore>(set => ({
  sport: Sports[0],
  odds: [],
  groupedOdds: [],
  setSport: (sport: Sport) => set(() => ({ sport })),
  setOdds: async (sport: Sport) => {
    const odds: Odds[] = await fetch(`/mock/${sport.urlKey}.json`).then(res => res.json());
    const groupedOdds: GroupedOdds[] = transformEvents(odds);
    set(() => ({ odds, groupedOdds }));
  },
}));

export default useSportStore;
