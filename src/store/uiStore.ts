import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  profileDrawerOpen: boolean;
}

interface UIActions {
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  immer((set) => ({
    profileDrawerOpen: false,

    openProfileDrawer: () => set((s) => { s.profileDrawerOpen = true; }),
    closeProfileDrawer: () => set((s) => { s.profileDrawerOpen = false; }),
  }))
);
