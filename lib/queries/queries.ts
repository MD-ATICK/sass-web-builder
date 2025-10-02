"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Agency, client, Role, User } from "@prisma/client";
import { v4 } from "uuid";
import { userFormValues } from "@/components/forms/user-details";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";

const clerkAuthClient = await clerkClient();

export const UpdateAgencyConnectAccountId = async (
	agencyId: string,
	connectAccountId: string,
) => {
	await prisma.agency.update({
		where: {
			id: agencyId,
		},
		data: {
			connectAccountId,
		},
	});
	revalidatePath(`/agency/${agencyId}/launchpad`);
};

export const UpdateClientConnectAccountId = async (
	clientId: string,
	connectAccountId: string,
) => {
	await prisma.client.update({
		where: {
			id: clientId,
		},
		data: {
			connectAccountId,
		},
	});
	revalidatePath(`/client/${clientId}/launchpad`);
};

export async function getUserDetails() {
	const user = await currentUser();

	if (!user) return;

	return await prisma.user.findUnique({
		where: {
			email: user.emailAddresses[0].emailAddress,
		},
		include: {
			Agency: {
				include: {
					SidebarOption: true,
					clients: {
						include: {
							SidebarOption: true,
						},
					},
					Notification: {
						include: { User: true },
					},
				},
			},
			Permissions: true,
		},
	});
}

export async function createAgencyUser(agencyId: string, user: User) {
	if (user.role === "AGENCY_OWNER") return;

	return await prisma.user.upsert({
		where: { email: user.email },
		update: user,
		create: user,
	});
}

export async function saveActivityLogNotification({
	agencyId,
	description,
	clientId,
}: {
	agencyId?: string;
	description: string;
	clientId?: string;
}) {
	const auth = await currentUser();

	let newUser;

	if (!auth) {
		newUser = await prisma.user.findFirst({
			where: {
				Agency: {
					clients: {
						some: { id: clientId },
					},
				},
			},
		});
	}

	if (auth) {
		newUser = await prisma.user.findUnique({
			where: {
				email: auth.emailAddresses[0].emailAddress,
			},
		});
	}

	if (!newUser) {
		console.log("could not find a user");
		return;
	}

	let newAgencyId = agencyId;

	if (!agencyId && !clientId)
		throw new Error("@clientId or AgencyId is required");

	if (!agencyId) {
		const client = await prisma.client.findUnique({
			where: {
				id: clientId,
			},
		});
		newAgencyId = client?.agencyId;
	}

	if (!newAgencyId) {
		throw new Error("@newAgencyId is required");
	}

	if (clientId) {
		await prisma.notification.create({
			data: {
				notification: `${newUser.name} ${description}`,
				userId: newUser.id,
				agencyId: newAgencyId,
				clientId,
			},
		});
	} else {
		await prisma.notification.create({
			data: {
				notification: `${newUser.name} ${description}`,
				userId: newUser.id,
				agencyId: newAgencyId,
			},
		});
	}
}

