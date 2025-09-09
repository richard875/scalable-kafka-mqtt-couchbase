import { create } from "zustand";
import Sports, { type Sport } from "@/constants/sports";

type SportStore = {
  sport: Sport;
  setSport: (sport: Sport) => void;
};

const useSportStore = create<SportStore>(set => ({
  sport: Sports[0],
  setSport: (sport: Sport) => set(() => ({ sport })),
}));

export default useSportStore;
