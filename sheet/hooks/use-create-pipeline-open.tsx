import { create } from "zustand";

type useCreatePipelineOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useCreatePipelineOpen = create<useCreatePipelineOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}));
