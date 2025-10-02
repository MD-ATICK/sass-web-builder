"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEditor } from "@/provider/editor/editor-provider";
import React from "react";
import TabList from "./tabs";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import SettingsTab from "./tabs/components-tabs/settings-tab";
import MediaTab from "./tabs/components-tabs/media-tab";
import { FunnelPage } from "@prisma/client";
import ComponentTab from "./tabs/components-tabs/component-tab";

export default function FunnelEditorSidebar({
	clientId,
	funnelPage,
}: {
	clientId: string;
	funnelPage: FunnelPage;
}) {
	const { state } = useEditor();

	return (
		<div
			className={cn(
				" w-96 duration-300 transition-all",
				state.editor.previewMode && "w-0",
			)}
		>
			<Sheet modal={false} open={true}>
				<Tabs className=' ' defaultValue='settings'>
					<SheetContent
						showX={false}
						side='right'
						className={cn(
							"p-4 w-16 text-sm border-l h-[calc(100vh-48px)] mt-12 transition-all duration-300 overflow-clip z-50",
							state.editor.previewMode && "w-0  whitespace-nowrap  px-0",
						)}
					>
						<TabList />
					</SheetContent>
					<SheetContent
						showX={false}
						side='right'
						className={cn(
							" w-80 mr-16 text-sm border-l h-[calc(100vh-48px)]  whitespace-nowrap mt-12 transition-all duration-300 overflow-auto z-0 hide-scrollBar scroll-smooth",
							state.editor.previewMode && "w-0   px-0 mr-0",
						)}
					>
						{/* Settings */}
						<TabsContent value='Settings'>
							<SheetHeader className=' p-0 px-4'>
								<SheetTitle className=' text-sm'>Styles</SheetTitle>
								<SheetDescription className=' text-xs'>
									Custom styles ready for your funnels
								</SheetDescription>
							</SheetHeader>
							<SettingsTab />
						</TabsContent>

						{/* Component */}
						<TabsContent value='Components'>
							<ComponentTab />
						</TabsContent>

						{/* Media */}
						<TabsContent value='Media'>
							<MediaTab clientId={clientId} funnelPage={funnelPage} />
						</TabsContent>
					</SheetContent>
				</Tabs>
			</Sheet>
		</div>
	);
}
