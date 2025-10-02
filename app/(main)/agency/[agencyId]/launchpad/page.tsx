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
import { prisma } from "@/lib/db";
import { Check } from "lucide-react";
import Link from "next/link";
import { getStripeOAuthLink } from "@/lib/helper";
import { stripe } from "@/stripe";
import { UpdateAgencyConnectAccountId } from "@/lib/queries/queries";

export default async function page({
	params,
	searchParams,
}: {
	params: { agencyId: string };
	searchParams: { code: string };
}) {
	const agency = await prisma.agency.findUnique({
		where: {
			id: params.agencyId,
		},
	});

	if (!agency) return <p>Agency Not found</p>;

	const fullFilledAgency =
		agency.address &&
		agency.agencyLogo &&
		agency.city &&
		agency.companyEmail &&
		agency.companyPhone &&
		agency.name;

	const authLink = getStripeOAuthLink("agency", `launchpad___${agency.id}`);

	if (searchParams.code && !agency.connectAccountId) {
		const response = await stripe.oauth.token({
			grant_type: "authorization_code",
			code: searchParams.code,
		});

		if (response.stripe_user_id) {
			await UpdateAgencyConnectAccountId(agency.id, response.stripe_user_id);
		}
	}

	return (
		<div className=''>
			<div className=' bg-popover w-full h-full'>
				<div className=' space-y-4 p-4'>
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
								{agency.connectAccountId ? (
									<div className=' font-bold text-lg'>
										<Check className=' text-emerald-500' />
									</div>
								) : (
									<Link href={authLink}>
										<Button>Start</Button>
									</Link>
								)}
							</div>
							<div className='flex justify-between items-center p-4 rounded-md bg-background'>
								<div className=' space-y-3'>
									<Image
										src={agency.agencyLogo}
										height={30}
										width={80}
										alt=''
									/>
									<p className=' text-muted-foreground text-sm'>
										{" "}
										Fill in your business details
									</p>
								</div>
								{fullFilledAgency ? (
									<Check className=' text-emerald-500' />
								) : (
									<Link href={`/agency/${params.agencyId}/settings`}>
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
