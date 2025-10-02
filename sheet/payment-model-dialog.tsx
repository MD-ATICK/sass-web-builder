"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { usePaymentModelOpen } from "./hooks/use-payment-model-open";
import { FormatValue } from "@/lib/helper";

export default function PaymentDialog({
	customerId,
}: {
	agencyId: string;
	customerId: string;
	planExist?: boolean;
}) {
	const { open, setOpen, plan, setPlanNull } = usePaymentModelOpen();
	const [clientSecret, setClientSecret] = useState("");
	console.log(clientSecret);
	useEffect(() => {
		const fetchClientSecret = async () => {
			const response = await fetch("/api/stripe/checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ priceId: plan?.id, customerId }),
			});
			const data = await response.json();
			setClientSecret(data.clientSecret);
			console.log(data);
		};

		if (plan?.id && customerId) {
			fetchClientSecret();
		}
	}, [plan?.id, customerId]);

	return (
		<Dialog
			open={open}
			onOpenChange={open => {
				if (open) {
					setOpen(open);
				} else {
					setOpen(open);
					setClientSecret("");
					setPlanNull();
				}
			}}
		>
			<DialogContent className=' min-w-[1100px]'>
				<DialogHeader>
					<DialogTitle>
						{plan?.nickname} - {FormatValue((plan?.unit_amount || 0) / 100)}{" "}
						{plan?.currency}
					</DialogTitle>
					<DialogDescription>
						Fill in the form below to create a new contact. You can update the
						contact later if needed.
					</DialogDescription>
				</DialogHeader>

				{/* <form onSubmit={handleSubmit} className=' p-4 space-y-4'>
					<LoadingButton
						isPending={isPending}
						disabled={isPending}
						type='submit'
						className=' w-full'
					>
						<Lock size={15} /> Payment
					</LoadingButton>
				</form> */}
			</DialogContent>
		</Dialog>
	);
}
