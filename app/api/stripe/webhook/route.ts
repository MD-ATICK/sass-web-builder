import { stripe } from "@/stripe";
import { createSubscription } from "@/stripe/stripe-actions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
	try {
		const body = await req.text();
		const sig = (await headers()).get("Stripe-Signature");
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

		if (!sig || !webhookSecret) throw new Error("Missing sig or webhookSecret");

		const event: Stripe.Event = stripe.webhooks.constructEvent(
			body,
			sig,
			webhookSecret,
		);

		const subscription = event.data.object as Stripe.Subscription;

		if (
			subscription.metadata.connectAccountPayments &&
			subscription.metadata.connectAccountSubscriptions
		) {
			throw new Error(
				"Having connectAccountPayments or connectAccountSubscriptions",
			);
		}

		switch (event.type) {
			case "customer.subscription.created":
			case "customer.discount.updated":
				if (subscription.status === "active") {
					console.log("subscription", subscription);
					await createSubscription(
						subscription,
						subscription.customer as string,
					);
					NextResponse.json({ success: true }, { status: 200 });
				} else {
					throw new Error("Subscription not active");
				}
				break;
			default:
				console.log("👉🏻 Unhandled relevant event!", event.type);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		NextResponse.json({ error: (error as Error).message }, { status: 400 });
	}
}
