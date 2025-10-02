import { stripe } from "@/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
	try {
		const {
			connectAccountId,
			liveProducts,
		}: { connectAccountId: string; liveProducts: string } = await req.json();

		const origin = req.headers.get("origin");
		const parsedLiveProducts = JSON.parse(liveProducts) as Stripe.Product[];

		const hasSubscription = parsedLiveProducts.find(
			p => (p.default_price as Stripe.Price).recurring,
		);

		const response = await stripe.checkout.sessions.create(
			{
				line_items: parsedLiveProducts.map(p => ({
					price: (p.default_price as Stripe.Price).id,
					quantity: 1,
				})),
				mode: hasSubscription ? "subscription" : "payment",
				ui_mode: "embedded",
				redirect_on_completion: "never",
				...(hasSubscription && {
					subscription_data: {
						metadata: { connectAccountSubscriptions: "true" },
						application_fee_percent:
							+process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PERCENT!,
					},
				}),
				...(!hasSubscription && {
					payment_intent_data: {
						metadata: { connectAccountPayments: "true" },
						application_fee_amount:
							+process.env.NEXT_PUBLIC_STRIPE_ONETIME_FEE! * 100,
					},
				}),
			},
			{
				stripeAccount: connectAccountId,
			},
		);

		if (!response.client_secret) {
			return NextResponse.json(
				{ error: "Client Secret Not Found!" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ clientSecret: response.client_secret },
			{
				status: 200,
				headers: {
					"Access-Control-Allow-Origin": origin || "*",
					"Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
				},
			},
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: "Something went wrong!" },
			{ status: 400 },
		);
	}
}
