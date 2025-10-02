"use client";
import LoadingButton from "@/components/global/loading-button";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateFunnelPageData } from "@/lib/queries/funnel";
import { saveActivityLogNotification } from "@/lib/queries/queries";
import { cn } from "@/lib/utils";
import { DeviceTypes, useEditor } from "@/provider/editor/editor-provider";
import {
	ArrowLeft,
	Eye,
	Laptop,
	Redo2,
	Save,
	Smartphone,
	Tablet,
	Undo,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useTransition } from "react";
import { toast } from "sonner";

export default function FunnelEditorNavigation() {
	const {
		pageDetails,
		funnelId,
		clientId,
		funnelPageId,
		state,
		dispatch,
		liveMode,
	} = useEditor();

	const buttonDisable =
		pageDetails?.content === JSON.stringify(state.editor.elements)
			? true
			: false;

	const handlePreview = () => {
		dispatch({ type: "TOGGLE_PREVIEW_MODE" });
		dispatch({ type: "TOGGLE_LIVE_MODE" });
	};

	const [isPending, startTransition] = useTransition();

	const handleSave = () => {
		startTransition(async () => {
			const content = JSON.stringify(state.editor.elements);

			if (!pageDetails) return;

			await updateFunnelPageData({
				...pageDetails,
				content,
			});

			await saveActivityLogNotification({
				description: "Funnel Page Content Successfully",
				clientId,
			});

			toast.success("Funnel Page Content Successfully");
		});
	};

	useEffect(() => {
		dispatch({
			type: "SET_FUNNEL_PAGE_ID",
			payload: { funnelPageId },
		});
	}, [pageDetails, dispatch, funnelPageId]);

	return (
		<div
			className={cn(
				" h-12 w-full sticky top-0 z-50 bg-background border-b flex justify-between items-center px-4 transition-all duration-300",
				(state.editor.previewMode || liveMode) &&
					"h-0 overflow-clip whitespace-nowrap",
			)}
			onClick={e => e.stopPropagation()}
		>
			<div className='flex items-center gap-3'>
				<Link href={`/client/${clientId}/funnels/${funnelId}`}>
					<Button variant={"outline"} size={"sm"}>
						<ArrowLeft size={15} /> Back
					</Button>
				</Link>
				<div className=''>
					<h3 className='text-sm -mb-1 font-semibold leading-none tracking-tight capitalize'>
						{pageDetails?.name}{" "}
					</h3>
					<span className=' text-muted-foreground font-semibold text-xs'>
						Path : {pageDetails?.pathName}
					</span>
				</div>
			</div>

			<Tabs
				defaultValue='Desktop'
				value={state.editor.device}
				onValueChange={value =>
					dispatch({
						type: "CHANGE_DEVICE",
						payload: { device: value as DeviceTypes },
					})
				}
			>
				<TabsList className=' h-8'>
					<Tooltip>
						<TooltipTrigger>
							<TabsTrigger value='Desktop'>
								<Laptop />
							</TabsTrigger>
						</TooltipTrigger>
						<TooltipContent>Desktop</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<TabsTrigger value='Tablet'>
								<Tablet />
							</TabsTrigger>
						</TooltipTrigger>
						<TooltipContent>Tablet</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<TabsTrigger value='Mobile'>
								<Smartphone />
							</TabsTrigger>
						</TooltipTrigger>
						<TooltipContent>Mobile</TooltipContent>
					</Tooltip>
				</TabsList>
			</Tabs>

			<div className='flex items-center gap-2'>
				<Button variant={"outline"} size={"sm"} onClick={handlePreview}>
					<Eye size={15} className=' text-emerald-500' /> Preview
				</Button>
				<Button
					variant={"outline"}
					size={"sm"}
					onClick={() => dispatch({ type: "UNDO" })}
					disabled={!(state.history.currentIndex > 0)}
				>
					<Undo size={15} className=' text-emerald-500' /> Undo
				</Button>
				<Button
					variant={"outline"}
					size={"sm"}
					onClick={() => dispatch({ type: "REDO" })}
					disabled={
						!(state.history.currentIndex < state.history.history.length - 1)
					}
				>
					<Redo2 size={15} className=' text-emerald-500' /> Redo
				</Button>
				<LoadingButton
					isPending={isPending}
					disabled={isPending || buttonDisable}
					size={"sm"}
					onClick={handleSave}
				>
					<Save size={15} /> Save
				</LoadingButton>
			</div>
		</div>
	);
}
