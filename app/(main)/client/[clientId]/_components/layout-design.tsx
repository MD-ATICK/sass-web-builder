import TopBar from "@/app/(main)/agency/[agencyId]/_components/top-bar";
import MenuOptions from "@/components/menu-options";
import UnAuthorized from "@/components/unauthorized";
import { prisma } from "@/lib/db";
import {
	acceptInvitation,
	getNotificationsByAgencyId,
	getUserDetails,
} from "@/lib/queries/queries";

import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import React from "react";

export default async function LayoutDesign({
	children,
	clientId,
}: {
	children: React.ReactNode;
	clientId: string;
}) {
	const user = await currentUser();
	const agencyId = await acceptInvitation();
	if (!agencyId) return <UnAuthorized />;

	const userDetails = await getUserDetails();

	const client = await prisma.client.findUnique({
		where: {
			id: clientId,
		},
		include: {
			SidebarOption: true,
		},
	});

	if (!client) return <UnAuthorized />;

	let allNotifications;

	allNotifications = await getNotificationsByAgencyId(agencyId);
	if (user?.privateMetadata.role === Role.CLIENT_USER) {
		allNotifications = allNotifications.filter(
			notification => notification.clientId === clientId,
		);
	}

	return (
		<div className='flex h-svh w-full'>
			<MenuOptions
				type='client'
				sidebarLogo={client.clientLogo}
				sidebarOptions={client.SidebarOption}
				user={userDetails}
				details={client}
				clients={userDetails?.Agency?.clients || []}
			/>
			<div className=' w-full'>
				<TopBar
					notifications={allNotifications}
					role={user?.privateMetadata.role as Role}
				/>
				{children}
			</div>
		</div>
	);
}
