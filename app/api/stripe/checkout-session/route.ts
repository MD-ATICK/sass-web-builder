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
				const session = await stripe.checkout.sessions.create({
					line_items: [
						{
							price: priceId,
							quantity: 1,
						},
					],
					mode: "subscription",
					customer: customerId,
					success_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
					cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
				});

				return NextResponse.json({
					sessionUrl: session.url,
				});
			}

			return NextResponse.json({ message: "what is this!" }, { status: 200 });
		} else {
			console.log("create subscription");

			const session = await stripe.checkout.sessions.create({
				line_items: [
					{
						price: priceId,
						quantity: 1,
					},
				],
				mode: "subscription",
				customer: customerId,
				success_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
				cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing`,
			});

			return NextResponse.json({
				sessionUrl: session.url,
			});
		}

		return NextResponse.json({ message: "what is this!" }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
