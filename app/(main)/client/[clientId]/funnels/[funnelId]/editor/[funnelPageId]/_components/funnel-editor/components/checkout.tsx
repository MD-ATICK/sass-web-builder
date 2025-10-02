"use client";
import { Button } from "@/components/ui/button";
import { getFunnelById } from "@/lib/queries/funnel";
import { getClientById } from "@/lib/queries/queries";
import { cn } from "@/lib/utils";
import { Element, useEditor } from "@/provider/editor/editor-provider";
import { getStripe } from "@/stripe/stripe-client";
import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { Loader, Trash2 } from "lucide-react";
import React, { MouseEvent, useEffect, useState, useTransition } from "react";

export default function Checkout({ element }: { element: Element }) {
	const { clientId, funnelId, dispatch, state, liveMode } = useEditor();

	const [clientSecret, setClientSecret] = useState("");
	const [connectAccountId, setConnectAccountId] = useState("");
	const [error, setError] = useState("");

	const [isPending, startTransition] = useTransition();

	const editable =
		state.editor.selectedElement.id === element.id && !state.editor.liveMode;

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch({
			type: "CHANGE_CLICKED_ELEMENT",
			payload: {
				elementDetails: element,
			},
		});
	};

	const handleDeleteElement = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch({
			type: "DELETE_ELEMENT",
			payload: { elementDetails: element },
		});
	};

	useEffect(() => {
		const fetchData = () => {
			startTransition(async () => {
				if (!clientId) {
					setError("ClientId Not found");
					return;
				}
				const client = await getClientById(clientId as string);
				if (!client?.connectAccountId) {
					setError("Connect Account Id not found");
					return;
				}
				setConnectAccountId(client.connectAccountId);
				const funnel = await getFunnelById(funnelId);
				if (!funnel) {
					setError("Funnel Not found");
					return;
				}
				const liveProducts = funnel?.liveProducts;

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_URL}/api/stripe/checkout-session-client-secret`,
					{
						method: "POST",
						body: JSON.stringify({
							connectAccountId: client.connectAccountId,
							liveProducts,
						}),
					},
				);

				const data: { error?: string; clientSecret?: string } =
					await response.json();
				if (data.error) {
					setError(data.error);
				}
				if (data.clientSecret) {
					setClientSecret(data.clientSecret);
				}
			});
		};

		fetchData();
	}, [clientId, funnelId]);

	return (
		<div
			style={element.styles}
			onClick={handleClick}
			className={cn(
				" p-4 w-full m-1 relative text-sm transition-all",
				element.id === state.editor.selectedElement.id && "border-yellow-500",
				!state.editor.liveMode && !liveMode && " border border-yellow-500",
				element.id === state.editor.selectedElement.id &&
					!state.editor.liveMode &&
					!liveMode &&
					"border border-dashed border-yellow-500",
			)}
		>
			<p className=' pb-3 font-semibold text-center'>Stripe Payment</p>
			<p className=' text-sm text-red-500'>{error}</p>
			{!isPending && connectAccountId && clientSecret && (
				<div className=' bg-white py-6 relative'>
					<EmbeddedCheckoutProvider
						stripe={getStripe(connectAccountId)}
						options={{ clientSecret }}
					>
						<EmbeddedCheckout />
					</EmbeddedCheckoutProvider>
				</div>
			)}
			{isPending && (
				<div className=' bg-background/20 min-h-40 flex justify-center items-center w-full  gap-2'>
					<Loader className=' text-emerald-500 animate-spin' /> Stripe
					Loading...
				</div>
			)}
			{editable && (
				<Button
					size={"icon"}
					className=' absolute rounded-none top-0 right-0'
					onClick={handleDeleteElement}
				>
					<Trash2 size={15} className='' />
				</Button>
			)}
		</div>
	);
}
