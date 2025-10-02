"use server";

import { Lane, Pipeline, Tag, Ticket } from "@prisma/client";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export const getPipelines = async (clientId: string) => {
	return await prisma.pipeline.findMany({
		where: {
			clientId,
		},
	});
};

export const upsertPipeline = async (pipeline: Pipeline) => {
	return await prisma.pipeline.upsert({
		where: {
			id: pipeline.id,
		},
		update: pipeline,
		create: pipeline,
	});
};

export const createPipeline = async (
	pipeline: Pick<Pipeline, "name" | "clientId">,
) => {
	return await prisma.pipeline.create({
		data: pipeline,
	});
};

export const deletePipeline = async (pipelineId: string) => {
	return await prisma.pipeline.delete({
		where: {
			id: pipelineId,
		},
	});
};

export const getPipelineById = async (pipelineId: string) => {
	return await prisma.pipeline.findUnique({
		where: {
			id: pipelineId,
		},
	});
};

export const createLane = async (
	lane: Pick<Lane, "name" | "pipelineId" | "order">,
) => {
	const newLane = await prisma.lane.create({
		data: lane,
		include: {
			Pipeline: true,
		},
	});

	revalidatePath(
		`/client/${newLane.Pipeline.clientId}/pipelines/${lane.pipelineId}`,
	);
};

export const updateLaneName = async (
	name: string,
	laneId: string,
	clientId: string,
) => {
	const lane = await prisma.lane.update({
		where: {
			id: laneId,
		},
		data: { name },
	});
	revalidatePath(`/client/${clientId}/pipelines/${lane.pipelineId}`);
};

export const getLanesByPipelineId = async (pipelineId: string) => {
	return await prisma.lane.findMany({
		where: {
			pipelineId,
		},
		include: {
			Tickets: {
				include: { Customer: true, Assigned: true, Tags: true },
				orderBy: { order: "asc" },
			},
		},
		orderBy: {
			order: "asc",
		},
	});
};

export const deleteLane = async (laneId: string, clientId: string) => {
	const lane = await prisma.lane.delete({
		where: {
			id: laneId,
		},
	});

	revalidatePath(`/client/${clientId}/pipelines/${lane.pipelineId}`);
};

export const getTagsByClientId = async (clientId: string) => {
	return await prisma.tag.findMany({
		where: {
			clientId,
		},
	});
};

export const getContactByClientId = async (clientId: string) => {
	return await prisma.contact.findMany({
		where: {
			clientId,
		},
	});
};

export const createTagByClientId = async (
	tag: Pick<Tag, "name" | "color" | "clientId">,
) => {
	return await prisma.tag.create({
		data: tag,
	});
};

export const getClientWorkers = async (clientId: string) => {
	return await prisma.user.findMany({
		where: {
			Agency: {
				clients: {
					some: {
						id: clientId,
					},
				},
			},
			role: "CLIENT_USER",
			Permissions: {
				some: {
					access: true,
					clientId,
				},
			},
		},
	});
};

export const createTicket = async (
	ticket: Pick<
		Ticket,
		| "name"
		| "laneId"
		| "order"
		| "value"
		| "description"
		| "assignedUserId"
		| "customerId"
	>,
	Tags: Tag[],
) => {
	await prisma.ticket.create({
		data: {
			...ticket,
			Tags: {
				connect: Tags,
			},
		},
	});
};

export const updateAllLanesOrder = async (allLanes: Lane[]) => {
	console.log(allLanes);
	const updateLanes = allLanes.map(lane =>
		prisma.lane.update({
			where: {
				id: lane.id,
			},
			data: {
				order: lane.order,
			},
		}),
	);

	await prisma.$transaction(updateLanes);
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
	const updatingTickets = tickets.map(ticket =>
		prisma.ticket.update({
			where: {
				id: ticket.id,
			},
			data: {
				laneId: ticket.laneId,
				order: ticket.order,
			},
		}),
	);

	await prisma.$transaction(updatingTickets);
};

export const deleteTicket = async (ticketId: string) => {
	return await prisma.ticket.delete({
		where: {
			id: ticketId,
		},
	});
};

export const updateTicket = async (ticket: Partial<Ticket>, Tags: Tag[]) => {
	return await prisma.ticket.update({
		where: {
			id: ticket.id,
		},
		data: {
			...ticket,
			Tags: {
				set: [],
				connect: Tags,
			},
		},
	});
};
