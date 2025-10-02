import { pricingPlans } from "@/constants";
import React from "react";
import { Button } from "./ui/button";

export default function Pricing() {
	return (
		<div className='flex items-center gap-10 p-6 flex-wrap'>
			{pricingPlans.map((item, index) => (
				<div
					key={index}
					className=' space-y-3 p-4 w-full md:w-[300px] bg-slate-900'
				>
					<h1 className=' font-bold text-2xl'>{item.name}</h1>
					<h2>{item.price}$</h2>
					<ul>
						{item.features.map((feature, index) => (
							<li key={index}>{feature}</li>
						))}
					</ul>
					<Button>Buy Now</Button>
				</div>
			))}
		</div>
	);
}
