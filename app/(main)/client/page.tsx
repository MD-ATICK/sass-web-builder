import UnAuthorized from "@/components/unauthorized";
import { getUserDetails } from "@/lib/queries/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
	searchParams,
}: {
	searchParams: Promise<{ code: string; state: string; plan: string }>;
}) {
	const { code, state } = await searchParams;
	const auth = await currentUser();
	if (!auth) redirect("/agency/sign-in");

	const user = await getUserDetails();
	const client = user?.Permissions.find(
		permission =>
			user.Agency?.clients.find(client => client.id === permission.clientId) &&
			permission.access,
	);

	if (!client) return redirect("/");

	if (state && code) {
		const path = state.split("___")[0];
		const clientId = state.split("___")[1];
		return redirect(`/client/${clientId}/${path}?code=${code}`);
	} else {
		redirect(`/client/${client.id}`);
	}

	return <UnAuthorized />;
}
