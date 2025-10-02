"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import TagCreator from "../tag-creator";
import { Contact, Tag, User } from "@prisma/client";
import {
	createTicket,
	getClientWorkers,
	getContactByClientId,
	getTagsByClientId,
	updateTicket,
} from "@/lib/queries/pipeline";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import Image from "next/image";
import LoadingButton from "../global/loading-button";
import { toast } from "sonner";
import { useUpsertTicketOpen } from "@/sheet/hooks/use-upsert-ticket-open";
import { useRouter } from "next/navigation";

type Props = {
	clientId: string;
	pipelineId: string;
};
export default function TicketForm({ clientId, pipelineId }: Props) {
	const { laneId, setOpen, setLaneId, ticket } = useUpsertTicketOpen();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [value, setValue] = useState("");
	const [assignUserId, setAssignUserId] = useState(
		ticket?.assignedUserId || "",
	);
	const [contactId, setContactId] = useState(ticket?.customerId || "");

	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [clientWorkers, setClientWorkers] = useState<User[]>([]);
	const [contacts, setContacts] = useState<Contact[]>([]);

	const [isPending, startTransition] = React.useTransition();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!laneId) return;
		try {
			toast.loading("Creating ticket...", { id: "ticket-create" });
			startTransition(async () => {
				if (ticket) {
					await updateTicket(
						{
							id: ticket.id,
							name,
							laneId,
							order: 0,
							value: parseInt(value),
							description,
							assignedUserId: assignUserId,
							customerId: contactId,
						},
						selectedTags,
					);
					toast.success("Ticket updated successfully", { id: "ticket-create" });
					setOpen(false);
					router.refresh();
				} else {
					await createTicket(
						{
							name,
							laneId,
							order: 0,
							value: parseInt(value),
							description,
							assignedUserId: assignUserId,
							customerId: contactId,
						},
						selectedTags,
					);
					toast.success("Ticket created successfully", { id: "ticket-create" });
					setOpen(false);
					setLaneId(null);
					router.refresh();
				}
			});
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong", { id: "ticket-create" });
		}
	};

	const [tags, setTags] = useState<Tag[]>([]);

	useEffect(() => {
		const fetchTags = async () => {
			const tags = await getTagsByClientId(clientId);
			setTags(tags);
		};

		const fetchClientWorkers = async () => {
			const workers = await getClientWorkers(clientId);
			setClientWorkers(workers);
		};

		const fetchContacts = async () => {
			const contacts = await getContactByClientId(clientId);
			setContacts(contacts);
		};

		fetchContacts();
		fetchClientWorkers();
		fetchTags();
	}, [clientId]);

	useEffect(() => {
		if (ticket) {
			setName(ticket.name);
			setDescription(ticket.description || "");
			setValue(ticket.value?.toString() || "");
			setAssignUserId(ticket.assignedUserId || "");
			setContactId(ticket.customerId || "");
			setSelectedTags(ticket.Tags);
		}
	}, [ticket]);

	console.log("ticket", assignUserId, contactId);

	return (
		<form className=' px-4 space-y-4' onSubmit={handleSubmit}>
			{/* Name */}
			<div className='grid gap-2'>
				<Label htmlFor='name'>Name</Label>
				<Input
					id='name'
					name='name'
					value={name}
					onChange={e => setName(e.target.value)}
					required
				/>
			</div>
			{/* Description */}
			<div className='grid gap-2'>
				<Label htmlFor='description'>Description</Label>
				<Input
					id='description'
					name='description'
					value={description}
					onChange={e => setDescription(e.target.value)}
					required
				/>
			</div>
			{/* Value */}
			<div className='grid gap-2'>
				<Label htmlFor='description'>Value</Label>
				<Input
					id='value'
					name='value'
					value={value}
					type='number'
					onChange={e => setValue(e.target.value)}
					required
				/>
			</div>

			{/* Tags */}
			<TagCreator
				clientId={clientId}
				pipelineId={pipelineId}
				tags={tags}
				setTags={setTags}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
			/>

			{/* Workers */}
			<div className=' space-y-3'>
				<Label>Assign Users</Label>
				<Select value={assignUserId} onValueChange={setAssignUserId}>
					<SelectTrigger className=' w-full'>
						<SelectValue className='' placeholder='Select workers' />
					</SelectTrigger>
					<SelectContent className=' w-full'>
						{clientWorkers.map(worker => (
							<SelectItem
								key={worker.id}
								value={worker.id}
								className='flex items-center gap-4'
							>
								<Image
									src={worker.avatarUrl}
									alt={worker.name}
									width={30}
									height={30}
									className=' rounded-full'
								/>
								{worker.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Contacts */}
			<div className=' space-y-3'>
				<Label>Contacts</Label>
				<Select value={contactId} onValueChange={setContactId}>
					<SelectTrigger className=' w-full'>
						<SelectValue className='' placeholder='Select Contacts' />
					</SelectTrigger>
					<SelectContent className=' w-full'>
						{contacts.map(contact => (
							<SelectItem
								key={contact.id}
								value={contact.id}
								className='flex items-center gap-4'
							>
								{contact.name}{" "}
								<span className=' text-muted-foreground text-xs'>
									({contact.email})
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<LoadingButton
				isPending={isPending}
				disabled={!name || !description || !value || !assignUserId}
				className=' w-full'
				type='submit'
			>
				{ticket ? "Update Ticket" : "Create Ticket"}
			</LoadingButton>
		</form>
	);
}
