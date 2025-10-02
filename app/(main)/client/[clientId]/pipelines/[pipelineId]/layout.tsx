import React from "react";
import TopBar from "../_components/top-bar";
import PipelineCreateDialog from "@/sheet/create-pipeline-dialog";
import { getPipelines } from "@/lib/queries/pipeline";

export default async function layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ clientId: string; pipelineId: string }>;
}) {
	const { clientId } = await params;

	const pipelines = await getPipelines(clientId);

	return (
		<div>
			<PipelineCreateDialog clientId={clientId} />
			<TopBar pipelines={pipelines} />
			{children}
		</div>
	);
}
