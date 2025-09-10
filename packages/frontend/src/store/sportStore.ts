import { create } from "zustand";
import Sports from "@/constants/sports";
import type { Odds } from "@/types/odds";
import type { Sport } from "@/types/sport";
import type { SlipItem } from "@/types/slipItem";
import type { GroupedOdds } from "@/types/groupedOdds";
import transformEvents from "@/helper/transformEvents";

type SportStore = {
  sport: Sport;
  odds: Odds[];
  groupedOdds: GroupedOdds[];
  selectedBets: SlipItem[];
  setSport: (sport: Sport) => void;
  setOdds: (sport: Sport) => Promise<void>;
  setSelectedBet: (bet: SlipItem) => void;
  clearSelectedBets: () => void;
  setBetAmount: (id: string, amount: number) => void;
};

const useSportStore = create<SportStore>(set => ({
  sport: Sports[0],
  odds: [],
  groupedOdds: [],
  selectedBets: [],
  setSport: (sport: Sport) => set(() => ({ sport })),
  setOdds: async (sport: Sport) => {
    const odds: Odds[] = await fetch(`/mock/${sport.urlKey}.json`).then(res => res.json());
    const groupedOdds: GroupedOdds[] = transformEvents(odds);
    set(() => ({ odds, groupedOdds }));
  },
  setSelectedBet: (bet: SlipItem) => {
    set(state => ({
      selectedBets: state.selectedBets.map(b => b.id).includes(bet.id)
        ? state.selectedBets.filter(b => b.id !== bet.id)
        : [...state.selectedBets, bet],
    }));
  },
  clearSelectedBets: () => set(() => ({ selectedBets: [] })),
  setBetAmount: (id: string, amount: number) => {
    set(state => ({
      selectedBets: state.selectedBets.map(bet => (bet.id === id ? { ...bet, amount } : bet)),
    }));
  },
}));

export default useSportStore;
