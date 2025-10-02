import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Element, useEditor } from "@/provider/editor/editor-provider";
import { Trash2 } from "lucide-react";
import React, { MouseEvent } from "react";

export default function TextComponent({ element }: { element: Element }) {
	const { state, dispatch, liveMode } = useEditor();

	const handleDelete = (e: MouseEvent) => {
		e.stopPropagation();
		dispatch({
			type: "DELETE_ELEMENT",
			payload: { elementDetails: element },
		});
	};

	const handleClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		dispatch({
			type: "CHANGE_CLICKED_ELEMENT",
			payload: { elementDetails: element },
		});
	};

	return (
		<div
			style={element.styles}
			onClick={handleClick}
			className={cn(
				" p-1 w-full m-1 relative text-sm transition-all",
				element.id === state.editor.selectedElement.id && "border-yellow-500",
				!state.editor.liveMode && !liveMode && " border border-yellow-500",
				element.id === state.editor.selectedElement.id &&
					!state.editor.liveMode &&
					!liveMode &&
					"border border-dashed border-yellow-500",
			)}
		>
			{state.editor.selectedElement.id === element.id &&
				!state.editor.liveMode &&
				!liveMode && (
					<Badge className=' absolute top-8 left-4'>
						{state.editor.selectedElement.name}
					</Badge>
				)}
			<span
				onBlur={e => {
					dispatch({
						type: "UPDATE_ELEMENT",
						payload: {
							elementDetails: {
								...element,
								content: {
									innerText: e.target.innerText,
								},
							},
						},
					});
				}}
				contentEditable={
					!state.editor.liveMode &&
					!liveMode &&
					state.editor.selectedElement.id === element.id
				}
			>
				{!Array.isArray(element.content) && element.content.innerText}
			</span>

			{state.editor.selectedElement.id === element.id &&
				!state.editor.liveMode &&
				!liveMode && (
					<Button
						size={"icon"}
						className=' absolute rounded-none top-0 right-0'
						onClick={handleDelete}
					>
						<Trash2 size={15} className='' />
					</Button>
				)}
		</div>
	);
}
