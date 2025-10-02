"use client";
import Logo from "@/components/global/logo";
import Notifications, { NotificationsType } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { useSidebarOpen } from "@/zustand/use-sidebar-open";
import { UserButton } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { SidebarOpen } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

export default function TopBar({
	notifications,
	role,
}: {
	notifications: NotificationsType;
	role: Role;
}) {
	const { setOpen } = useSidebarOpen();

	const { funnelPageId } = useParams();
	if (funnelPageId) return null;
	return (
		<div className=' h-14 border-b bg-background  flex items-center justify-between px-4 w-full'>
			<div className='flex items-center gap-3'>
				<Button
					variant={"ghost"}
					size={"icon"}
					onClick={() => setOpen(true)}
					className=' lg:hidden'
				>
					<SidebarOpen size={15} />
				</Button>
				<Logo />
			</div>
			<div className='flex items-center gap-4'>
				<UserButton />
				<Notifications role={role} allNotifications={notifications} />
			</div>
		</div>
	);
}
