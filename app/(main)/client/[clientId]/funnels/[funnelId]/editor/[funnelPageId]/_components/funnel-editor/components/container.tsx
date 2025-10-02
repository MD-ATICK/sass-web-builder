import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonTypes, defaultStyles } from "@/constants";
import { cn } from "@/lib/utils";
import { Element, useEditor } from "@/provider/editor/editor-provider";
import { Trash2 } from "lucide-react";
import React, { DragEvent, MouseEvent } from "react";
import { v4 } from "uuid";
import Recursive from "./recursive";

export default function Container({ element }: { element: Element }) {
	const { state, dispatch, liveMode } = useEditor();

	const editable =
		state.editor.selectedElement.id === element.id &&
		!state.editor.liveMode &&
		!liveMode;

	const selectElementType = state.editor.selectedElement.type;

	const handleDrop = (e: DragEvent) => {
		e.stopPropagation();
		const type = e.dataTransfer.getData("type") as ButtonTypes;

		switch (type) {
			case "text":
				dispatch({
					type: "ADD_ELEMENT",
					payload: {
						containerId: element.id,
						elementDetails: {
							id: v4(),
							name: "Text",
							content: {
								innerText: "Text Element",
							},
							styles: {
								...defaultStyles,
							},
							type: "text",
						},
					},
				});
				break;

			case "container":
				dispatch({
					type: "ADD_ELEMENT",
					payload: {
						containerId: element.id,
						elementDetails: {
							id: v4(),
							name: "Container",
							content: [],
							styles: {
								...defaultStyles,
							},
							type: "container",
						},
					},
				});
				break;
			case "paymentForm":
				dispatch({
					type: "ADD_ELEMENT",
					payload: {
						containerId: element.id,
						elementDetails: {
							id: v4(),
							name: "Payment Form",
							content: [],
							styles: {
								...defaultStyles,
							},
							type: "paymentForm",
						},
					},
				});
		}
	};

	const handleDragStart = (e: DragEvent) => {
		e.stopPropagation();
		e.dataTransfer.setData("type", element.type as string);
	};

	const handleClickElement = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch({
			type: "CHANGE_CLICKED_ELEMENT",
			payload: { elementDetails: element },
		});
	};

	const handleDeleteElement = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch({
			type: "DELETE_ELEMENT",
			payload: { elementDetails: element },
		});
	};

	return (
		<div
			className={cn(
				" relative p-6 wf transition-all group ",
				(element.type === "container" || element.type === "2Col") &&
					"w-full max-w-full",
				element.type === "2Col" && "flex flex-col md:flex-row",
				element.type === "container" && "h-fit",
				element.type === "_body" && "h-full ",
				!state.editor.liveMode &&
					!liveMode &&
					element.type === "container" &&
					"border-[1px] border-solid border-yellow-500",
				!state.editor.liveMode &&
					!liveMode &&
					element.type === "_body" &&
					"border-[4px] border-solid border-yellow-500",
				editable && !state.editor.liveMode && " border-dashed ",
				editable && selectElementType !== "_body" && "border-yellow-500",
				editable && selectElementType === "_body" && "border-yellow-500",
			)}
			style={element.styles}
			onDrop={handleDrop}
			onDragOver={e => e.preventDefault()}
			onDragStart={handleDragStart}
			onClick={handleClickElement}
		>
			{editable && (
				<Badge className=' absolute top-1 left-1'>{element.name}</Badge>
			)}

			{Array.isArray(element.content) &&
				element.content.map(element => (
					<Recursive key={element.id} element={element} />
				))}

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
