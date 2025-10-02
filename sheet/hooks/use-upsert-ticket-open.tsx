import { LanesType } from "@/app/(main)/client/[clientId]/pipelines/[pipelineId]/_components/pipeline-view";
import { create } from "zustand";

type useUpsertTicketOpenType = {
	open: boolean;
	laneId: string | null;
	setOpen: (open: boolean) => void;
	setLaneId: (laneId: string | null) => void;
	ticket: LanesType[0]["Tickets"][0] | null;
	setTicket: (ticket: LanesType[0]["Tickets"][0]) => void;
};

export const useUpsertTicketOpen = create<useUpsertTicketOpenType>(set => ({
	open: false,
	setOpen: (open: boolean) => set({ open }),
	laneId: null,
	setLaneId: (laneId: string | null) => set({ laneId }),
	ticket: null,
	setTicket: (ticket: LanesType[0]["Tickets"][0]) => set({ ticket }),
}));
