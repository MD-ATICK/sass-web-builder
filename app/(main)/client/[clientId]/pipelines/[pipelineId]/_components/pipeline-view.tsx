"use client";
import { Button } from "@/components/ui/button";
import CreateLaneDialog from "@/sheet/create-lane-dialog";
import { useCreateLaneOpen } from "@/sheet/hooks/use-create-lane-open";
import { Pipeline } from "@prisma/client";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
	getLanesByPipelineId,
	updateAllLanesOrder,
	updateTicketsOrder,
} from "@/lib/queries/pipeline";
import { FormatValue } from "@/lib/helper";
import LaneActionButtons from "./lane-action-buttons";
import UpsertTicketSheet from "@/sheet/upsert-ticket-sheet";

import { Link } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { tagUsableColors } from "@/components/tag-creator";
import Image from "next/image";
import { toast } from "sonner";
import TicketActionButtons from "./ticket-action-buttons";

type Props = {
	pipeline: Pipeline;
	lanes: Awaited<ReturnType<typeof getLanesByPipelineId>>;
	clientId: string;
};

export type LanesType = Awaited<ReturnType<typeof getLanesByPipelineId>>;

export default function PipelineView({ lanes, pipeline, clientId }: Props) {
	const { setOpen } = useCreateLaneOpen();
	const [allLanes, setAllLanes] = React.useState<LanesType>([]);

	React.useEffect(() => {
		setAllLanes(lanes);
	}, [lanes]);

	const handleDrugEnd = async (result: DropResult) => {
		const { destination, source, type } = result;
		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		) {
			return;
		}

		switch (type) {
			case "lane": {
				if (!allLanes) return;
				const newLanes = [...allLanes]
					.toSpliced(source.index, 1)
					.toSpliced(destination.index, 0, allLanes[source.index])
					.map((lane, index) => {
						return {
							...lane,
							order: index,
						};
					});

				setAllLanes(newLanes);
				await updateAllLanesOrder(newLanes);
				toast.success("Lane reordered successfully");
			}
			case "ticket": {
				if (!allLanes) return;
				const newLanes = [...allLanes];
				const originLane = newLanes.find(
					lane => lane.id === source.droppableId,
				);

				const destinationLane = newLanes.find(
					lane => lane.id === destination.droppableId,
				);
				if (!originLane || !destinationLane) {
					return;
				}

				if (source.droppableId === destination.droppableId) {
					const newOrderedTickets = [...originLane.Tickets]
						.toSpliced(source.index, 1)
						.toSpliced(destination.index, 0, originLane.Tickets[source.index])
						.map((item, idx) => {
							return { ...item, order: idx };
						});
					originLane.Tickets = newOrderedTickets;
					setAllLanes(newLanes);
					await updateTicketsOrder(newOrderedTickets);
					toast.success("Same Lane Ticket reordered successfully");
				} else {
					const [currentTicket] = originLane.Tickets.splice(source.index, 1);

					originLane.Tickets.forEach((ticket, idx) => {
						ticket.order = idx;
					});

					destinationLane.Tickets.splice(destination.index, 0, {
						...currentTicket,
						laneId: destination.droppableId,
					});

					destinationLane.Tickets.forEach((ticket, idx) => {
						ticket.order = idx;
					});
					setAllLanes(newLanes);
					await updateTicketsOrder([
						...destinationLane.Tickets,
						...originLane.Tickets,
					]);
					toast.success("Ticket reordered successfully");
				}
			}
		}
	};

	return (
		<div className=' p-6 space-y-4'>
			{/* All sheet and Dialog*/}
			<CreateLaneDialog
				pipelineId={pipeline.id}
				order={lanes.length}
				clientId={clientId}
			/>
			<UpsertTicketSheet clientId={clientId} pipelineId={pipeline.id} />

			{/* Pipeline Header */}
			<div className=' flex items-center justify-between'>
				<p className=' text-lg font-bold'>{pipeline.name}</p>
				<Button onClick={() => setOpen(true)} size={"sm"}>
					Create New Lane
				</Button>
			</div>

			{/* DragDropContext */}
			<DragDropContext onDragEnd={handleDrugEnd}>
				<Droppable
					type='lane'
					droppableId='lanes'
					direction='horizontal'
					key={"lanes"}
				>
					{provided => {
						return (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className='flex items-start gap-x-4'
							>
								{allLanes.map(lane => {
									const value = lane.Tickets.reduce(
										(acc, ticket) => acc + Number(ticket.value),
										0,
									);

									// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Lane Start @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
									return (
										<Draggable
											key={lane.id}
											draggableId={lane.id}
											index={lane.order}
										>
											{(provided, snapshot) => {
												if (snapshot.isDragging) {
													const offset = { x: 50, y: 0 };
													const style = provided.draggableProps.style;

													if (style) {
														provided.draggableProps.style = {
															...style,
															transform: `${
																style.transform || ""
															} translate(${-offset.x}px, ${offset.y}px)`,
														};
													}
												}
												return (
													<div
														{...provided.draggableProps}
														ref={provided.innerRef}
														className='min-h-[70vh] w-[300px] bg-[#111720] rounded-lg overflow-hidden'
													>
														{/* Drag handle - Header */}
														<div
															{...provided.dragHandleProps}
															className=' w-full bg-primary/50'
														>
															<div className='p-2 px-4 flex justify-between items-center text-sm  '>
																<p className='  font-semibold capitalize'>
																	{lane.name}
																</p>

																<div className='flex items-center gap-2'>
																	<Badge className=' bg-white text-black font-bold'>
																		{FormatValue(value)}
																	</Badge>
																	<LaneActionButtons
																		laneId={lane.id}
																		laneName={lane.name}
																		clientId={clientId}
																	/>
																</div>
															</div>
															<p className=' text-xs p-1'>{lane.id}</p>
														</div>

														{/* Content */}
														<Droppable
															type='ticket'
															droppableId={lane.id}
															key={lane.id}
														>
															{provided => {
																return (
																	<div
																		{...provided.droppableProps}
																		ref={provided.innerRef}
																		className=' p-1 h-full space-y-1'
																	>
																		{lane.Tickets.map(ticket => {
																			return (
																				// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Ticket Start @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
																				<Draggable
																					key={ticket.id}
																					draggableId={ticket.id}
																					index={ticket.order}
																				>
																					{(provided, snapshot) => {
																						if (snapshot.isDragging) {
																							const offset = { x: 50, y: 20 };
																							const style =
																								provided.draggableProps.style;

																							if (style) {
																								provided.draggableProps.style =
																									{
																										...style,
																										transform: `${
																											style.transform || ""
																										} translate(${-offset.x}px, ${
																											offset.y
																										}px)`,
																									};
																							}
																						}
																						return (
																							<div
																								{...provided.draggableProps}
																								ref={provided.innerRef}
																								{...provided.dragHandleProps}
																								className=' p-4 space-y-2 text-sm bg-background rounded-md w-full overflow-auto'
																							>
																								<div className='flex justify-between items-center'>
																									<p className=' text-sm font-semibold'>
																										{ticket.name}
																									</p>
																									<TicketActionButtons
																										ticket={ticket}
																									/>
																								</div>
																								<p className=' text-xs'>
																									{ticket.id}
																								</p>
																								<p className=' font-bold text-xs text-muted-foreground'>
																									{format(
																										ticket.createdAt,
																										"PP HH:mm",
																									)}
																								</p>
																								<div className='flex items-center gap-2'>
																									{ticket.Tags.map(tag => {
																										return (
																											<Badge
																												key={tag.id}
																												className={cn(
																													tagUsableColors[
																														tag.color
																													],
																												)}
																											>
																												{tag.name}
																											</Badge>
																										);
																									})}
																								</div>
																								<div className='flex items-center gap-2 text-sm'>
																									<Badge variant={"outline"}>
																										<Link size={15} />
																										Contact
																									</Badge>
																									<p>
																										{ticket.Customer?.email}
																									</p>
																								</div>
																								<div className='flex items-center justify-between border-t-2 pt-2 text-xs'>
																									<div className='flex items-center gap-2'>
																										<Image
																											src={
																												ticket.Assigned
																													?.avatarUrl || ""
																											}
																											height={30}
																											width={30}
																											className=' rounded-full'
																											alt=''
																										/>
																										<div>
																											<p className=' text-muted-foreground'>
																												Assigned To
																											</p>
																											<p className=' font-semibold '>
																												{ticket.Assigned?.name}
																											</p>
																										</div>
																									</div>
																									<p className=' font-bold text-sm'>
																										{FormatValue(
																											ticket.value || 0,
																										)}
																									</p>
																								</div>
																							</div>
																						);
																					}}
																				</Draggable>
																			);
																		})}
																	</div>
																);
															}}
														</Droppable>
													</div>
												);
											}}
										</Draggable>
									);
								})}
							</div>
						);
					}}
				</Droppable>
			</DragDropContext>
		</div>
	);
}
