"use client";
import LoadingButton from "@/components/global/loading-button";
import { deleteFunnelById } from "@/lib/queries/funnel";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ActionButtons({ funnelId }: { funnelId: string }) {
	const [isPending, startTransition] = React.useTransition();
	const router = useRouter();

	const handleDelete = () => {
		startTransition(async () => {
			await deleteFunnelById(funnelId as string);
			router.refresh();
		});
	};

	return (
		<div>
			<LoadingButton
				onClick={handleDelete}
				size={"sm"}
				disabled={isPending}
				isPending={isPending}
				variant={"destructive"}
			>
				<Trash2 size={15} /> Delete
			</LoadingButton>
		</div>
	);
}
