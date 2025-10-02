"use client";
import { Button } from "@/components/ui/button";
import { useClientUpsert } from "@/zustand/use-client-upsert";
import { client } from "@prisma/client";
import { PenTool } from "lucide-react";
import React from "react";

export default function EditButton({ client }: { client: client }) {
	const { setClient, setOpen } = useClientUpsert();

	return (
		<Button
			onClick={() => {
				setClient(client);
				setOpen(true);
			}}
		>
			<PenTool size={15} />
			Edit
		</Button>
	);
}
