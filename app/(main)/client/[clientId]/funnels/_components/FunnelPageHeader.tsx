import { Button } from "@/components/ui/button";
import CreateFunnelDialog from "@/sheet/create-funnel-dialog";
import { Funnel } from "@prisma/client";
import { MoveLeft, Store } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function FunnelPageHeader({
	clientId,
	funnel,
}: {
	clientId: string;
	funnel: Funnel;
}) {
	return (
		<div className=' p-4'>
			<Link href={`/client/${clientId}/funnels`}>
				<Button size={"sm"} variant={"outline"}>
					<MoveLeft size={15} /> Back
				</Button>
			</Link>
			<div className=' py-4 flex items-center justify-between'>
				<h2 className=' font-semibold text-lg flex items-center gap-2'>
					{" "}
					<Store size={20} /> {funnel.name}
				</h2>
				<CreateFunnelDialog clientId={clientId} funnel={funnel} />
			</div>
		</div>
	);
}
