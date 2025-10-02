import { client } from "@prisma/client";
import { create } from "zustand";

type useClientUpsertType = {
	open: boolean;
	setOpen: (open: boolean) => void;
	client: client | null;
	setClient: (client: client) => void;
};

export const useClientUpsert = create<useClientUpsertType>(set => ({
	open: false,
	setOpen: (open: boolean) =>
		set({ open, ...(open === false && { client: null }) }),
	client: null,
	setClient: (client: client) => set({ client }),
}));
