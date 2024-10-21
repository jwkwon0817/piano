import { create } from 'zustand';

interface KeyTitleStore {
	keyTitle: boolean;
	setKeyTitle: (keyTitle: boolean) => void;
}

export const useKeyTitleStore = create<KeyTitleStore>((set) => ({
	keyTitle: true,
	setKeyTitle: (keyTitle) => set({ keyTitle }),
}));
