import ClientDetails from "@/components/forms/client-details";
import UserDetails from "@/components/forms/user-details";
import UnAuthorized from "@/components/unauthorized";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import SettingsHeader from "./_components/settings-header";

export default async function page({
	params,
}: {
	params: Promise<{ clientId: string }>;
}) {
	const { clientId } = await params;

	const auth = await currentUser();
	if (!auth) return <UnAuthorized />;

	const user = await prisma.user.findUnique({ where: { id: auth.id } });
	if (!user) return <UnAuthorized />;

	const client = await prisma.client.findUnique({ where: { id: clientId } });
	if (!client) return <UnAuthorized />;

	const agency = await prisma.agency.findUnique({
		where: { id: client?.agencyId },
		include: { clients: true },
	});

	if (!agency) return <UnAuthorized />;

	return (
		<div className=' p-4 space-y-4'>
			<ClientDetails agencyDetails={agency} userName={user.name} />
			<SettingsHeader client={client} />
			<UserDetails clients={agency?.clients} user={user} />
		</div>
	);
}
