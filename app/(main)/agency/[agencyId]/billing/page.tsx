import { pricingPlans } from "@/constants";
import { prisma } from "@/lib/db";
import { stripe } from "@/stripe";
import React from "react";
import PricingCard from "./_components/pricing-card";
import PaymentDialog from "@/sheet/payment-model-dialog";

export default async function page({
	params,
}: {
	params: Promise<{ agencyId: string }>;
}) {
	const { agencyId } = await params;
	const productId = process.env.PRODUCT_ID;
	if (!productId) {
		throw new Error("Missing product id");
	}

	const agency = await prisma.agency.findUnique({
		where: {
			id: agencyId,
		},
		include: {
			Subscription: true,
		},
	});

	const currentSubscription = pricingPlans.find(
		p => p.priceId === agency?.Subscription?.priceId,
	);

	// const addOns = await stripe.products.list({
	// 	ids: addOnProducts.map(product => product.productId),
	// 	expand: ["data.default_price"],
	// });

	const prices = await stripe.prices.list({
		active: true,
	});

	if (!agency?.customerId) {
		return <div>Stripe Customer not created while creating agency</div>;
	}

	return (
		<div className=' p-10'>
			{agency?.customerId && (
				<PaymentDialog
					agencyId={agencyId}
					customerId={agency?.customerId}
					planExist={agency.Subscription ? true : false}
				/>
			)}
			{/* Plura Plan */}
			<div className=' space-y-4'>
				<h1 className=' font-semibold text-lg'>Plura Plan</h1>
				<div className=' grid grid-cols-3 w-full gap-10'>
					{prices.data.map(price => (
						<PricingCard
							key={price.id}
							customerId={agency?.customerId}
							price={price}
							isCurrentPlan={currentSubscription?.priceId === price.id}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
