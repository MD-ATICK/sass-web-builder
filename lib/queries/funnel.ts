"use server";

import { prisma } from "../db";
import { Funnel, FunnelPage } from "@prisma/client";

export const getFunnelsByClientId = async (clientId: string) => {
	const funnels = await prisma.funnel.findMany({
		where: {
			clientId,
		},
		include: {
			FunnelPages: true,
		},
	});
	return funnels;
};

export const createFunnel = async (
	data: Pick<
		Funnel,
		"name" | "description" | "favicon" | "subDomainName" | "clientId"
	>,
) => {
	return await prisma.funnel.create({
		data,
	});
};
export const updateFunnel = async (
	data: Pick<
		Funnel,
		"name" | "description" | "favicon" | "subDomainName" | "clientId" | "id"
	>,
) => {
	return await prisma.funnel.update({
		where: {
			id: data.id,
		},
		data,
	});
};

export const deleteFunnelById = async (funnelId: string) => {
	return await prisma.funnel.delete({
		where: {
			id: funnelId,
		},
	});
};

export const addToLiveProduct = async (
	liveProducts: string,
	funnelId: string,
) => {
	await prisma.funnel.update({
		where: {
			id: funnelId,
		},
		data: {
			liveProducts,
		},
	});
};

export const getFunnelById = async (funnelId: string) => {
	return await prisma.funnel.findUnique({
		where: { id: funnelId },
		include: { FunnelPages: { orderBy: { order: "asc" } } },
	});
};

export const createFunnelPageData = async (
	data: Pick<FunnelPage, "name" | "pathName" | "funnelId" | "order">,
) => {
	return await prisma.funnelPage.create({
		data: {
			...data,
			content: JSON.stringify([
				{
					content: [],
					id: "_body",
					name: "_body",
					styles: {
						backgroundColor: "#fff",
						type: "_body",
					},
				},
			]),
		},
	});
};

export const getFunnelBySubdomain = async (domain: string) => {
	return await prisma.funnel.findUnique({
		where: {
			subDomainName: domain,
		},
		include: {
			FunnelPages: true,
		},
	});
};

export const updateFunnelPageData = async (
	data: Pick<FunnelPage, "id" | "name" | "pathName" | "order" | "content">,
) => {
	return await prisma.funnelPage.update({ where: { id: data.id }, data });
};

export const deleteFunnelPageById = async (funnelPageId: string) => {
	return await prisma.funnelPage.delete({ where: { id: funnelPageId } });
};
