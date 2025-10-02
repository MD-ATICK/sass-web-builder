import React from "react";
import MenuOptions from "./menu-options";
import ClientDetails from "./forms/client-details";
import TopBar from "@/app/(main)/agency/[agencyId]/_components/top-bar";
import UserDetailsSheet from "@/sheet/user-details-sheet";
import { getUserDetails } from "@/lib/queries/queries";

export default async function LayoutDesign({
	id,
	type,
	children,
}: {
	id: string;
	type: "agency" | "client";
	children: React.ReactNode;
}) {
	// subaccount also means Client
	const user = await getUserDetails();

	if (!user) return <div>User Not found</div>;

	if (!user.Agency) return <div>Agency Not found</div>;

	const details =
		type == "agency"
			? user.Agency
			: user.Agency.clients.find(client => client.id == id);

	if (!details) return <div>Details Not found</div>;

	const isWhiteLabelAgency = user.Agency.whiteLabel;

	let sidebarLogo = user.Agency.agencyLogo || "@/assets/plura-logo.svg";

	if (!isWhiteLabelAgency) {
		if (type === "client") {
			sidebarLogo =
				user.Agency.clients.find(client => client.id == id)?.clientLogo ||
				user.Agency.agencyLogo;
		}
	}

	const sidebarOptions =
		type === "agency"
			? user.Agency.SidebarOption || []
			: user.Agency.clients.find(client => client.id == id)?.SidebarOption ||
			  [];

	const clients = user.Agency.clients.filter(client =>
		user.Permissions.find(
			permission => permission.clientId == client.id && permission.access,
		),
	);

	return (
		<div className='flex '>
			<UserDetailsSheet clients={clients} />
			<ClientDetails agencyDetails={user.Agency} userName={user.name} />
			<MenuOptions
				defaultOpen
				details={details}
				sidebarLogo={sidebarLogo}
				sidebarOptions={sidebarOptions}
				clients={clients}
				user={user}
			/>

			<div className=' w-full'>
				<TopBar notifications={user.Agency.Notification} role={user.role} />
				{children}
			</div>
		</div>
	);
}
