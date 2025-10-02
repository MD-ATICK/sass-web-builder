export const getFormData = <T>(form: HTMLFormElement): T =>
	Object.fromEntries(new FormData(form)) as T;

export const FormatValue = (value: number) =>
	new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
		value,
	);

export function getStripeOAuthLink(
	accountType: "agency" | "client",
	state: string,
) {
	return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}/${accountType}&state=${state}`;
}
