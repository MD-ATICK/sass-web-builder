"use server";

import { Contact } from "@prisma/client";
import { prisma } from "../db";

export const getContactByClientId = async (clientId: string) => {
	return await prisma.contact.findMany({
		where: {
			clientId,
		},
	});
};

export const createContact = async (
	data: Pick<Contact, "clientId" | "email" | "name">,
) => {
	return await prisma.contact.create({ data });
};
export const UpdateContact = async (
	data: Pick<Contact, "id" | "email" | "name">,
) => {
	return await prisma.contact.update({
		where: {
			id: data.id,
		},
		data,
	});
};
