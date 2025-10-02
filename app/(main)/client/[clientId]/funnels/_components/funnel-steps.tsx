"use client";
import FunnelPageForm from "@/components/forms/funnelPageForm";
import FunnelPagePlaceholder from "@/components/funnel-page-placeholder";
import LoadingButton from "@/components/global/loading-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	deleteFunnelPageById,
	getFunnelById,
	updateFunnelPageData,
} from "@/lib/queries/funnel";
import CreateFunnelPageDialog from "@/sheet/create-funnel-page-dialog";
import { FunnelPage } from "@prisma/client";
import {
	ChevronsDown,
	Eye,
	Link as LinkIcon,
	Loader,
	Mail,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import { toast } from "sonner";

type Props = {
	funnel: Awaited<ReturnType<typeof getFunnelById>>;
	clientId: string;
	funnelId: string;
};

export default function FunnelSteps({ funnel, clientId, funnelId }: Props) {
	const [selectedPage, setSelectedPage] = useState<FunnelPage | null>(
		funnel?.FunnelPages[0] || null,
	);
	const [pages, setPages] = useState(funnel?.FunnelPages);
	const [isPending, startTransition] = React.useTransition();
	const [isSavingPending, startSavingTransition] = React.useTransition();
	const router = useRouter();

	const handleDragEnd = (result: DropResult) => {
		const { destination, source } = result;

		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		) {
			toast.error("No changes made");
			return;
		}

		if (!pages) return;

		const newOrderPages = [...pages]
			.toSpliced(source.index, 1)
			.toSpliced(destination.index, 0, pages[source.index])
			.map((page, index) => {
				return {
					...page,
					order: index,
				};
			});

		setPages(newOrderPages);

		startSavingTransition(() => {
			newOrderPages.map(async (page, index) => {
				await updateFunnelPageData({
					...page,
					order: index,
				});
			});
		});
	};

	const SelectedPageWebsiteLink = `${process.env.NEXT_PUBLIC_URL_SCHEME}${funnel?.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}${selectedPage?.pathName}`;

	useEffect(() => {
		setPages(funnel?.FunnelPages);
		setSelectedPage(funnel?.FunnelPages[0] || null);
	}, [funnel?.FunnelPages]);

	return (
		<div className=' min-h-screen'>
			<div className='  rounded-md flex items-start gap-8'>
				<div className=' flex-1 border p-6 rounded-xl'>
					<ScrollArea>
						<DragDropContext onDragEnd={handleDragEnd}>
							<div className=' space-y-6'>
								<div className='flex items-center justify-between'>
									<h2 className=' text-lg capitalize font-semibold'>
										{funnel?.name}
									</h2>

									<div className='flex items-center gap-2'>
										{isSavingPending && (
											<Button className='' variant={"outline"} size={"sm"}>
												<Loader
													size={15}
													className=' animate-spin text-emerald-500'
												/>
												Saving
											</Button>
										)}
										<CreateFunnelPageDialog
											order={pages?.length}
											funnelId={funnelId}
										/>

										<Button size={"sm"} variant={"destructive"}>
											Delete Funnel
										</Button>
									</div>
								</div>
								<Droppable
									droppableId='funnels'
									key={"funnels"}
									direction='vertical'
								>
									{provided => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className=' space-y-4'
										>
											{pages?.map((page, index) => (
												<Draggable
													key={page.id}
													draggableId={page.id}
													index={index}
												>
													{provided => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															onClick={() => setSelectedPage(page)}
															className=' h-20 w-full rounded-lg bg-gray-950  border flex gap-6 items-center relative cursor-pointer'
														>
															<div className=' h-full aspect-square flex justify-center items-center bg-gray-900'>
																<Mail className=' ' />
															</div>
															<p className=' text-sm  font-semibold capitalize'>
																{page.name}
															</p>
															{selectedPage?.id === page.id && (
																<div className=' h-2 aspect-square rounded-full bg-emerald-500  absolute top-4 right-4'></div>
															)}
															{pages.length !== index + 1 && (
																<ChevronsDown
																	size={25}
																	className=' text-primary/80 absolute left-8 -bottom-4 p-[1px] bg-background rounded-full'
																/>
															)}
														</div>
													)}
												</Draggable>
											))}
										</div>
									)}
								</Droppable>
							</div>
						</DragDropContext>
					</ScrollArea>
				</div>

				{/* Selected Page */}
				{selectedPage && (
					<div className=' flex-1  space-y-6'>
						<div className=' border p-2 rounded-md'>
							<div className=' relative group '>
								<FunnelPagePlaceholder />
								<div className='flex justify-center items-center duration-300 bg-background/50 h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100'>
									<Link
										href={`/client/${clientId}/funnels/${funnelId}/editor/${selectedPage?.id}`}
									>
										<Button variant={"outline"} size={"sm"}>
											<Eye className=' text-emerald-500' size={15} /> View
										</Button>
									</Link>
								</div>
							</div>
							<Link href={SelectedPageWebsiteLink}>
								<div className=' flex items-center gap-2 text-muted-foreground px-2 hover:underline duration-200'>
									<LinkIcon className=' text-emerald-500' size={15} />
									<p>{SelectedPageWebsiteLink}</p>
								</div>
							</Link>
						</div>

						<FunnelPageForm
							duplicateOption
							funnelId={funnelId}
							order={pages?.length}
							funnelPage={selectedPage}
						/>

						<div className=' border rounded-md p-4 space-y-4 border-destructive/50'>
							<div className=' text-sm'>
								<h2 className=''>Delete Funnel Page</h2>
								<p className=' text-xs text-muted-foreground'>
									Are you sure you want to delete this funnel page?
								</p>
							</div>
							<LoadingButton
								variant={"destructive"}
								className=' w-full'
								disabled={isPending}
								isPending={isPending}
								size={"sm"}
								onClick={() => {
									startTransition(async () => {
										await deleteFunnelPageById(selectedPage?.id);
										router.refresh();
									});
								}}
							>
								<Trash2 /> Delete
							</LoadingButton>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
