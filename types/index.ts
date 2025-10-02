import Stripe from "stripe";

type Address = {
	line1: string;
	city: string;
	country: string;
	state: string;
	postal_code: string;
};

export type stripeCustomerType = {
	name: string;
	email: string;
	shipping: {
		name: string;
		address: Address;
	};
	address: Address;
};

export type PricesList = Stripe.ApiList<Stripe.Price>;
