"use client";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEditor } from "@/provider/editor/editor-provider";
import React from "react";

export default function EditorSlider({
	target,
	name,
	defaultValue,
	defaultPercent,
}: {
	target: string;
	name?: string;
	defaultValue?: number[];
	defaultPercent: number;
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
		<div className=' space-y-3'>
			<div className='flex items-center justify-between'>
				<Label className=' text-xs'>{name || target}</Label>
				<p>
					{state.editor.selectedElement.styles.opacity || `${defaultPercent}%`}
				</p>
			</div>
			<div className=' px-1'>
				<Slider
					id={target}
					onValueChange={e => handleStyleChange(target, `${e[0].toString()}%`)}
					defaultValue={defaultValue}
				/>
			</div>
		</div>
	);
}
