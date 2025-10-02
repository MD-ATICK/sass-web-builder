"use client";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import { useUpsertTicketOpen } from "./hooks/use-upsert-ticket-open";
import TicketForm from "@/components/forms/ticket-form";

type Props = {
	clientId: string;
	pipelineId: string;
	title?: string;
	description?: string;
};

export default function UpsertTicketSheet({
	title,
	description,
	clientId,
	pipelineId,
}: Props) {
	const { open, setOpen } = useUpsertTicketOpen();
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent className=' w-[500px]'>
				<SheetHeader>
					<SheetTitle>{title || "Create Lane"}</SheetTitle>
					<SheetDescription>
						{" "}
						{description || "Create a new lane"}{" "}
					</SheetDescription>
				</SheetHeader>
				<TicketForm pipelineId={pipelineId} clientId={clientId} />
			</SheetContent>
		</Sheet>
	);
}
