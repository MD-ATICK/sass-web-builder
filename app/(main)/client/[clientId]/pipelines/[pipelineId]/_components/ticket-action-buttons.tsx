"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTicket } from "@/lib/queries/pipeline";
import { useUpsertTicketOpen } from "@/sheet/hooks/use-upsert-ticket-open";
import { GripVertical, Pen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { LanesType } from "./pipeline-view";

type Props = {
	ticket: LanesType[0]["Tickets"][0];
};
export default function TicketActionButtons({ ticket }: Props) {
	const router = useRouter();
	const { setOpen, setTicket, setLaneId } = useUpsertTicketOpen();

	const handleDelete = async () => {
		await deleteTicket(ticket.id);
		toast.success("Ticket deleted successfully");
		router.refresh();
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"}>
					<GripVertical size={15} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => {
						setOpen(true);
						setLaneId(ticket.laneId);
						setTicket(ticket);
					}}
				>
					<Pen size={15} />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleDelete}
					className=' focus:bg-destructive'
				>
					<Trash2 size={15} className=' text-white' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
