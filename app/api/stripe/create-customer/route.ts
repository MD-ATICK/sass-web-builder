import { stripe } from "@/stripe";
import { stripeCustomerType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { name, email, shipping, address }: stripeCustomerType =
		await req.json();

	if (!name || !email || !shipping || !address)
		return NextResponse.json(
			{ error: "Missing name or email or shipping or address" },
			{ status: 400 },
		);

	const customer = await stripe.customers.create({
		name,
		email,
		shipping,
		address,
	});

	return NextResponse.json({ customerId: customer.id }, { status: 200 });
}
