import { Tag, TagColor } from "@prisma/client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTagByClientId } from "@/lib/queries/pipeline";
import LoadingButton from "./global/loading-button";

export const tagUsableColors: Record<TagColor, string> = {
	BLUE: "bg-blue-600",
	PURPLE: "bg-purple-600",
};

export const tagColors = Object.keys(tagUsableColors) as TagColor[];

type Props = {
	tags: Tag[];
	selectedTags: Tag[];
	setSelectedTags: (tags: Tag[]) => void;
	setTags: (tags: Tag[]) => void;
	clientId: string;
	pipelineId: string;
};
export default function TagCreator({
	tags,
	selectedTags,
	setSelectedTags,
	clientId,
	setTags,
}: Props) {
	const [search, setSearch] = useState("");

	const [selectedColor, setSelectedColor] = useState<TagColor | null>(null);

	const [isPending, startTransition] = React.useTransition();

	const filteredTags = tags.filter(tag =>
		tag.name.toLowerCase().includes(search.toLowerCase()),
	);

	const handleCreateNewTag = () => {
		if (!selectedColor) {
			toast.error("Please select a color");
			return;
		}

		startTransition(async () => {
			const newTag = await createTagByClientId({
				name: search,
				color: selectedColor,
				clientId,
			});
			setTags([...tags, newTag]);
			setSearch("");
		});
	};

	return (
		<div>
			<Label>Selected Tags</Label>
			<div className=' text-sm py-2'>
				{selectedTags.length === 0 ? (
					<p className=' text-muted-foreground'>No tags selected</p>
				) : (
					<div className='flex flex-wrap gap-2 mt-2'>
						{selectedTags.map(tag => (
							<div
								key={tag.id}
								className={`flex items-center  gap-2 rounded-full px-2  py-1 text-sm border bg-gray-800 hover:bg-gray-700`}
							>
								<div
									className={`w-2 h-2 rounded-full ${
										tagUsableColors[tag.color]
									}`}
								/>
								<span>{tag.name}</span>
								<X
									size={15}
									className=' cursor-pointer'
									onClick={() =>
										setSelectedTags(selectedTags.filter(t => t.id !== tag.id))
									}
								/>
							</div>
						))}
					</div>
				)}
			</div>
			<Label>Tags</Label>
			<div className='flex flex-wrap gap-2 mt-2'>
				<Command>
					<CommandInput
						placeholder='Search...'
						value={search}
						onValueChange={setSearch}
					/>
					<CommandList>
						{tags.map(tag => (
							<CommandItem key={tag.id}>
								<div
									onClick={() => {
										if (selectedTags.find(t => t.id === tag.id)) {
											setSelectedTags(
												selectedTags.filter(t => t.id !== tag.id),
											);
										} else {
											setSelectedTags([...selectedTags, tag]);
										}
									}}
									className='flex items-center w-full justify-between'
								>
									<div className='flex items-center gap-2'>
										<div
											className={`w-2 h-2 rounded-full ${
												tagUsableColors[tag.color]
											}`}
										/>
										<span>{tag.name}</span>
									</div>
									<Check
										className={cn(
											selectedTags.find(t => t.id === tag.id)
												? "text-sky-500"
												: "text-muted-foreground",
										)}
									/>
								</div>
							</CommandItem>
						))}
						{filteredTags.length === 0 && (
							<div className=' space-y-1'>
								<p className=' text-xs text-muted-foreground'>
									Select One for creating tag
								</p>
								<div className='flex items-center gap-2'>
									{tagColors.map(color => (
										<Button
											type='button'
											variant={"outline"}
											key={color}
											size={"icon"}
											onClick={() => setSelectedColor(color)}
											className={cn(
												"flex rounded-full items-center gap-2",
												selectedColor === color &&
													"border-primary border-[3px]",
											)}
										>
											<div
												className={`w-2 h-2 rounded-full ${tagUsableColors[color]}`}
											/>
										</Button>
									))}
								</div>

								<LoadingButton
									onClick={handleCreateNewTag}
									isPending={isPending}
									disabled={isPending || search === "" || !selectedColor}
									type='button'
									size={"sm"}
									className=' w-full my-2'
								>
									Create Tag of {search}
								</LoadingButton>
							</div>
						)}
					</CommandList>
				</Command>
			</div>
		</div>
	);
}
