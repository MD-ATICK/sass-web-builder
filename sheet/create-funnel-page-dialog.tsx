import React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import FunnelPageForm from "@/components/forms/funnelPageForm";
import { FunnelPage } from "@prisma/client";
import { Plus } from "lucide-react";

export default function CreateFunnelPageDialog({
	funnelPage,
	order,
	funnelId,
}: {
	funnelPage?: FunnelPage;
	order?: number;
	funnelId: string;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button size={"sm"}>
						<Plus size={15} />
						{funnelPage ? "Edit" : "Create"} Funnel Page
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{" "}
							{funnelPage ? "Edit" : "Create"} Funnel Page
						</DialogTitle>
						<DialogDescription>
							{" "}
							{funnelPage ? "Edit your old" : "Create a new"} funnel page
						</DialogDescription>
					</DialogHeader>
					<FunnelPageForm
						setOpen={setOpen}
						funnelPage={funnelPage}
						order={order}
						funnelId={funnelId}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
