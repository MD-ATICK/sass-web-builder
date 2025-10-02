import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { UserRound } from "lucide-react";
import React from "react";

export default async function page({
	params,
}: {
	params: { agencyId: string };
}) {
	const { agencyId } = params;
	const user = await currentUser();
	if (!user) return <p>Clerk User Not found</p>;

	const userDetails = await prisma.user.findUnique({
		where: {
			email: user.emailAddresses[0].emailAddress,
		},
	});

	if (!userDetails) return <p>User Not found</p>;

	const agency = await prisma.agency.findUnique({
		where: {
			id: agencyId,
		},
		include: {
			clients: true,
		},
	});

	if (!agency) return <p>Agency Not found</p>;

	return (
		<div className=' p-5 w-full space-y-6'>
			<div className=' flex items-center  justify-between'>
				<div className='flex items-center gap-2'>
					<UserRound
						size={35}
						className=' bg-primary-foreground/30 text-primary-foreground p-2 rounded-md'
					/>
					<p className=' text-sm'>Customize Agency</p>
				</div>
				<AgencyDetails agency={agency} label='Customize Agency' />
			</div>
			<UserDetails user={userDetails} clients={agency.clients} />
		</div>
	);
}
