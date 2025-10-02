import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
export const getStripe = (connectedAccount?: string) => {
	if (!stripePromise) {
		stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!, {
			stripeAccount: connectedAccount,
		});
	}
	return stripePromise;
};
