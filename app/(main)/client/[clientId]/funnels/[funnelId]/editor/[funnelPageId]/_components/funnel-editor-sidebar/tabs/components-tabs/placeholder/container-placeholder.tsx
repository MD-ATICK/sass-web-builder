"use client";
import { ButtonTypes } from "@/constants";
import { Container } from "lucide-react";
import React from "react";

export default function ContainerPlaceholder() {
	const handleDragState = (e: React.DragEvent, type: ButtonTypes) => {
		if (type === null) return;
		e.dataTransfer.setData("type", type);
	};
	return (
		<div
			draggable
			onDragStart={e => handleDragState(e, "container")}
			className=' w-full my-3 aspect-square rounded-lg space-y-2 flex flex-col justify-center items-center bg-gray-800'
		>
			<Container size={30} className=' ' />
			<h1 className=' font-semibold text-muted-foreground '>Container</h1>
		</div>
	);
}