export async function acceptInvitation() {
	const user = await currentUser();
	if (!user) return;

	const hasInvitation = await prisma.invitation.findUnique({
		where: {
			email: user.emailAddresses[0].emailAddress,
			status: "PENDING",
		},
	});

	if (hasInvitation) {
		const createdUser = await createAgencyUser(hasInvitation.agencyId, {
			email: user.emailAddresses[0].emailAddress,
			agencyId: hasInvitation.agencyId,
			avatarUrl: user.imageUrl,
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			role: hasInvitation.role,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await saveActivityLogNotification({
			agencyId: hasInvitation.agencyId,
			description: "Joined",
		});

		if (createdUser) {
			await clerkAuthClient.users.updateUserMetadata(user.id, {
				privateMetadata: {
					role: hasInvitation.role || Role.CLIENT_USER,
				},
			});

			await prisma.invitation.delete({
				where: {
					email: user.emailAddresses[0].emailAddress,
				},
			});

			return createdUser?.agencyId;
		} else return null;
	} else {
		const dbUser = await prisma.user.findUnique({
			where: {
				email: user.emailAddresses[0].emailAddress,
			},
		});

		return dbUser ? dbUser.agencyId : null;
	}
}

export const updateAgencyDetails = async (
	agencyId: string,
	data: Partial<Agency>,
) => {
	return await prisma.agency.update({
		where: {
			id: agencyId,
		},
		data: data,
	});
};

export const updateClientDetails = async (
	clientId: string,
	data: Partial<Agency>,
) => {
	return await prisma.client.update({
		where: {
			id: clientId,
		},
		data: data,
	});
};

export const deleteAgencyById = async (agencyId: string) => {
	return await prisma.agency.delete({
		where: {
			id: agencyId,
		},
	});
};
export const deleteClientByAgencyId = async (agencyId: string) => {
	return await prisma.client.delete({
		where: {
			id: agencyId,
		},
	});
};

export const initUser = async ({ role }: { role: Role }) => {
	const user = await currentUser();
	if (!user) return;

	const userData = await prisma.user.upsert({
		where: {
			email: user.emailAddresses[0].emailAddress,
		},
		update: { role },
		create: {
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			email: user.emailAddresses[0].emailAddress,
			avatarUrl: user.imageUrl,
			role: role || "CLIENT_USER",
		},
	});

	await clerkAuthClient.users.updateUserMetadata(user.id, {
		privateMetadata: {
			role: role || "CLIENT_USER",
		},
	});

	return userData;
};

export const initAgency = async (
	agency: Omit<Agency, "createdAt" | "updatedAt" | "connectAccountId">,
) => {
	if (!agency.companyEmail) return;
	try {
		return await prisma.agency.upsert({
			where: {
				id: agency.id,
			},
			update: agency,
			create: {
				...agency,
				users: {
					connect: {
						email: agency.companyEmail,
					},
				},
				SidebarOption: {
					create: [
						{
							name: "Dashboard",
							icon: "category",
							link: `/agency/${agency.id}`,
						},
						{
							name: "Launchpad",
							icon: "clipboardIcon",
							link: `/agency/${agency.id}/launchpad`,
						},
						{
							name: "Billing",
							icon: "payment",
							link: `/agency/${agency.id}/billing`,
						},
						{
							name: "Settings",
							icon: "settings",
							link: `/agency/${agency.id}/settings`,
						},
						{
							name: "Clients",
							icon: "person",
							link: `/agency/${agency.id}/clients`,
						},
						{
							name: "Team",
							icon: "shield",
							link: `/agency/${agency.id}/team`,
						},
					],
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
};
export const initClient = async (
	client: Omit<client, "createdAt" | "updatedAt" | "connectAccountId">,
) => {
	if (!client.companyEmail) return;

	try {
		const agencyOwner = await prisma.user.findFirst({
			where: {
				Agency: {
					id: client.agencyId,
				},
				role: "AGENCY_OWNER",
			},
		});

		if (!agencyOwner) throw new Error("No Agency Owner");

		const permissionId = v4();
		return await prisma.client.upsert({
			where: {
				id: client.id,
			},
			update: client,
			create: {
				...client,
				Pipeline: {
					create: { name: "Lead Cycle" },
				},
				Permissions: {
					create: {
						email: agencyOwner.email,
						access: true,
						id: permissionId,
					},
					connect: {
						clientId: client.id,
						id: permissionId,
					},
				},
				SidebarOption: {
					create: [
						{
							name: "Launchpad",
							icon: "clipboardIcon",
							link: `/client/${client.id}/launchpad`,
						},
						{
							name: "Settings",
							icon: "settings",
							link: `/client/${client.id}/settings`,
						},
						{
							name: "Funnels",
							icon: "pipelines",
							link: `/client/${client.id}/funnels`,
						},
						{
							name: "Media",
							icon: "database",
							link: `/client/${client.id}/media`,
						},
						{
							name: "Automations",
							icon: "chip",
							link: `/client/${client.id}/automations`,
						},
						{
							name: "Pipelines",
							icon: "flag",
							link: `/client/${client.id}/pipelines`,
						},
						{
							name: "Contacts",
							icon: "person",
							link: `/client/${client.id}/contacts`,
						},
						{
							name: "Dashboard",
							icon: "category",
							link: `/client/${client.id}`,
						},
					],
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const getNotificationsByAgencyId = async (agencyId: string) => {
	return await prisma.notification.findMany({
		where: {
			agencyId: agencyId,
		},
		include: {
			User: true,
		},
	});
};

export const updateUser = async (values: userFormValues) => {
	return await prisma.user.update({
		where: {
			email: values.email,
		},
		data: {
			name: values.name,
			avatarUrl: values.avatarUrl,
		},
	});
};
export const changePermission = async ({
	permissionId,
	permission,
	clientId,
	email,
}: {
	permissionId: string | undefined;
	permission: boolean;
	clientId: string;
	email: string;
}) => {
	return await prisma.permissions.upsert({
		where: {
			id: permissionId,
		},
		update: { access: permission },
		create: {
			access: permission,
			clientId,
			email,
		},
	});
};

export const deleteClientById = async (clientId: string) => {
	return await prisma.client.delete({
		where: {
			id: clientId,
		},
	});
};

export const getClientById = async (clientId: string) => {
	return await prisma.client.findUnique({
		where: {
			id: clientId,
		},
	});
};

export const sendInvitation = async ({
	email,
	agencyId,
	role,
}: {
	email: string;
	agencyId: string;
	role: Role;
}) => {
	try {
		await prisma.invitation.create({
			data: {
				email,
				agencyId,
				role,
			},
		});
		if (!process.env.NEXT_PUBLIC_URL) {
			throw new Error("NEXT_PUBLIC_URL is not defined");
		}

		await clerkAuthClient.invitations.createInvitation({
			emailAddress: email,
			redirectUrl: process.env.NEXT_PUBLIC_URL,
			publicMetadata: {
				role,
				agencyId,
				throughInvitation: true,
			},
		});
	} catch (error) {
		throw error;
	}
};

export const getAgencyUsers = async (agencyId: string) => {
	return await prisma.user.findMany({
		where: {
			agencyId,
		},
		include: {
			Agency: true,
			Permissions: true,
		},
	});
};

export const getUserDetailsByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
		include: {
			Agency: {
				include: {
					SidebarOption: true,
					clients: {
						include: {
							SidebarOption: true,
						},
					},
					Notification: {
						include: { User: true },
					},
				},
			},
			Permissions: true,
		},
	});
};

export const getMediaByClientId = async (clientId: string) => {
	return await prisma.media.findMany({
		where: {
			clientId,
		},
	});
};

export const createMedia = async (data: {
	clientId: string;
	link: string;
	name: string;
}) => {
	return await prisma.media.create({
		data,
	});
};

export const deleteMedia = async (mediaId: string) => {
	return await prisma.media.delete({
		where: {
			id: mediaId,
		},
	});
};
