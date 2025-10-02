"use client";

import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // optional for success/error toast
import { Agency, client } from "@prisma/client";
import {
	deleteClientByAgencyId,
	initClient,
	saveActivityLogNotification,
	updateClientDetails,
} from "@/lib/queries/queries";
import LoadingButton from "../global/loading-button";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent } from "../ui/sheet";
import { useClientUpsert } from "@/zustand/use-client-upsert";
import { v4 } from "uuid";

type valuesType = Pick<
	client,
	| "name"
	| "clientLogo"
	| "companyPhone"
	| "address"
	| "city"
	| "zipCode"
	| "state"
	| "country"
>;

interface ClientProps {
	agencyDetails: Agency;
	// client?: Partial<client>;
	userName: string;
}

export default function ClientDetails({
	// client,
	agencyDetails,
	userName,
}: ClientProps) {
	const [isPending, startTransition] = useTransition();
	const [isDeletingPending, startDeletingTransition] = useTransition();

	const { open, setOpen, client } = useClientUpsert();

	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const values: valuesType = {
			name: formData.get("name") as string,
			clientLogo: formData.get("clientLogo") as string,
			companyPhone: formData.get("companyPhone") as string,
			address: formData.get("address") as string,
			city: formData.get("city") as string,
			zipCode: formData.get("zipCode") as string,
			state: formData.get("state") as string,
			country: formData.get("country") as string,
		};

		const id = v4();
		startTransition(async () => {
			try {
				console.log("clientId", client?.id, "newId", id);
				const response = await initClient({
					...values,
					companyEmail: agencyDetails.companyEmail,
					id: client?.id ? client?.id : id,
					goal: 5,
					agencyId: agencyDetails.id,
				});

				if (!response) throw new Error("Failed to save Client details");

				await saveActivityLogNotification({
					agencyId: response.agencyId,
					description: `${userName} | Updated Client ${response.name}`,
					clientId: response.id,
				});

				setOpen(false);
				toast.success("Client created!");
				return router.refresh();
			} catch (error) {
				console.error(error);
				toast.error("Failed to save Client details");
			}
		});
	};

	const handleDelete = () => {
		startDeletingTransition(async () => {
			try {
				toast.loading("Client loading!", { id: "Client-delete" });
				if (!client?.id) return;
				const deletedClient = await deleteClientByAgencyId(client.id);
				if (deletedClient) {
					toast.success("Client deleted!", { id: "Client-delete" });
				}
			} catch (error) {
				console.error(error);
				toast.error("Failed to delete Client", { id: "Client-delete" });
			}
		});
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			{/* <SheetTrigger asChild>
				<Button>Create Client</Button>
			</SheetTrigger> */}
			<SheetContent className='max-w-2xl mx-auto py-6 w-full'>
				<Card className=' bg-transparent border-none shadow-none py-10 overflow-auto'>
					<CardHeader>
						<CardTitle>Client Details</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Name */}
							<div className='grid gap-2'>
								<Label htmlFor='name'>Client Name</Label>
								<Input
									id='name'
									defaultValue={client?.name}
									name='name'
									required
								/>
							</div>

							{/* Logo */}
							<div className='grid gap-2'>
								<Label htmlFor='clientLogo'>Logo</Label>
								<Input
									defaultValue={
										"https://cdn.dribbble.com/userupload/12413855/file/original-00f4ec9f7476703af7472dd2ca439595.png?resize=1024x768&vertical=center"
									}
									id='clientLogo'
									name='clientLogo'
									required
								/>
							</div>

							{/* Email */}
							{/* <div className='grid gap-2'>
								<Label htmlFor='companyEmail'>Company Email</Label>
								<Input
									id='companyEmail'
									name='companyEmail'
									type='email'
									required
								/>
							</div> */}

							{/* Phone */}
							<div className='grid gap-2'>
								<Label htmlFor='companyPhone'>Company Phone</Label>
								<Input
									id='companyPhone'
									name='companyPhone'
									type='tel'
									defaultValue={client?.companyPhone}
									required
								/>
							</div>

							{/* Address */}
							<div className='grid gap-2'>
								<Label htmlFor='address'>Address</Label>
								<Input
									id='address'
									defaultValue={client?.address}
									name='address'
									required
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='city'>City</Label>
									<Input
										id='city'
										defaultValue={client?.city}
										name='city'
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='zipCode'>Zip Code</Label>
									<Input
										id='zipCode'
										defaultValue={client?.zipCode}
										name='zipCode'
										required
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='state'>State</Label>
									<Input
										id='state'
										defaultValue={client?.state}
										name='state'
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='country'>Country</Label>
									<Input
										id='country'
										defaultValue={client?.country}
										name='country'
										required
									/>
								</div>
							</div>

							{client && client?.id && (
								<div className=' space-y-2'>
									<Label htmlFor='goals'>Goal</Label>
									<Input
										type='number'
										min={1}
										defaultValue={client?.goal}
										onChange={async e => {
											await updateClientDetails(client.id!, {
												goal: parseInt(e.target.value),
											});

											await saveActivityLogNotification({
												clientId: client?.id,
												description: "Goal",
											});
										}}
										id='notes'
										name='notes'
									/>
								</div>
							)}

							<LoadingButton
								type='submit'
								isPending={isPending}
								disabled={isPending}
								className='w-full'
							>
								{client?.id ? "Update" : "Create"}
							</LoadingButton>

							{/* DELETE Client */}
							{client?.id && (
								<div className=' border p-4 border-destructive rounded-md'>
									<p className=' font-semibold'>Danger</p>
									<p className=' text-muted-foreground'>
										Lorem ipsum dolor sit amet consectetur adipisicing elit.
										Asperiores ratione iure mollitia quidem vel aperiam iste quo
										aspernatur sequi amet!
									</p>
									<br />
									<LoadingButton
										disabled={isDeletingPending}
										isPending={isDeletingPending}
										onClick={handleDelete}
										type='button'
										variant={"destructive"}
										className=' w-full'
									>
										Delete
									</LoadingButton>
								</div>
							)}
						</form>
					</CardContent>
				</Card>
			</SheetContent>
		</Sheet>
	);
}
