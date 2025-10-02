import { PricesList } from "@/types";
import { create } from "zustand";

type usePaymentModelOpenType = {
	open: boolean;
	setOpen: (open: boolean) => void;
	plan: PricesList["data"][0] | null;
	setPlan: (plan: PricesList["data"][0]) => void;
	setPlanNull: () => void;
};

export const usePaymentModelOpen = create<usePaymentModelOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	plan: null,
	setPlan: (plan: PricesList["data"][0]) => set({ plan }),
	setPlanNull: () => set({ plan: null }),
}));
