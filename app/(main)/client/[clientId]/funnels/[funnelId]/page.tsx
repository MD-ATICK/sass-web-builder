import React, { Suspense } from "react";
import FunnelPageHeader from "../_components/FunnelPageHeader";
import FunnelSettings from "../_components/funnel-settings";
import Stripe from "stripe";
import { getFunnelById } from "@/lib/queries/funnel";
import FunnelSteps from "../_components/funnel-steps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function page({
	params,
}: {
	params: { funnelId: string; clientId: string };
}) {
	const { funnelId, clientId } = params;

	const funnel = await getFunnelById(funnelId);

	if (!funnel) return <div>Funnel not found</div>;
	const parsedLiveProducts: Stripe.Product[] = JSON.parse(
		funnel.liveProducts || "[]",
	);

	return (
		<div className=' space-y-4 mx-auto max-w-7xl'>
			<FunnelPageHeader clientId={clientId} funnel={funnel} />
			<Tabs defaultValue='steps'>
				<TabsList className=' w-full h-12'>
					<TabsTrigger value='steps'>Steps</TabsTrigger>
					<TabsTrigger value='settings'>Settings</TabsTrigger>
				</TabsList>
				<br />
				<TabsContent value='steps'>
					<Suspense fallback={<div>Loading...</div>}>
						<FunnelSteps
							funnel={funnel}
							funnelId={funnelId}
							clientId={clientId}
						/>
					</Suspense>
				</TabsContent>
				<TabsContent value='settings'>
					<Suspense fallback={<div>Loading...</div>}>
						<FunnelSettings
							clientId={clientId}
							liveProducts={parsedLiveProducts}
							funnelId={funnelId}
						/>
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
