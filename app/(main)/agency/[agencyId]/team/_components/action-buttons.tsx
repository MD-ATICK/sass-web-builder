"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, GripVertical, Plus } from "lucide-react";
import React from "react";
import AddMemberDialog from "./add-member-dialog";
import { useAddMemberOpen } from "@/zustand/use-add-member";
import { toast } from "sonner";
import { useUserDetailsOpen } from "@/sheet/hooks/use-user-details-open";
import { getAgencyUsers } from "@/lib/queries/queries";

export default function ActionButtons({
	agencyId,
	email,
	user,
}: {
	agencyId: string;
	email: string;
	user: Awaited<ReturnType<typeof getAgencyUsers>>[0];
}) {
	const { setOpen } = useAddMemberOpen();
	const { setOpen: setOpenUserDetails, setUser } = useUserDetailsOpen();
	return (
		<div>
			<AddMemberDialog agencyId={agencyId} />
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
							setUser(user);
							setOpenUserDetails(true);
						}}
					>
						<Edit size={15} />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Plus size={15} />
						Add <span className=' text-muted-foreground text-xs'>(global)</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard.writeText(email);
							toast.success("Email copied to clipboard");
						}}
					>
						<Copy size={15} /> Copy Email
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
