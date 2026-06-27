import { create } from "zustand";

export type Toast = {
  id: string;
  title: string;
  message?: string;
};

type ToastStore = {
  toast?: Toast;
  show: (title: string, message?: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toast: undefined,
  show: (title, message) =>
    set({ toast: { id: `${Date.now()}-${Math.random()}`, title, message } }),
  clear: () => set({ toast: undefined })
}));
