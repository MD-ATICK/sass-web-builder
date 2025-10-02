import AgencyDetails from "@/components/forms/agency-details";
import { acceptInvitation, getUserDetails } from "@/lib/queries/queries";
import { auth } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
	searchParams,
}: {
	searchParams: Promise<{ plan: Plan; state: string; code: string }>;
}) {
	const user = await auth();
	if (!user) return redirect("/agency/sign-in");

	const agencyId = await acceptInvitation();
	const dbUser = await getUserDetails();

	const awaitedSearchParams = await searchParams;

	if (agencyId) {
		if (dbUser?.role === "CLIENT_QUEST" || dbUser?.role === "CLIENT_USER") {
			return redirect("/client");
		} else if (
			dbUser?.role === "AGENCY_ADMIN" ||
			dbUser?.role === "AGENCY_OWNER"
		) {
			if (awaitedSearchParams.plan) {
				return redirect(
					`/agency/${agencyId}/billing?plan=${awaitedSearchParams.plan}`,
				);
			}
			if (awaitedSearchParams.state) {
				const statePath = awaitedSearchParams.state.split("___")[0];
				const stateAgencyId = awaitedSearchParams.state.split("___")[1];

				if (!stateAgencyId) {
					return <div>Not Authorized</div>;
				}

				return redirect(
					`/agency/${stateAgencyId}/${statePath}?code=${awaitedSearchParams.code}`,
				);
			} else {
				return redirect(`/agency/${agencyId}`);
			}
		} else {
			<div>
				<h1>Not Authorized</h1>
			</div>;
		}
	}

	return (
		<div className='flex items-center gap-3 h-screen'>
			<div className=' border-r h-full p-4 flex flex-col justify-center items-center'>
				<h1 className=' text-xl font-bold text-center'>Create An Agency</h1>
				<AgencyDetails />
			</div>
		</div>
	);
}
