import { prisma } from "@/lib/db";
import { stripe } from "@/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { priceId, customerId } = await req.json();
		if (!priceId || !customerId)
			return NextResponse.json(
				{ error: "Missing priceId or customerId" },
				{ status: 400 },
			);

		const isSubscriptionExist = await prisma.agency.findUnique({
			where: {
				customerId,
			},
			include: {
				Subscription: true,
			},
		});

		if (isSubscriptionExist?.Subscription) {
			if (
				isSubscriptionExist.Subscription?.subscriptionId &&
				isSubscriptionExist.Subscription?.active
			) {
				const currentSubscription = await stripe.subscriptions.retrieve(
					isSubscriptionExist.Subscription.subscriptionId,
				);

				const subscription = await stripe.subscriptions.update(
					isSubscriptionExist.Subscription.subscriptionId,
					{
						items: [
							{
								id: currentSubscription.items.data[0].id,
								deleted: true,
							},
							{
								price: priceId,
							},
						],
						expand: ["latest_invoice.payment_intent"],
					},
				);

				const latestPaymentIntent = await stripe.paymentIntents.list({
					limit: 1,
					customer: customerId,
				});

				return NextResponse.json({
					subscriptionId: subscription.id,
					clientSecret: latestPaymentIntent.data[0].client_secret,
				});
			}
		} else {
			const subscription = await stripe.subscriptions.create({
				customer: customerId,
				items: [
					{
						price: priceId,
					},
				],
				payment_behavior: "default_incomplete",
				payment_settings: {
					save_default_payment_method: "on_subscription",
				},
				expand: ["latest_invoice.payment_intent"],
			});

			const latestPaymentIntent = await stripe.paymentIntents.list({
				limit: 1,
				customer: customerId,
			});

			return NextResponse.json({
				subscriptionId: subscription.id,
				clientSecret: latestPaymentIntent.data[0].client_secret,
			});
		}

		// return NextResponse.json({ message: "what is this!" }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
