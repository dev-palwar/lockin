import { create } from "zustand";

interface ArcStore {
  tasksAdded: boolean;
  causeReRender: () => void;
}

export const useArcStore = create<ArcStore>((set) => ({
  tasksAdded: false,
  causeReRender: () => set((state) => ({ tasksAdded: !state.tasksAdded })),
}));
