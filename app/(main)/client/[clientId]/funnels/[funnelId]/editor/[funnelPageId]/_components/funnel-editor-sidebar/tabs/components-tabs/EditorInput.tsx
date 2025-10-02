"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditor } from "@/provider/editor/editor-provider";
import React from "react";

export default function EditorInput({
	target,
	name,
	defaultValue,
	px,
}: {
	target: string;
	name?: string;
	defaultValue?: string | number;
	px?: boolean;
}) {
	const { state, dispatch } = useEditor();
	const handleStyleChange = (target: string, value: string) => {
		dispatch({
			type: "UPDATE_ELEMENT",
			payload: {
				elementDetails: {
					...state.editor.selectedElement,
					styles: {
						...state.editor.selectedElement.styles,
						[target]: value,
					},
				},
			},
		});
	};
	return (
		<div className=' space-y-2 w-full'>
			<Label className=' text-xs text-muted-foreground capitalize'>
				{name || target}
			</Label>
			<Input
				id={target}
				type={px ? "number" : "text"}
				className=' w-full'
				onChange={e =>
					handleStyleChange(
						e.target.id,
						px ? `${e.target.value}px` : e.target.value,
					)
				}
				defaultValue={defaultValue}
			/>
		</div>
	);
}
