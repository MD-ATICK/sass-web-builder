import FunnelEditor from "@/app/(main)/client/[clientId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getFunnelBySubdomain } from "@/lib/queries/funnel";
import EditorProvider from "@/provider/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
	params,
}: {
	params: Promise<{ domain: string; path: string }>;
}) {
	const { domain, path } = await params;

	const funnel = await getFunnelBySubdomain(domain.slice(0, -1));

	if (!funnel) notFound();

	const funnelPage = funnel.FunnelPages.find(page => page.pathName === path);
	if (!funnelPage) notFound();

	return (
		<EditorProvider
			clientId={funnel.clientId}
			funnelId={funnel.id}
			funnelPageId={funnelPage.id}
			pageDetails={funnelPage}
			liveMode={true}
		>
			<FunnelEditor />
		</EditorProvider>
	);
}
