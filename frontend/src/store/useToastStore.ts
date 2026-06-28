import { create } from "zustand";

export type Toast = {
  id: string;
  title: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};

type ToastStore = {
  toast?: Toast;
  show: (title: string, message?: string, action?: Toast["action"]) => void;
  clear: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toast: undefined,
  show: (title, message, action) =>
    set({ toast: { id: `${Date.now()}-${Math.random()}`, title, message, action } }),
  clear: () => set({ toast: undefined })
}));
