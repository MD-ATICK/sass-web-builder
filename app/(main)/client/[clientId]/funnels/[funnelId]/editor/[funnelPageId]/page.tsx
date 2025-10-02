import { prisma } from "@/lib/db";
import EditorProvider from "@/provider/editor/editor-provider";
import { redirect } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import FunnelEditor from "./_components/funnel-editor";

type Props = {
	params: Promise<{ funnelPageId: string; funnelId: string; clientId: string }>;
};
export default async function page({ params }: Props) {
	const { funnelPageId, funnelId, clientId } = await params;

	const funnelPage = await prisma.funnelPage.findUnique({
		where: { id: funnelPageId },
	});

	if (!funnelPage) {
		return redirect(`/client/${clientId}/funnels/${funnelId}`);
	}

	return (
		<div className=''>
			<EditorProvider
				funnelId={funnelId}
				clientId={clientId}
				pageDetails={funnelPage}
				funnelPageId={funnelPageId}
			>
				<FunnelEditorNavigation />
				<div className='flex items-start h-full'>
					<FunnelEditor />
					<FunnelEditorSidebar funnelPage={funnelPage} clientId={clientId} />
				</div>
			</EditorProvider>
		</div>
	);
}
