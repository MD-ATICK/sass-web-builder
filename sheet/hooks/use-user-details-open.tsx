import { User } from "@prisma/client";
import { create } from "zustand";

type useUserDetailsOpenType = {
	open: boolean;
	user: User | null;
	setOpen: (open: boolean) => void;
	setUser: (user: User) => void;
};

export const useUserDetailsOpen = create<useUserDetailsOpenType>(set => ({
	open: false,
	user: null,
	setOpen: (open: boolean) => set({ open }),
	setUser: (user: User) => set({ user }),
}));
