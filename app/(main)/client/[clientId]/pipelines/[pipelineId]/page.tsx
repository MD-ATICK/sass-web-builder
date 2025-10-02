import { getLanesByPipelineId, getPipelineById } from "@/lib/queries/pipeline";
import PipelineView from "./_components/pipeline-view";

export default async function page({
	params,
}: {
	params: Promise<{ pipelineId: string; clientId: string }>;
}) {
	const { pipelineId, clientId } = await params;

	if (!pipelineId || !clientId) return;

	const pipeline = await getPipelineById(pipelineId);

	if (!pipeline) return;

	const lanes = await getLanesByPipelineId(pipelineId);

	return <PipelineView pipeline={pipeline} lanes={lanes} clientId={clientId} />;
}
