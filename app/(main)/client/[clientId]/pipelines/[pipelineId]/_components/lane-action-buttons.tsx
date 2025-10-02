"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteLane } from "@/lib/queries/pipeline";
import { useCreateLaneOpen } from "@/sheet/hooks/use-create-lane-open";
import { useUpsertTicketOpen } from "@/sheet/hooks/use-upsert-ticket-open";
import { GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LaneActionButtons({
	laneId,
	clientId,
	laneName,
}: {
	laneId: string;
	clientId: string;
	laneName: string;
}) {
	const [open, setOpen] = useState(false);
	const { setOpen: setLaneOpen, setLaneName, setLaneId } = useCreateLaneOpen();
	const { setOpen: setTicketOpen, setLaneId: setTicketLaneId } =
		useUpsertTicketOpen();

	const handleDelete = async () => {
		toast.loading("Deleting Lane...", { id: "Lane" });
		await deleteLane(laneId, clientId);
		toast.success("Lane deleted successfully", { id: "Lane" });
		setOpen(false);
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"ghost"}
					className=' hover:bg-background/40'
					size={"icon"}
				>
					<GripVertical size={15} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() => {
						setLaneOpen(true);
						setLaneId(laneId);
						setLaneName(laneName);
					}}
				>
					<Pen size={15} />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTicketOpen(true);
						setTicketLaneId(laneId);
					}}
				>
					<Plus size={15} />
					New Ticket
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleDelete}>
					<Trash2 size={15} />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
