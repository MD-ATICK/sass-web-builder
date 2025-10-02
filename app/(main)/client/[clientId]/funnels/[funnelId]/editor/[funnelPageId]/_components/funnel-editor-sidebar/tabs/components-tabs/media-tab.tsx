import MediaComponent from "@/app/(main)/client/[clientId]/media/_components/media-component";
import { getMediaByClientId } from "@/lib/queries/queries";
import { FunnelPage, Media } from "@prisma/client";
import React, { useEffect, useState } from "react";

export default function MediaTab({
	clientId,
	funnelPage,
}: {
	clientId: string;
	funnelPage: FunnelPage;
}) {
	const [medias, setMedias] = useState<Media[]>([]);

	useEffect(() => {
		const fetchMedias = async () => {
			const medias = await getMediaByClientId(clientId);
			setMedias(medias);
		};

		fetchMedias();
	}, [clientId, funnelPage]);

	return (
		<div>
			<MediaComponent medias={medias} clientId={clientId} />
		</div>
	);
}
