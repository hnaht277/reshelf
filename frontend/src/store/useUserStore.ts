import { create } from "zustand";

export type Gender = "Female" | "Male" | "Other" | "Prefer not to say";

type User = {
  firstName: string;
  fullName: string;
  avatarUrl: string;
  memberSince: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  email: string;
};

type Impact = {
  mealsRescued: number;
  co2SavedKg: number;
  moneySaved: number;
  streakDays: number;
};

type Preferences = {
  layout: "grid" | "list";
  priceDropAlerts: boolean;
  expiryReminders: boolean;
  impactUpdates: boolean;
};

type UserStore = {
  user: User;
  impact: Impact;
  preferences: Preferences;
  updateUser: (profile: Omit<User, "firstName" | "memberSince">) => void;
  setLayout: (layout: Preferences["layout"]) => void;
  setPreference: (
    preference: Exclude<keyof Preferences, "layout">,
    enabled: boolean
  ) => void;
  recordCheckout: (itemsRescued: number, co2Saved: number, moneySaved: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: {
    firstName: "Maya",
    fullName: "Maya Nguyen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180",
    memberSince: "March 2026",
    birthDate: "1997-08-16",
    gender: "Female",
    phone: "+1 415 555 0198",
    email: "maya.nguyen@example.com"
  },
  impact: {
    mealsRescued: 12,
    co2SavedKg: 4.8,
    moneySaved: 470000,
    streakDays: 8
  },
  preferences: {
    layout: "grid",
    priceDropAlerts: true,
    expiryReminders: true,
    impactUpdates: false
  },
  updateUser: (profile) =>
    set((state) => ({
      user: {
        ...state.user,
        ...profile,
        firstName: profile.fullName.trim().split(/\s+/)[0] || state.user.firstName
      }
    })),
  setLayout: (layout) => set((state) => ({ preferences: { ...state.preferences, layout } })),
  setPreference: (preference, enabled) =>
    set((state) => ({
      preferences: { ...state.preferences, [preference]: enabled }
    })),
  recordCheckout: (itemsRescued, co2Saved, moneySaved) =>
    set((state) => ({
      impact: {
        mealsRescued: state.impact.mealsRescued + itemsRescued,
        co2SavedKg: Number((state.impact.co2SavedKg + co2Saved).toFixed(1)),
        moneySaved: state.impact.moneySaved + moneySaved,
        streakDays: state.impact.streakDays + 1
      }
    }))
}));
