"use client";
import LoadingButton from "@/components/global/loading-button";
import {
	deleteClientById,
	getClientById,
	saveActivityLogNotification,
} from "@/lib/queries/queries";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteClientButton({ clientId }: { clientId: string }) {
	const [isPending, startTransition] = React.useTransition();

	const router = useRouter();
	const handleDelete = () => {
		startTransition(async () => {
			const client = await getClientById(clientId);
			if (!client) return;
			await saveActivityLogNotification({
				clientId: client?.id,
				description: `Deleted a client | ${client.name}`,
			});
			await deleteClientById(clientId);
			router.refresh();
		});
	};

	return (
		<LoadingButton
			isPending={isPending}
			disabled={isPending}
			variant={"destructive"}
			onClick={handleDelete}
		>
			{" "}
			<Trash className=' text-white' /> Delete
		</LoadingButton>
	);
}
