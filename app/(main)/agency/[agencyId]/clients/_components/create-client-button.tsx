"use client";
import { Button } from "@/components/ui/button";
import { useClientUpsert } from "@/zustand/use-client-upsert";
import { Role } from "@prisma/client";
import React from "react";

export default function CreateClientButton({ role }: { role: Role }) {
	const { setOpen } = useClientUpsert();

	return (
		<div>
			{role === "AGENCY_ADMIN" ||
				(role === "AGENCY_OWNER" && (
					<Button
						onClick={() => setOpen(true)}
						variant={"default"}
						size={"sm"}
						className=' w-full'
					>
						Create New Client
					</Button>
				))}
		</div>
	);
}
