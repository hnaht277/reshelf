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

type AuthResult = {
  ok: boolean;
  message: string;
};

type UserStore = {
  isAuthenticated: boolean;
  mockPassword: string;
  resetCode?: string;
  user: User;
  impact: Impact;
  preferences: Preferences;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<AuthResult & { code?: string }>;
  resetPassword: (email: string, code: string, password: string) => Promise<AuthResult>;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<AuthResult>;
  updateUser: (profile: Omit<User, "firstName" | "memberSince">) => void;
  setLayout: (layout: Preferences["layout"]) => void;
  setPreference: (
    preference: Exclude<keyof Preferences, "layout">,
    enabled: boolean
  ) => void;
  recordCheckout: (itemsRescued: number, co2Saved: number, moneySaved: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  isAuthenticated: false,
  mockPassword: "reshelf123",
  resetCode: undefined,
  user: {
    firstName: "Anh",
    fullName: "Nguyễn Minh Anh",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180",
    memberSince: "March 2026",
    birthDate: "1998-09-02",
    gender: "Female",
    phone: "+84 912 345 678",
    email: "minhanh.nguyen@example.com"
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
  login: async (email, password) =>
    new Promise((resolve) => {
      setTimeout(() => {
        set((state) => {
          const emailMatches = email.trim().toLowerCase() === state.user.email.toLowerCase();
          const passwordMatches = password === state.mockPassword;

          if (!emailMatches || !passwordMatches) {
            resolve({ ok: false, message: "Email or password is incorrect." });
            return state;
          }

          resolve({ ok: true, message: "Welcome back to Reshelf." });
          return { isAuthenticated: true };
        });
      }, 450);
    }),
  logout: () => set({ isAuthenticated: false }),
  requestPasswordReset: async (email) =>
    new Promise((resolve) => {
      setTimeout(() => {
        set((state) => {
          const emailMatches = email.trim().toLowerCase() === state.user.email.toLowerCase();
          if (!emailMatches) {
            resolve({ ok: false, message: "We could not find an account with that email." });
            return state;
          }

          const code = "246810";
          resolve({ ok: true, message: "Reset code sent.", code });
          return { resetCode: code };
        });
      }, 450);
    }),
  resetPassword: async (email, code, password) =>
    new Promise((resolve) => {
      setTimeout(() => {
        set((state) => {
          const emailMatches = email.trim().toLowerCase() === state.user.email.toLowerCase();
          if (!emailMatches || code.trim() !== state.resetCode) {
            resolve({ ok: false, message: "Reset code is invalid." });
            return state;
          }

          if (password.length < 8) {
            resolve({ ok: false, message: "Password must be at least 8 characters." });
            return state;
          }

          resolve({ ok: true, message: "Password reset successfully." });
          return { mockPassword: password, resetCode: undefined, isAuthenticated: true };
        });
      }, 450);
    }),
  changePassword: async (currentPassword, nextPassword) =>
    new Promise((resolve) => {
      setTimeout(() => {
        set((state) => {
          if (currentPassword !== state.mockPassword) {
            resolve({ ok: false, message: "Current password is incorrect." });
            return state;
          }

          if (nextPassword.length < 8) {
            resolve({ ok: false, message: "New password must be at least 8 characters." });
            return state;
          }

          resolve({ ok: true, message: "Password changed successfully." });
          return { mockPassword: nextPassword };
        });
      }, 450);
    }),
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
