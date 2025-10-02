"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/global/loading-button";
import { getFormData } from "@/lib/helper";
import { useCreateContactOpen } from "./hooks/use-create-contact-open";
import { toast } from "sonner";
import { createContact, UpdateContact } from "@/lib/queries/contact";
import { useRouter } from "next/navigation";

export default function CreateContactDialog({
	clientId,
}: {
	clientId: string;
}) {
	const { open, setOpen, contact } = useCreateContactOpen();

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			const data = getFormData<{ name: string; email: string }>(
				e.currentTarget,
			);
			if (!data.name || !data.email) return;
			toast.loading("Creating Contact...", { id: "contact" });
			if (contact) {
				await UpdateContact({ ...data, id: contact.id });
				toast.success("Contact updated successfully", { id: "contact" });
				setOpen(false);
			} else {
				await createContact({ ...data, clientId });
				toast.success("Contact created successfully", { id: "contact" });
				setOpen(false);
			}
			router.refresh();
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className=' w-[500px]'>
				<DialogHeader>
					<DialogTitle>
						{contact ? "Update Contact" : "Create Contact"}
					</DialogTitle>
					<DialogDescription>
						Fill in the form below to create a new contact. You can update the
						contact later if needed.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className=' p-4 space-y-4'>
					<div className='grid gap-2'>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							name='name'
							defaultValue={contact?.name}
							required
						/>
					</div>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							name='email'
							type='email'
							defaultValue={contact?.email}
							required
						/>
					</div>
					<LoadingButton
						isPending={isPending}
						disabled={isPending}
						type='submit'
						className=' w-full'
					>
						{contact ? "Update Contact" : "Create Contact"}
					</LoadingButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
