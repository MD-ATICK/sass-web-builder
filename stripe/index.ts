import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
	throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(secretKey, {
	apiVersion: "2025-08-27.basil",
	appInfo: {
		name: "Plura",
		version: "1.0.0",
	},
});
