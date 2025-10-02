import { getFunnelBySubdomain } from "@/lib/queries/funnel";
import EditorProvider from "@/provider/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";
import FunnelEditor from "../(main)/client/[clientId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";

export default async function page({
	params,
}: {
	params: Promise<{ domain: string }>;
}) {
	const paramsData = await params;
	const domain = paramsData.domain.slice(0, -1);

	const funnel = await getFunnelBySubdomain(domain);
	if (!funnel) notFound();

	const homePage = funnel.FunnelPages.find(page => page.pathName === "/");
	if (!homePage) notFound();

	return (
		<EditorProvider
			clientId={funnel.clientId}
			funnelId={funnel.id}
			funnelPageId={homePage.id}
			pageDetails={homePage}
			liveMode={true}
		>
			<FunnelEditor />
		</EditorProvider>
	);
}
