"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/global/loading-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreatePipelineOpen } from "./hooks/use-create-pipeline-open";
import { createPipeline } from "@/lib/queries/pipeline";

export default function PipelineCreateDialog({
	clientId,
}: {
	clientId: string;
}) {
	const { open, setOpen } = useCreatePipelineOpen();

	const [name, setName] = useState("");
	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			setOpen(false);
			toast.loading("Creating Pipeline...", { id: "pipeline" });
			if (!name) return;
			await createPipeline({ name, clientId });
			toast.success("Pipeline created successfully", { id: "pipeline" });
			router.refresh();
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className=' w-[500px]'>
				<DialogHeader>
					<DialogTitle>Create Pipeline</DialogTitle>
					<DialogDescription> Create a new pipeline </DialogDescription>
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
						Create
					</LoadingButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
