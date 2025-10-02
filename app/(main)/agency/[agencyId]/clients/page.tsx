import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { getUserDetails } from "@/lib/queries/queries";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CreateClientButton from "./_components/create-client-button";
import DeleteClientButton from "./_components/delete-client-button";
import EditButton from "./_components/edit-button";

// AGENCY OWNER Page

export default async function page() {
	const userDetails = await getUserDetails();

	return (
		<div className=' p-4 space-y-4'>
			<CreateClientButton role={userDetails?.role || "CLIENT_USER"} />
			<Command>
				<CommandInput placeholder='Client searching...' />
				<CommandList>
					{userDetails?.Agency?.clients?.map(client => (
						<CommandItem
							key={client.id}
							className=' flex justify-between w-full items-center'
						>
							<Link
								href={`/client/${client.id}`}
								className='flex items-center gap-3'
							>
								<Image
									src={client.clientLogo}
									width={80}
									height={80}
									alt={client.name}
								/>
								<div>
									<p className=' text-sm'>{client.name}</p>
									<p className=' text-xs text-muted-foreground'>
										{client.address}
									</p>
								</div>
							</Link>
							<div className='flex items-center gap-2'>
								<EditButton client={client} />
								<DeleteClientButton clientId={client.id} />
							</div>
						</CommandItem>
					))}
				</CommandList>
			</Command>
		</div>
	);
}
