"use client";
import { getUserDetails } from "@/lib/queries/queries";
import {
	Agency,
	AgencySidebarOption,
	client,
	clientSidebarOption,
} from "@prisma/client";
import React from "react";
import { ChevronsUpDown, Compass, SidebarClose } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { motion } from "framer-motion";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import Link from "next/link";
import { Button } from "./ui/button";
import { useClientUpsert } from "@/zustand/use-client-upsert";
import { cn } from "@/lib/utils";
import { useSidebarOpen } from "@/zustand/use-sidebar-open";
import { Separator } from "./ui/separator";
import { icons } from "@/constants";
import { useParams } from "next/navigation";

type Props = {
	details: Agency | client;
	defaultOpen?: boolean;
	sidebarLogo: string;
	sidebarOptions: AgencySidebarOption[] | clientSidebarOption[];
	clients: client[];
	user: Awaited<ReturnType<typeof getUserDetails>>;
	type?: "agency" | "client";
};

export default function MenuOptions({
	details,
	sidebarLogo,
	user,
	clients,
	sidebarOptions,
	type = "agency",
}: Props) {
	const { setOpen } = useClientUpsert();
	const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebarOpen();

	const { funnelPageId } = useParams();
	if (funnelPageId) return null;

	return (
		<motion.div
			initial={{ x: -200, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			className={cn(
				"  py-6 lg:p-3 bg-background absolute z-40  lg:relative  duration-300 transition-all ease-out overflow-clip whitespace-nowrap w-0 lg:min-w-[300px] border-r h-svh space-y-4 ",
				sidebarOpen && " w-[300px]",
			)}
		>
			<Link
				href={"/"}
				className='flex w-full items-center gap-2 justify-between'
			>
				<div className=' h-14  w-full relative'>
					<Image
						src={sidebarLogo}
						alt='Sidebar Logo'
						fill
						className=' object-contain object-left'
					/>
				</div>
				<Button
					size={"icon"}
					onClick={() => setSidebarOpen(false)}
					variant={"ghost"}
					className=' lg:hidden'
				>
					<SidebarClose size={15} />
				</Button>
				{type === "agency" ? (
					<Badge>Agency</Badge>
				) : (
					<Badge className=' bg-emerald-600'>Client</Badge>
				)}
			</Link>
			<Popover>
				<PopoverTrigger className=' w-full cursor-pointer hover:bg-slate-800 p-3 rounded-sm'>
					<div className='flex items-center justify-between w-full '>
						<div className='flex items-center gap-x-3'>
							<Compass size={20} className='' />
							<div className='flex items-start flex-col'>
								<p className=' text-sm'>{details.name}</p>
								<span className=' text-xs text-muted-foreground'>
									{details.address}
								</span>
							</div>
						</div>
						<ChevronsUpDown size={16} />
					</div>
				</PopoverTrigger>
				<PopoverContent className=' p-0'>
					<Command>
						<CommandInput placeholder='Search Accounts...' />
						<CommandList>
							{user?.role === "AGENCY_ADMIN" ||
								(user?.role === "AGENCY_OWNER" && user.Agency && (
									<CommandGroup heading='Agency'>
										<CommandItem>
											<Link
												href={`/agency/${user.Agency.id}`}
												className='flex w-full items-center gap-3'
											>
												<Image
													src={user.Agency.agencyLogo}
													width={80}
													height={80}
													alt={user.Agency.name}
												/>
												<div>
													<p className=' text-sm'>{user.Agency.name}</p>
													<p className=' text-xs text-muted-foreground'>
														{user.Agency.address}
													</p>
												</div>
											</Link>
										</CommandItem>
									</CommandGroup>
								))}

							<CommandGroup heading='Clients'>
								{clients.length > 0 ? (
									clients.map(client => (
										<CommandItem key={client.id}>
											<div className=' w-full '>
												<Link
													href={`/client/${client.id}`}
													className='flex  items-center gap-3'
												>
													<Image
														src={client.clientLogo}
														width={80}
														height={80}
														alt={client.name}
													/>
													<div className=' w-full'>
														<p className=' text-sm'>{client.name}</p>
														<p className=' text-xs text-muted-foreground'>
															{client.address}
														</p>
													</div>
												</Link>
											</div>
										</CommandItem>
									))
								) : (
									<CommandItem>
										<p className=' text-xs'>No Clients Found</p>
									</CommandItem>
								)}
								<br />
								{user?.role === "AGENCY_ADMIN" ||
									(user?.role === "AGENCY_OWNER" && (
										<Button
											onClick={() => setOpen(true)}
											variant={"default"}
											size={"sm"}
											className=' w-full'
										>
											Create New Client
										</Button>
									))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<div>
				<p className=' text-xs font-semibold text-muted-foreground'>
					MENU LINKS
				</p>
				<Separator />
				<Command>
					<CommandInput placeholder='Search...' />
					<CommandList>
						<CommandGroup className=''>
							{sidebarOptions?.map(option => {
								const Icon = icons.find(
									icon => icon.value === option.icon,
								)?.path;

								if (!Icon) return;

								return (
									<CommandItem key={option.id} className=' py-2'>
										<Link
											href={option.link}
											className='flex w-full items-center gap-2'
										>
											<Icon />
											<p className=' font-semibold'>{option.name}</p>
										</Link>
									</CommandItem>
								);
							})}
						</CommandGroup>
						<CommandEmpty>No results found.</CommandEmpty>
					</CommandList>
				</Command>
			</div>
		</motion.div>
	);
}
