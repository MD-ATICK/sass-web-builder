import React from "react";
import MediaComponent from "./_components/media-component";
import { getMediaByClientId } from "@/lib/queries/queries";

export default async function page({
	params,
}: {
	params: Promise<{ clientId: string }>;
}) {
	const { clientId } = await params;

	const medias = await getMediaByClientId(clientId);

	return <MediaComponent medias={medias} clientId={clientId} />;
}
