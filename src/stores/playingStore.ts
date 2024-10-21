import { create } from 'zustand';

interface PlayingStore {
	playingList: string[];
	setPlayingList: (playingList: string[]) => void;
}

export const usePlayingStore = create<PlayingStore>((set) => ({
	playingList: [],
	setPlayingList: (playingList) => set({ playingList }),
}));
