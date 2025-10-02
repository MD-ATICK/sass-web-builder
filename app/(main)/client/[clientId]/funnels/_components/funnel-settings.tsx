import { prisma } from "@/lib/db";
import { getConnectedAccountProducts } from "@/stripe/stripe-actions";
import React from "react";
import FunnelProductTable from "./funnel-product-table";
import Stripe from "stripe";

export default async function FunnelSettings({
	clientId,
	liveProducts,
	funnelId,
}: {
	clientId: string;
	liveProducts: Stripe.Product[];
	funnelId: string;
}) {
	const client = await prisma.client.findUnique({ where: { id: clientId } });

	if (!client) return <div>Client not found</div>;

	if (!client.connectAccountId)
		return <div>Connect your Stripe account to use this feature</div>;

	const stripeProducts = await getConnectedAccountProducts(
		client.connectAccountId,
	);

	return (
		<div className=' px-6 min-h-screen'>
			<FunnelProductTable
				products={stripeProducts}
				liveProducts={liveProducts}
				funnelId={funnelId}
			/>
		</div>
	);
}
