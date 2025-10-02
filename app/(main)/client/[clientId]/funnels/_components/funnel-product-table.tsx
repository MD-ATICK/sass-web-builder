"use client";
import LoadingButton from "@/components/global/loading-button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { FormatValue } from "@/lib/helper";
import { addToLiveProduct } from "@/lib/queries/funnel";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Stripe from "stripe";

export default function FunnelProductTable({
	products,
	liveProducts,
	funnelId,
}: {
	products: Stripe.Product[];
	liveProducts: Stripe.Product[];
	funnelId: string;
}) {
	const router = useRouter();
	const [isPending, setIsPending] = useState("");

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Image</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Recurring</TableHead>
						<TableHead>Updated</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map(product => (
						<TableRow key={product.id}>
							<TableCell>
								<Image
									height={50}
									width={100}
									src={product.images[0]}
									className=' rounded-md'
									alt={product.name}
								/>
							</TableCell>
							<TableCell>{product.name}</TableCell>
							<TableCell className=' font-bold text-lg'>
								{FormatValue(
									((product.default_price as Stripe.Price).unit_amount || 0) /
										100,
								)}
							</TableCell>
							<TableCell>
								<Badge className='  capitalize text-sm font-medium'>
									{(product.default_price as Stripe.Price).recurring
										?.interval || "One Time"}
								</Badge>
							</TableCell>
							<TableCell>
								{format(new Date(product.updated), "PP HH:mm")}
							</TableCell>
							<TableCell>
								{liveProducts.find(p => p.id === product.id) ? (
									<p className=' flex items-center gap-2 '>
										<Eye size={15} className=' text-emerald-400' /> Live
									</p>
								) : (
									<LoadingButton
										isPending={isPending === product.id}
										disabled={isPending === product.id}
										onClick={async () => {
											setIsPending(product.id);
											await addToLiveProduct(
												JSON.stringify([...liveProducts, product]),
												funnelId,
											);
											router.refresh();
											setIsPending("");
										}}
										size={"sm"}
									>
										{" "}
										Make Live
									</LoadingButton>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
