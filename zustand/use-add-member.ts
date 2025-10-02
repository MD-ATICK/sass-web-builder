import { create } from "zustand";

type useAddMemberOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useAddMemberOpen = create<useAddMemberOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
}));
