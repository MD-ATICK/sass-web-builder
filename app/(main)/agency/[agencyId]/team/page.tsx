import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import React from "react";
import logo from "@/assets/plura-logo.svg";
import { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import ActionButtons from "./_components/action-buttons";
import { getAgencyUsers } from "@/lib/queries/queries";

const colors: Record<Role, string> = {
	AGENCY_ADMIN: "bg-orange-600",
	AGENCY_OWNER: "bg-emerald-600",
	CLIENT_USER: "bg-sky-600",
	CLIENT_QUEST: "bg-yellow-600",
};

export default async function TeamPage({
	params,
}: {
	params: Promise<{ agencyId: string }>;
}) {
	const { agencyId } = await params;

	const agencyUsers = await getAgencyUsers(agencyId);

	return (
		<div className=' p-4 bg-popover'>
			<Table className=' bg-background p-2 rounded-lg'>
				<TableHeader>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Ownership</TableCell>
						<TableCell>Role</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{agencyUsers.map(user => (
						<TableRow key={user.id}>
							<TableCell className='flex items-center gap-2'>
								<Image
									src={user.avatarUrl}
									height={35}
									width={35}
									alt={user.name}
									className=' rounded-full'
								/>
								{user.name}
							</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								{user.role === "AGENCY_OWNER" ? (
									<div className=' flex items-center gap-2 text-muted-foreground justify-start'>
										<span className=' bg-emerald-600 h-2 aspect-square rounded-full'></span>
										Agency Of
										<Image
											src={user?.Agency?.agencyLogo || logo}
											height={30}
											width={100}
											alt=''
										/>
									</div>
								) : user.Permissions.find(permission => permission.access) ? (
									<div className=' flex items-center gap-2 text-muted-foreground justify-start'>
										<span className=' flex bg-orange-600 h-2 aspect-square rounded-full'></span>
										Client Of
										<Image
											src={user?.Agency?.agencyLogo || logo}
											height={30}
											width={100}
											alt=''
										/>
									</div>
								) : (
									<p className=' text-sm text-muted-foreground'>
										Not Account Yet
									</p>
								)}
							</TableCell>
							<TableCell>
								<p
									className={cn(
										colors[user.role],
										"w-fit p-1 px-2 text-xs font-semibold rounded-full",
									)}
								>
									{user.role}
								</p>
							</TableCell>
							<TableCell>
								{agencyId && (
									<ActionButtons
										user={user}
										agencyId={agencyId}
										email={user.email}
									/>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
