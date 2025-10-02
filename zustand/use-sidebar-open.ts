import { create } from "zustand";

type useSidebarOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useSidebarOpen = create<useSidebarOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}));
