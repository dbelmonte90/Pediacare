import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  profileDrawerOpen: boolean;
  addProfileModalOpen: boolean;
  addProfileStep: 1 | 2;
  addProfileType: 'pregnancy' | 'child' | null;
}

interface UIActions {
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  openAddProfileModal: () => void;
  closeAddProfileModal: () => void;
  setAddProfileStep: (step: 1 | 2) => void;
  setAddProfileType: (type: 'pregnancy' | 'child') => void;
  resetAddProfileFlow: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  immer((set) => ({
    profileDrawerOpen: false,
    addProfileModalOpen: false,
    addProfileStep: 1,
    addProfileType: null,

    openProfileDrawer: () => set((s) => { s.profileDrawerOpen = true; }),
    closeProfileDrawer: () => set((s) => { s.profileDrawerOpen = false; }),
    openAddProfileModal: () => set((s) => { s.addProfileModalOpen = true; }),
    closeAddProfileModal: () => set((s) => { s.addProfileModalOpen = false; }),
    setAddProfileStep: (step) => set((s) => { s.addProfileStep = step; }),
    setAddProfileType: (type) => set((s) => { s.addProfileType = type; }),
    resetAddProfileFlow: () =>
      set((s) => {
        s.addProfileStep = 1;
        s.addProfileType = null;
        s.addProfileModalOpen = false;
      }),
  }))
);
