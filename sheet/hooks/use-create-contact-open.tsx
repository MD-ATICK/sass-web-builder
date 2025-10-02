import { Contact } from "@prisma/client";
import { create } from "zustand";

type useCreateContactOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
	contact: Contact | null;
	setContact: (contact: Contact) => void;
};

export const useCreateContactOpen = create<useCreateContactOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	contact: null,
	setContact: (contact: Contact) => set({ contact }),
}));
