import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import Image from "next/image";
import { getNotificationsByAgencyId } from "@/lib/queries/queries";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Role } from "@prisma/client";

export type NotificationsType = Awaited<
	ReturnType<typeof getNotificationsByAgencyId>
>;
export default function Notifications({
	allNotifications,
	clientId,
	role,
}: {
	allNotifications: NotificationsType;
	clientId?: string;
	role: Role;
}) {
	const [notifications, setNotifications] =
		useState<NotificationsType>(allNotifications);

	const [clientShow, setClientShow] = useState<boolean>(false);

	useEffect(() => {
		if (clientShow) {
			setNotifications(prev =>
				prev.filter(notification => notification.clientId === clientId),
			);
		} else {
			setNotifications(allNotifications);
		}
	}, [clientShow, allNotifications, clientId]);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size={"icon"} className=' rounded-full' variant={"ghost"}>
					<Bell size={15} />
				</Button>
			</SheetTrigger>
			<SheetContent className=' w-full lg:w-[400px] p-4 gap-2'>
				<p className='flex items-center gap-2 text-sm'>
					{" "}
					<Bell className=' text-purple-600' size={16} /> Notifications{" "}
				</p>
				<Separator />
				{(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
					<div className='flex justify-between items-center'>
						<p className=' text-sm'> Client Notifications</p>
						<Switch checked={clientShow} onCheckedChange={setClientShow} />
					</div>
				)}
				<Separator />
				<Command className=' space-y-3'>
					<CommandInput placeholder='Search notifications...' />
					<CommandList>
						<CommandEmpty className=' text-center text-sm'>
							No Notifications Found
						</CommandEmpty>
						<CommandGroup heading='Notifications' className=' '>
							{notifications?.map((notification, index) => (
								<CommandItem
									key={index}
									className='flex items-center last:border-none border-b py-2  justify-between text-sm gap-3'
								>
									<Image
										src={notification.User.avatarUrl}
										alt=''
										width={40}
										height={40}
										className=' rounded-full'
									/>
									<div className=' text-xs flex flex-col w-full'>
										<p>{notification.notification.split("|")[0]}</p>
										<p className=' text-muted-foreground'>
											{notification.notification.split("|")[1]} (
											{new Date(notification.createdAt).toLocaleString()})
										</p>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</SheetContent>
		</Sheet>
	);
}
