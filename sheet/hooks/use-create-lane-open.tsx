import { create } from "zustand";

type useCreateLaneOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
	laneId: string | null;
	laneName: string | null;
	setLaneId: (laneId: string) => void;
	setLaneName: (laneName: string) => void;
};

export const useCreateLaneOpen = create<useCreateLaneOpenType>(set => ({
	open: false,
	laneId: null,
	laneName: null,
	setOpen: (open: boolean) => set({ open }),
	setLaneId: (laneId: string) => set({ laneId }),
	setLaneName: (laneName: string) => set({ laneName }),
}));
