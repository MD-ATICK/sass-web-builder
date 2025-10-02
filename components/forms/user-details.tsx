"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { client, Role, User } from "@prisma/client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { getFormData } from "@/lib/helper";
import {
	changePermission,
	getUserDetailsByEmail,
	saveActivityLogNotification,
	updateUser,
} from "@/lib/queries/queries";
import { toast } from "sonner";
import LoadingButton from "../global/loading-button";
import { Switch } from "../ui/switch";
import Image from "next/image";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useUserDetailsOpen } from "@/sheet/hooks/use-user-details-open";

type props = {
	user: Partial<User>;
	clients: client[];
};

export type userFormValues = {
	name: string;
	email: string;
	avatarUrl: string;
	role: Role;
};

type UserDetailsType = Awaited<ReturnType<typeof getUserDetailsByEmail>>;
export default function UserDetails({ user, clients }: props) {
	const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
	const [isPending, startTransition] = useTransition();
	const [isCheckedPending, startCheckedTransition] = useTransition();
	const router = useRouter();
	const { setOpen } = useUserDetailsOpen();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			startTransition(async () => {
				e.preventDefault();
				toast.loading("Updating user details...", { id: "user-update" });
				const values = getFormData<userFormValues>(e.currentTarget);

				const userUpdated = await updateUser(values);
				if (userDetails && userUpdated) {
					userDetails.Agency?.clients
						.filter(client =>
							userDetails.Permissions.find(
								permission =>
									permission.clientId === client.id && permission.access,
							),
						)
						.forEach(async client => {
							await saveActivityLogNotification({
								clientId: client.id,
								description: `${userUpdated.name} | Updated User details`,
							});
						});

					toast.success("User details updated!", { id: "user-update" });
				}
			});
		} catch (error) {
			console.log(error);
			toast.error("User details failed!", { id: "user-update" });
		}
	};

	const handlePermission = async ({
		permission,
		permissionId,
		clientId,
		email,
	}: {
		permission: boolean;
		permissionId?: string;
		clientId: string;
		email: string;
	}) => {
		try {
			toast.loading("Changing permission...", { id: "check-change" });
			startCheckedTransition(async () => {
				setOpen(false);
				await changePermission({
					permissionId,
					permission,
					clientId,
					email,
				});

				await saveActivityLogNotification({
					clientId: clientId,
					description: `${user?.name} | ${
						userDetails?.Permissions.find(
							permission => permission.clientId === clientId,
						)?.email
					}`,
					agencyId: userDetails?.Agency?.id,
				});
				toast.success("Permission changed!", { id: "check-change" });
				router.refresh();
			});
		} catch (error) {
			console.log(error);
			toast.error("Failed to change permission", { id: "check-change" });
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await getUserDetailsByEmail(user.email!);
			setUserDetails(data);
		};
		fetchData();
	}, [user.email]);

	return (
		<div className=' space-y-10'>
			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Name */}
				<div className='grid gap-2'>
					<Label htmlFor='name'>User Name</Label>
					<Input
						id='name'
						name='name'
						defaultValue={user?.name || ""}
						required
					/>
				</div>
				{/* Email */}
				<div className='grid gap-2'>
					<Label htmlFor='name'>User Email</Label>
					<Input
						id='email'
						name='email'
						readOnly
						defaultValue={user?.email || ""}
						required
					/>
				</div>
				{/* Email */}
				<div className='grid gap-2'>
					<Label htmlFor='avatarUrl'>Avatar Url</Label>
					<Input
						id='avatarUrl'
						name='avatarUrl'
						defaultValue={user?.avatarUrl || ""}
						required
					/>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='role'>Role</Label>
					<Select name='role' defaultValue={user?.role || ""}>
						<SelectTrigger
							disabled={user.role === "AGENCY_OWNER"}
							className=' w-full'
						>
							<SelectValue placeholder='Select a Role' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='AGENCY_OWNER'>AGENCY OWNER</SelectItem>
							<SelectItem value='AGENCY_ADMIN'>AGENCY ADMIN</SelectItem>
							<SelectItem value='CLIENT_USER'>CLIENT USER</SelectItem>
							<SelectItem value='CLIENT_QUEST'>CLIENT QUEST</SelectItem>
							{/* Add more countries as needed */}
						</SelectContent>
					</Select>
				</div>

				<LoadingButton
					isPending={isPending}
					disabled={isPending}
					className=' w-full'
					type='submit'
				>
					Save
				</LoadingButton>
			</form>
			{user.role === "AGENCY_OWNER" && (
				<div className=' space-y-4 '>
					<div className=' space-y-1'>
						<h2 className=' '>Client Permission to become Team Member</h2>
						<p className='  text-sm text-muted-foreground'>
							You can give Sub Account access to team member by turning on
							access control for each Sub Account. This is only visible to
							agency owners
						</p>
					</div>
					<div className=' space-y-3'>
						{clients.length > 0 &&
							clients.map(client => {
								const havePermission = userDetails?.Permissions.filter(
									permission => permission.clientId === client.id,
								);

								if (!havePermission) return null;
								const newId = v4();

								if (havePermission) {
									return (
										<div
											key={client.id}
											className=' p-4 border rounded-md flex items-center justify-between gap-2'
										>
											<div className='flex items-center gap-4'>
												<Image
													src={client.clientLogo}
													alt='Client Logo'
													height={20}
													width={50}
												/>
												<p className=' font-semibold'>{client.name}</p>
											</div>
											<Switch
												disabled={isCheckedPending}
												onCheckedChange={permission =>
													handlePermission({
														permission,
														clientId: client.id,
														email: user?.email || "",
														permissionId: havePermission[0]?.id
															? havePermission[0].id
															: newId,
													})
												}
												defaultChecked={havePermission[0]?.access}
											/>
										</div>
									);
								}
							})}
					</div>
				</div>
			)}
		</div>
	);
}
