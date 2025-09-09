import { create } from "zustand";
import type { Sport } from "@/constants/sports";

const useSportStore = create(set => ({
  sport: null as Sport | null,
  setSport: (sport: Sport | null) => set(() => ({ sport })),
}));

export default useSportStore;
