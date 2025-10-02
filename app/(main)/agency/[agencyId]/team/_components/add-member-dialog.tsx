"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import React, { FormEvent } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Role } from "@prisma/client";
import { getFormData } from "@/lib/helper";
import { useAddMemberOpen } from "@/zustand/use-add-member";
import LoadingButton from "@/components/global/loading-button";
import { toast } from "sonner";
import {
	saveActivityLogNotification,
	sendInvitation,
} from "@/lib/queries/queries";

type FromValuesType = {
	email: string;
	role: Role;
};
export default function AddMemberDialog({ agencyId }: { agencyId: string }) {
	const [isPending, startTransition] = React.useTransition();
	const { open, setOpen } = useAddMemberOpen();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			const data = getFormData<FromValuesType>(e.currentTarget);
			try {
				setOpen(false);
				await sendInvitation({ ...data, agencyId });
				await saveActivityLogNotification({
					agencyId,
					description: `Invited ${data.email}`,
				});
				toast.success("Invitation sent successfully");
			} catch (error) {
				console.log(error);
				toast.error("Something went wrong");
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Member</DialogTitle>
					<DialogDescription> Add member in my team </DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className=' space-y-6'>
					<div className=' space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input placeholder='Email' name='email' />
					</div>
					<div className=' space-y-2'>
						<Label htmlFor='role'>Role</Label>
						<Select name='role'>
							<SelectTrigger className=' w-full'>
								<SelectValue placeholder='Select a Role' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='AGENCY_OWNER'>AGENCY OWNER</SelectItem>
								<SelectItem value='AGENCY_ADMIN'>AGENCY ADMIN</SelectItem>
								<SelectItem value='CLIENT_USER'>CLIENT USER</SelectItem>
								<SelectItem value='CLIENT_QUEST'>CLIENT QUEST</SelectItem>
								{/* Add more countries as needed */}
							</SelectContent>
						</Select>
					</div>
					<LoadingButton
						type='submit'
						isPending={isPending}
						className=' w-full'
					>
						Add
					</LoadingButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
