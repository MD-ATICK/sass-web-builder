"use client";
import LoadingButton from "@/components/global/loading-button";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { deletePipeline } from "@/lib/queries/pipeline";
import { useCreatePipelineOpen } from "@/sheet/hooks/use-create-pipeline-open";
import { Pipeline } from "@prisma/client";
import { ChevronsUpDown, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function TopBar({ pipelines }: { pipelines: Pipeline[] }) {
	const { setOpen } = useCreatePipelineOpen();
	const [popoverOpen, setPopoverOpen] = React.useState(false);

	const { pipelineId, clientId } = useParams();
	const router = useRouter();
	const [isPending, startTransition] = React.useTransition();

	const handleDelete = async () => {
		startTransition(async () => {
			await deletePipeline(pipelineId as string);
			router.replace(`/client/${clientId}/pipelines`);
		});
	};

	return (
		<div className='flex items-center justify-between p-4 border-b'>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className=' w-[200px] bg-popover flex justify-between items-center'
					>
						<p>
							{pipelines.find(pipeline => pipeline.id === pipelineId)?.name}
						</p>
						<ChevronsUpDown />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[200px] p-0'>
					<Command className=' p-1'>
						<CommandInput placeholder='Search' />
						<CommandList>
							{pipelines.map(pipeline => {
								return (
									<CommandItem key={pipeline.id}>
										<Link
											href={`/client/${pipeline.clientId}/pipelines/${pipeline.id}`}
											onClick={() => setPopoverOpen(false)}
										>
											{pipeline.name}
										</Link>
									</CommandItem>
								);
							})}
						</CommandList>
						<div className=' px-1'>
							<Button
								onClick={() => setOpen(true)}
								className=' w-full'
								size={"sm"}
							>
								Create Pipeline
							</Button>
						</div>
					</Command>
				</PopoverContent>
			</Popover>
			<LoadingButton
				isPending={isPending}
				disabled={isPending}
				variant={"destructive"}
				size={"sm"}
				onClick={handleDelete}
			>
				<Trash size={15} /> Delete Pipeline
			</LoadingButton>
		</div>
	);
}
