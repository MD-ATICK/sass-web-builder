import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { FormatValue } from "@/lib/helper";
import { format } from "date-fns";
import React from "react";
import ContactHeader from "./_components/contact-header";
import CreateContactDialog from "@/sheet/create-contact-dialog";
import ActionButtons from "./_components/action-buttons";

export default async function page({
	params,
}: {
	params: Promise<{ clientId: string }>;
}) {
	const { clientId } = await params;

	const client = await prisma.client.findUnique({
		where: {
			id: clientId,
		},
		include: {
			Contact: {
				include: {
					Ticket: true,
				},
			},
		},
	});

	return (
		<div className=''>
			<CreateContactDialog clientId={clientId} />
			<ContactHeader />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Active</TableHead>
						<TableHead>Created Date</TableHead>
						<TableHead>Total Value</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{client?.Contact.map(contact => {
						const totalValue = contact.Ticket.reduce(
							(acc, ticket) => acc + (ticket.value || 0),
							0,
						);

						return (
							<TableRow key={contact.id}>
								<TableCell>
									<div className=' h-8 aspect-square rounded-full bg-primary flex justify-center upp items-center '>
										{contact.name.slice(0, 2)}
									</div>
								</TableCell>
								<TableCell>{contact.email}</TableCell>
								<TableCell>
									{contact.Ticket.length === 0 ? (
										<Badge variant={"destructive"}>InActive</Badge>
									) : (
										<Badge>Active</Badge>
									)}
								</TableCell>
								<TableCell>{format(contact.createdAt, "PP")}</TableCell>
								<TableCell>
									<Badge className=' bg-emerald-700 text-sm'>
										{FormatValue(totalValue)}
									</Badge>
								</TableCell>
								<TableCell>
									<ActionButtons contact={contact} />
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
