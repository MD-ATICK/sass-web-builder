"use client";
import LoadingButton from "@/components/global/loading-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { deleteMedia } from "@/lib/queries/queries";
import { Media } from "@prisma/client";
import { format } from "date-fns";
import { Copy, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function MediaCard({ media }: { media: Media }) {
	const [isPending, startTransition] = React.useTransition();
	const router = useRouter();

	const handleDelete = () => {
		startTransition(async () => {
			await deleteMedia(media.id);
			router.refresh();
		});
	};

	return (
		<div className=' space-y-1 bg-gray-900 rounded-md py-1'>
			<CommandItem className=' w-full flex flex-col hover:bg-transparent'>
				<AspectRatio ratio={16 / 9}>
					<Image src={media.link} fill alt={media.name} />
				</AspectRatio>
				<div className=' p-2 flex w-full items-center justify-between'>
					<p className=' text-sm font-semibold capitalize'>
						{media.name}{" "}
						<span className=' text-xs text-muted-foreground font-base'>
							({format(new Date(media.createdAt), "PP")})
						</span>
					</p>
					<div className='flex items-center gap-2'>
						<Button
							size={"sm"}
							onClick={() => {
								navigator.clipboard.writeText(media.link);
								toast.success("Copied to clipboard");
							}}
						>
							<Copy size={14} color='white' /> Copy
						</Button>
						<LoadingButton
							isPending={isPending}
							disabled={isPending}
							onClick={handleDelete}
							variant={"destructive"}
							size={"sm"}
						>
							<Trash size={14} color='white' />
							Delete
						</LoadingButton>
					</div>
				</div>
			</CommandItem>
		</div>
	);
}
