"use client";
import { Button } from "@/components/ui/button";
import { useMediaUploadOpen } from "@/sheet/hooks/use-media-upload-open";
import MediaUploadSheet from "@/sheet/media-upload-sheet";
import { Media } from "@prisma/client";
import React from "react";
import MediaCard from "./media-card";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandList,
} from "@/components/ui/command";
import TabMediaCard from "./tab-media-card";

export default function MediaComponent({
	clientId,
	medias,
	isTab,
}: {
	clientId: string;
	medias: Media[];
	isTab?: boolean;
}) {
	const { setOpen } = useMediaUploadOpen();
	const [query, setQuery] = React.useState("");

	const filteredData = medias.filter(media => {
		return media.name.toLowerCase().includes(query.toLowerCase());
	});

	return (
		<div className=' space-y-4 p-4'>
			<MediaUploadSheet clientId={clientId} />
			<div className='flex items-center justify-between'>
				<h2 className=' font-bold text-xl'>Media Buckets</h2>
				<Button onClick={() => setOpen(true)} size={"sm"}>
					Upload
				</Button>
			</div>
			{isTab ? (
				<Command>
					<CommandInput placeholder='Search' />
					<CommandList className=' grid grid-cols-4 gap-8'>
						{medias.map(media => {
							return <MediaCard key={media.id} media={media} />;
						})}
						<CommandEmpty>No results found.</CommandEmpty>
					</CommandList>
				</Command>
			) : (
				<Command>
					<CommandInput
						placeholder='Search'
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList className=' columns-2 gap-3 w-full'>
						{filteredData.map(media => {
							return <TabMediaCard key={media.id} media={media} />;
						})}
						<CommandEmpty>No results found.</CommandEmpty>
					</CommandList>
				</Command>
			)}
		</div>
	);
}
