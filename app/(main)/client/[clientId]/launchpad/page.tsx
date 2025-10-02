import UnAuthorized from "@/components/unauthorized";
import { prisma } from "@/lib/db";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import appStore from "@/assets/appstore.png";
import stripelogo from "@/assets/stripelogo.png";
import { Check } from "lucide-react";
import Link from "next/link";
import { getStripeOAuthLink } from "@/lib/helper";
import { stripe } from "@/stripe";
import { UpdateClientConnectAccountId } from "@/lib/queries/queries";

export default async function LaunchPad({
	params,
	searchParams,
}: {
	params: Promise<{ clientId: string }>;
	searchParams: Promise<{ code: string }>;
}) {
	const { clientId } = await params;
	const { code } = await searchParams;

	const client = await prisma.client.findUnique({
		where: {
			id: clientId,
		},
	});

	if (!client) return <UnAuthorized />;

	const fullFilledClient =
		client.clientLogo &&
		client.city &&
		client.companyEmail &&
		client.companyPhone &&
		client.name &&
		client.address;

	const authLink = getStripeOAuthLink("client", `launchpad___${clientId}`);
	if (code && !client.connectAccountId) {
		const response = await stripe.oauth.token({
			grant_type: "authorization_code",
			code,
		});
		await UpdateClientConnectAccountId(clientId, response.stripe_user_id!);
	}

	return (
		<div className=''>
			<div className=' bg-popover w-full h-full'>
				<div className=' p-4 space-y-4'>
					<CardHeader>
						<CardTitle>Lets Get started</CardTitle>
						<CardDescription>
							Follow the steps below to get your account setup
						</CardDescription>
					</CardHeader>
					<CardContent className=''>
						<div className=' space-y-4'>
							<div className='flex justify-between items-center p-4 rounded-md bg-background'>
								<div className=' space-y-3'>
									<Image src={appStore} height={30} width={80} alt='' />
									<p className=' text-muted-foreground text-sm'>
										{" "}
										Save the website as a shortcut on your mobile device
									</p>
								</div>
								<Button>Start</Button>
							</div>
							<div className='flex justify-between items-center p-4 rounded-md bg-background'>
								<div className=' space-y-3'>
									<Image src={stripelogo} height={30} width={80} alt='' />
									<p className=' text-muted-foreground text-sm'>
										{" "}
										Save the website as a shortcut on your mobile device
									</p>
								</div>
								{client.connectAccountId ? (
									<Check className=' text-emerald-500' />
								) : (
									<Link href={authLink}>
										<Button>Start</Button>
									</Link>
								)}
							</div>
							<div className='flex justify-between items-center p-4 rounded-md bg-background'>
								<div className=' space-y-3'>
									<Image
										src={client.clientLogo}
										height={30}
										width={80}
										alt=''
									/>
									<p className=' text-muted-foreground text-sm'>
										{" "}
										Fill in your business details
									</p>
								</div>
								{fullFilledClient ? (
									<Check className=' text-emerald-500' />
								) : (
									<Link href={`/client/${(await params).clientId}/settings`}>
										Start
									</Link>
								)}
							</div>
						</div>
					</CardContent>
				</div>
			</div>
		</div>
	);
}
