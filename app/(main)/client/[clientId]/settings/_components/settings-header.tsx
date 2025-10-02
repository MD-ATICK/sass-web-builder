"use client";
import { Button } from "@/components/ui/button";
import { useClientUpsert } from "@/zustand/use-client-upsert";
import { client } from "@prisma/client";
import React from "react";

export default function SettingsHeader({ client }: { client: client }) {
	const { setOpen, setClient } = useClientUpsert();

	return (
		<div className='flex items-center justify-between p-4 bg-gray-800 rounded-md'>
			<h2 className=' font-bold text-2xl'>{client.name}</h2>
			<Button
				onClick={() => {
					setOpen(true);
					setClient(client);
				}}
			>
				Customize Profile
			</Button>
		</div>
	);
}
