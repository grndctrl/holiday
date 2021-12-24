import create from 'zustand';

type State = {
  isOpen: boolean;
  toggleOpen: (toggle: boolean) => void;
  isActive: boolean;
  toggleActive: (toggle: boolean) => void;
};

const useStore = create<State>((set) => ({
  isOpen: false,
  toggleOpen: (toggle) => set(() => ({ isOpen: toggle })),
  isActive: false,
  toggleActive: (toggle) => set(() => ({ isActive: toggle })),
}));

export { useStore };
