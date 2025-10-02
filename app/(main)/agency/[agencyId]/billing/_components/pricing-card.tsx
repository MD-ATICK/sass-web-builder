"use client";
import LoadingButton from "@/components/global/loading-button";
import { pricingPlans } from "@/constants";
import { FormatValue } from "@/lib/helper";
import { PricesList } from "@/types";
import { Check } from "lucide-react";
import React from "react";

type Props = {
	price: PricesList["data"][0];
	isCurrentPlan: boolean;
	customerId: string;
};

export default function PricingCard({
	price,
	isCurrentPlan,
	customerId,
}: Props) {
	// const features = pricingPlans.find(p => p.priceId === price.id)?.features;
	const features = pricingPlans[0].features;
	const [isPending, startTransition] = React.useTransition();

	const handleClick = () => {
		startTransition(async () => {
			const response = await fetch("/api/stripe/checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ priceId: price.id, customerId }),
			});
			const { sessionUrl } = await response.json();
			if (sessionUrl) window.location.href = sessionUrl;
		});
	};

	return (
		<div className=' space-y-4 bg-gray-900 p-4 py-6 rounded-md'>
			<div>
				<h1 className=' font-semibold text-xl'>{price.nickname}</h1>
				<p className=' text-sm text-muted-foreground'>
					{price.product.toString()}
				</p>
				<p className=' text-sm text-muted-foreground'>{price.id}</p>
			</div>

			<div className='flex items-center'>
				<p className=' text-3xl font-bold'>
					{FormatValue((price.unit_amount || 0) / 100)}
				</p>
				<span className=' text-sm text-muted-foreground'>
					/{price.recurring?.interval}
				</span>
			</div>

			<div className=' space-y-2 text-muted-foreground'>
				{features?.map((feature, index) => (
					<div className=' text-sm flex items-center gap-2' key={index}>
						<Check size={15} />
						<p>{feature}</p>
					</div>
				))}
			</div>
			<br />
			<div className=' p-3 space-y-8 border rounded-md'>
				<div>
					<h2 className=' font-semibold'>Plan Details</h2>
					<p className=' text-sm text-muted-foreground'>
						Lorem ipsum dolor sit amet, consectetur dolores ab odio maxime
						tempora quisquam dolorum dicta vitae quo quos!
					</p>
				</div>
				<LoadingButton
					isPending={isPending}
					disabled={isPending}
					className=' w-full'
					onClick={handleClick}
				>
					{isCurrentPlan ? "Manage Plan" : "Get Started"}
				</LoadingButton>
			</div>
		</div>
	);
}
