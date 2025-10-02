"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditor } from "@/provider/editor/editor-provider";
import { Eye } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./components/recursive";

export default function FunnelEditor() {
	const { state, dispatch, liveMode } = useEditor();

	const handlePreview = () => {
		dispatch({ type: "TOGGLE_PREVIEW_MODE" });
		dispatch({ type: "TOGGLE_LIVE_MODE" });
	};

	useEffect(() => {
		if (liveMode) {
			console.log({ liveMode });
			dispatch({ type: "TOGGLE_LIVE_MODE" });
			dispatch({ type: "TOGGLE_PREVIEW_MODE" });
		}
	}, [liveMode, dispatch]);

	return (
		<div
			className={cn(
				state.editor.device === "Tablet" && "!w-[850px]",
				state.editor.device === "Mobile" && "!w-[420px]",
				state.editor.device === "Desktop" && " flex-1 w-full",
				" mx-auto border relative",
			)}
		>
			{(state.editor.liveMode || state.editor.previewMode) && !liveMode && (
				<Button
					variant={"outline"}
					size={"sm"}
					className=' fixed z-50 top-2 right-2'
					onClick={handlePreview}
				>
					<Eye size={15} className=' text-emerald-500' /> Preview
				</Button>
			)}
			{Array.isArray(state.editor.elements) &&
				state.editor.elements.map(element => (
					<Recursive key={element.id} element={element} />
				))}
		</div>
	);
}
