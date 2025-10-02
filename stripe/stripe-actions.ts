"use server";

import Stripe from "stripe";
import {} from "@stripe/stripe-js";
import { prisma } from "@/lib/db";
import { Plan, Subscription } from "@prisma/client";
import { stripe } from ".";

export const createSubscription = async (
	stripeSubscription: Stripe.Subscription,
	customerId: string,
) => {
	try {
		const agency = await prisma.agency.findUnique({
			where: {
				customerId,
			},
		});

		if (!agency) {
			throw new Error("Agency not found");
		}

		const data: Pick<
			Subscription,
			| "active"
			| "agencyId"
			| "customerId"
			| "currentPeriodEndDate"
			| "priceId"
			| "subscriptionId"
			| "plan"
			| "price"
		> = {
			active: stripeSubscription.status === "active",
			agencyId: agency.id,
			customerId,
			currentPeriodEndDate: new Date(stripeSubscription.trial_end! * 1000),
			priceId: stripeSubscription.items.data[0].plan.id,
			subscriptionId: stripeSubscription.id,
			plan: stripeSubscription.items.data[0].plan.id as Plan,
			price: String(
				(stripeSubscription.items.data[0].price.unit_amount || 0) / 100,
			),
		};

		await prisma.subscription.upsert({
			where: {
				agencyId: agency.id,
			},
			create: data,
			update: data,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getConnectedAccountProducts = async (connectedAccount: string) => {
	const products = await stripe.products.list(
		{
			limit: 50,
			expand: ["data.default_price"],
		},
		{
			stripeAccount: connectedAccount,
		},
	);

	return products.data;
};
