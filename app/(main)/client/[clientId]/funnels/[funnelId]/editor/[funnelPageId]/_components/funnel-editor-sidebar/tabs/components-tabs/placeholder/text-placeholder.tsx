"use client";
import { ButtonTypes } from "@/constants";
import { TextIcon } from "lucide-react";
import React from "react";

export default function TextPlaceholder() {
	const handleDragState = (e: React.DragEvent, type: ButtonTypes) => {
		if (type === null) return;
		e.dataTransfer.setData("type", type);
	};
	return (
		<div
			draggable
			onDragStart={e => handleDragState(e, "text")}
			className=' w-full my-3 aspect-square rounded-lg space-y-2 flex flex-col justify-center items-center bg-gray-800'
		>
			<TextIcon size={30} className=' ' />
			<h1 className=' font-semibold text-muted-foreground'>Text</h1>
		</div>
	);
}
