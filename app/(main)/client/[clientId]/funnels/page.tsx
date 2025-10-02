import { getFunnelsByClientId } from "@/lib/queries/funnel";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import CreateFunnelDialog from "@/sheet/create-funnel-dialog";
import ActionButtons from "./_components/action-buttons";
import Link from "next/link";
import { Link2 } from "lucide-react";
export default async function page({
	params,
}: {
	params: Promise<{ clientId: string }>;
}) {
	const { clientId } = await params;

	const funnels = await getFunnelsByClientId(clientId);

	return (
		<div className=' bg-gray-900'>
			<div className='flex items-center justify-between  p-4 bg-background'>
				<h2>Funnels</h2>
				<CreateFunnelDialog clientId={clientId} />
			</div>
			<div className=' p-4'>
				<Table className=' bg-background p-2 rounded-lg'>
					<TableHeader>
						<TableRow>
							<TableCell>Favicon</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>SubDomain Name</TableCell>
							<TableCell>Pages</TableCell>
							<TableCell>Last Updated</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{funnels.map(funnel => (
							<TableRow key={funnel.id}>
								<TableCell>
									{funnel.favicon ? (
										<Image
											src={funnel.favicon}
											width={150}
											height={40}
											alt={funnel.name}
										/>
									) : (
										"No Favicon"
									)}
								</TableCell>
								<TableCell>
									<Link
										href={`/client/${clientId}/funnels/${funnel.id}`}
										className='flex items-center hover:underline gap-2'
									>
										<Link2 size={15} />
										{funnel.name}
									</Link>
								</TableCell>
								<TableCell>
									{funnel.subDomainName || "No SubDomain Name"}
								</TableCell>
								<TableCell>{funnel.FunnelPages.length}</TableCell>
								<TableCell>
									{format(new Date(funnel.updatedAt), "PP")}
								</TableCell>
								<TableCell>
									<Badge variant={"outline"}>
										{" "}
										{funnel.published ? "Published" : "Draft"}
									</Badge>
								</TableCell>
								<TableCell>
									<ActionButtons funnelId={funnel.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
