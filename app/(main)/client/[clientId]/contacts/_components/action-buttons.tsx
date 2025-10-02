"use client";
import { Contact } from "@prisma/client";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, GripVertical } from "lucide-react";
import { useCreateContactOpen } from "@/sheet/hooks/use-create-contact-open";

export default function ActionButtons({ contact }: { contact: Contact }) {
	const { setOpen, setContact } = useCreateContactOpen();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"outline"}>
					<GripVertical size={15} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						setOpen(true);
						setContact(contact);
					}}
				>
					<Edit size={15} />
					Edit
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
