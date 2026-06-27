import { create } from "zustand";

type User = {
  firstName: string;
  fullName: string;
  avatarUrl: string;
  memberSince: string;
};

type Impact = {
  mealsRescued: number;
  co2SavedKg: number;
  moneySaved: number;
  streakDays: number;
};

type Preferences = {
  layout: "grid" | "list";
};

type UserStore = {
  user: User;
  impact: Impact;
  preferences: Preferences;
  setLayout: (layout: Preferences["layout"]) => void;
  recordCheckout: (itemsRescued: number, co2Saved: number, moneySaved: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: {
    firstName: "Maya",
    fullName: "Maya Nguyen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180",
    memberSince: "March 2026"
  },
  impact: {
    mealsRescued: 12,
    co2SavedKg: 4.8,
    moneySaved: 47,
    streakDays: 8
  },
  preferences: {
    layout: "grid"
  },
  setLayout: (layout) => set((state) => ({ preferences: { ...state.preferences, layout } })),
  recordCheckout: (itemsRescued, co2Saved, moneySaved) =>
    set((state) => ({
      impact: {
        mealsRescued: state.impact.mealsRescued + itemsRescued,
        co2SavedKg: Number((state.impact.co2SavedKg + co2Saved).toFixed(1)),
        moneySaved: Number((state.impact.moneySaved + moneySaved).toFixed(2)),
        streakDays: state.impact.streakDays + 1
      }
    }))
}));
