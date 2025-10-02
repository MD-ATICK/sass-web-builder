import LayoutDesign from "@/components/layout-design";
import UnAuthorized from "@/components/unauthorized";
import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ agencyId: string }>;
}) {
	const { agencyId } = await params;
	if (!agencyId) return redirect("/");

	const user = await currentUser();
	if (!user) return redirect("/");

	if (user.privateMetadata.role !== Role.AGENCY_OWNER) {
		return <UnAuthorized />;
	}

	// let notifications = [];

	// const getNotifications = await getNotificationsByAgencyId(agencyId);
	// if (getNotifications) notifications = getNotifications;

	return (
		<div>
			<LayoutDesign id={agencyId} type='agency'>
				{children}
			</LayoutDesign>
		</div>
	);
}
