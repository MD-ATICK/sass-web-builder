"use client";
import { ButtonTypes } from "@/constants";
import React from "react";
import stripeImage from "@/assets/stripelogo.png";
import Image from "next/image";

export default function CheckoutPlaceholder() {
	const handleDragState = (e: React.DragEvent, type: ButtonTypes) => {
		if (type === null) return;
		e.dataTransfer.setData("type", type);
	};
	return (
		<div
			draggable
			onDragStart={e => handleDragState(e, "paymentForm")}
			className=' w-full my-3 aspect-square rounded-lg space-y-2 flex flex-col justify-center items-center bg-gray-800'
		>
			<Image src={stripeImage} width={80} height={80} alt='stripe' />
			<h1 className=' font-semibold text-muted-foreground '>Payment</h1>
		</div>
	);
}
