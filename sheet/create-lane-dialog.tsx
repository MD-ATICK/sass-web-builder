"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/global/loading-button";
import { toast } from "sonner";
import { useCreateLaneOpen } from "./hooks/use-create-lane-open";
import { createLane, updateLaneName } from "@/lib/queries/pipeline";

export default function CreateLaneDialog({
	pipelineId,
	title,
	description,
	clientId,
	order,
}: {
	clientId: string;
	pipelineId: string;
	order: number;
	title?: string;
	description?: string;
}) {
	const { open, setOpen, laneId, laneName } = useCreateLaneOpen();

	const [name, setName] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			setOpen(false);
			toast.loading("Creating Lane...", { id: "Lane" });
			if (!name || !clientId) return;
			if (laneId) {
				await updateLaneName(name, laneId, clientId);
				toast.success("Lane updated successfully", { id: "Lane" });
			} else {
				await createLane({ name, pipelineId, order });
				toast.success("Lane created successfully", { id: "Lane" });
			}
		});
	};

	useEffect(() => {
		setName(laneName || "");
	}, [laneName]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className=' w-[500px]'>
				<DialogHeader>
					<DialogTitle>{title || "Create Lane"}</DialogTitle>
					<DialogDescription>
						{" "}
						{description || "Create a new lane"}{" "}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className=' p-4 space-y-4'>
					<div className='grid gap-2'>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							name='name'
							value={name}
							onChange={e => setName(e.target.value)}
							required
						/>
					</div>
					<LoadingButton
						isPending={isPending}
						disabled={isPending || !name}
						type='submit'
						className=' w-full'
					>
						{laneId ? "Update Lane" : "Create Lane"}
					</LoadingButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
