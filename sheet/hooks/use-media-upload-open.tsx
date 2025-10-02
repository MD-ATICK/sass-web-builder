import { create } from "zustand";

type useMediaUploadOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useMediaUploadOpen = create<useMediaUploadOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}));
