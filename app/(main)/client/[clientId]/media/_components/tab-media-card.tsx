import LoadingButton from "@/components/global/loading-button";
import { Button } from "@/components/ui/button";
import { deleteMedia } from "@/lib/queries/queries";
import { Media } from "@prisma/client";
import { Copy, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function TabMediaCard({ media }: { media: Media }) {
	const [isPending, startTransition] = React.useTransition();
	const router = useRouter();

	const handleDelete = () => {
		startTransition(async () => {
			await deleteMedia(media.id);
			router.refresh();
		});
	};
	return (
		<div className=' relative break-inside-avoid w-full group rounded-lg overflow-hidden my-2 bg-white'>
			<Image
				src={media.link}
				alt={media.name}
				width={300}
				height={100}
				className=' w-full object-cover'
			/>
			<div className=' absolute top-0 left-0 h-full w-full opacity-0 group-hover:opacity-100 duration-300 bg-background/70 flex flex-col justify-center items-center gap-0 text-xs'>
				<Button
					size={"sm"}
					className=' rounded-lg  scale-75'
					onClick={() => {
						navigator.clipboard.writeText(media.link);
						toast.success("Copied to clipboard");
					}}
				>
					<Copy size={14} color='white' /> Copy Link
				</Button>
				<LoadingButton
					isPending={isPending}
					disabled={isPending}
					onClick={handleDelete}
					variant={"destructive"}
					className=' scale-75'
					size={"sm"}
				>
					<Trash size={14} color='white' />
					Delete
				</LoadingButton>
			</div>
		</div>
	);
}
