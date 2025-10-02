import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
	params,
}: {
	params: Promise<{ clientId: string }>;
}) {
	const { clientId } = await params;
	if (!clientId) return;

	const pipeLine = await prisma.pipeline.findFirst({ where: { clientId } });

	if (pipeLine) {
		redirect(`/client/${clientId}/pipelines/${pipeLine.id}`);
	}

	return <div>No Pipelines Found</div>;
}
