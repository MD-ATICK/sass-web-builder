"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // optional for success/error toast
import { Agency } from "@prisma/client";
import {
	deleteAgencyById,
	initAgency,
	initUser,
	saveActivityLogNotification,
	updateAgencyDetails,
} from "@/lib/queries/queries";
import LoadingButton from "../global/loading-button";
import { useRouter } from "next/navigation";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import * as uuid from "uuid";

type valuesType = Pick<
	Agency,
	| "name"
	| "agencyLogo"
	| "companyPhone"
	| "whiteLabel"
	| "address"
	| "city"
	| "zipCode"
	| "state"
	| "country"
>;

export default function AgencyDetails({
	agency,
	label,
}: {
	agency?: Partial<Agency>;
	label?: string;
}) {
	// Initialize whiteLabel from agency data or default to true
	const [whiteLabel, setWhiteLabel] = useState(agency?.whiteLabel ?? true);
	const [isPending, startTransition] = useTransition();
	const [isDeletingPending, startDeletingTransition] = useTransition();

	const id = uuid.v4();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const values: valuesType = {
			name: formData.get("name") as string,
			agencyLogo: formData.get("agencyLogo") as string,
			companyPhone: formData.get("companyPhone") as string,
			whiteLabel: formData.get("whiteLabel") === "on" || whiteLabel, // Use state value
			address: formData.get("address") as string,
			city: formData.get("city") as string,
			zipCode: formData.get("zipCode") as string,
			state: formData.get("state") as string,
			country: formData.get("country") as string,
		};

		startTransition(async () => {
			try {
				// UPDATE EXISTING AGENCY
				if (agency?.id) {
					await updateAgencyDetails(agency.id, values);
					await saveActivityLogNotification({
						agencyId: agency.id,
						description: `Updated agency details`,
					});
					toast.success("Agency details updated!");
					return router.refresh();
				}

				// CREATE NEW
				console.log("run it");
				const initedUser = await initUser({ role: "AGENCY_OWNER" });

				const bodyDataOfStripe = {
					email: initedUser?.email,
					name: values.name,
					shipping: {
						address: {
							city: values.city,
							country: values.country,
							line1: values.address, // Fixed typo: linel -> line1
							postal_code: values.zipCode,
							state: values.state,
						},
						name: values.name,
					},
					address: {
						city: values.city,
						country: values.country,
						line1: values.address, // Fixed typo: linel -> line1
						postal_code: values.zipCode,
						state: values.state,
					},
				};

				const response = await fetch("/api/stripe/create-customer", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bodyDataOfStripe),
				});

				const { customerId } = await response.json();
				console.log("customerId", customerId);
				if (!customerId) throw new Error("Failed to create customer");

				if (initedUser?.email) {
					await initAgency({
						...values,
						customerId,
						companyEmail: initedUser?.email,
						id,
						goal: 5,
					});

					toast.success("Agency created!");
					return router.refresh();
				}
			} catch (error) {
				console.error(error);
				const action = agency?.id ? "update" : "create";
				toast.error(`Failed to ${action} agency details`);
			}
		});
	};

	const handleDelete = () => {
		startDeletingTransition(async () => {
			try {
				toast.loading("Deleting agency...", { id: "agency-delete" });
				if (!agency?.id) return;

				const deletedAgency = await deleteAgencyById(agency.id);
				if (deletedAgency) {
					toast.success("Agency deleted!", { id: "agency-delete" });
					router.refresh();
				}
			} catch (error) {
				console.error(error);
				toast.error("Failed to delete agency", { id: "agency-delete" });
			}
		});
	};

	const isEditing = !!agency?.id;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>
					{label || (isEditing ? "Edit Agency" : "Create Agency")}
				</Button>
			</SheetTrigger>
			<SheetContent className='max-w-2xl overflow-y-auto mx-auto py-6 w-full'>
				<Card className='bg-transparent border-none shadow-none py-10'>
					<CardHeader>
						<CardTitle>
							{isEditing ? "Edit Agency Details" : "Create New Agency"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Name */}
							<div className='grid gap-2'>
								<Label htmlFor='name'>Agency Name</Label>
								<Input
									id='name'
									name='name'
									defaultValue={agency?.name || ""}
									required
								/>
							</div>

							{/* Logo */}
							<div className='grid gap-2'>
								<Label htmlFor='agencyLogo'>Logo</Label>
								<Input
									defaultValue={
										agency?.agencyLogo ||
										"https://cdn.dribbble.com/userupload/12413855/file/original-00f4ec9f7476703af7472dd2ca439595.png?resize=1024x768&vertical=center"
									}
									id='agencyLogo'
									name='agencyLogo'
									required
								/>
							</div>

							{/* Phone */}
							<div className='grid gap-2'>
								<Label htmlFor='companyPhone'>Company Phone</Label>
								<Input
									id='companyPhone'
									name='companyPhone'
									type='tel'
									defaultValue={agency?.companyPhone || ""}
									required
								/>
							</div>

							{/* WhiteLabel Switch */}
							<div className='flex items-center justify-between'>
								<Label htmlFor='whiteLabel'>White Label</Label>
								<Switch
									id='whiteLabel'
									name='whiteLabel'
									checked={whiteLabel}
									onCheckedChange={setWhiteLabel}
								/>
							</div>

							{/* Address */}
							<div className='grid gap-2'>
								<Label htmlFor='address'>Address</Label>
								<Input
									id='address'
									name='address'
									defaultValue={agency?.address || ""}
									required
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='city'>City</Label>
									<Input
										id='city'
										name='city'
										defaultValue={agency?.city || ""}
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='zipCode'>Zip Code</Label>
									<Input
										id='zipCode'
										name='zipCode'
										defaultValue={agency?.zipCode || ""}
										required
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='state'>State</Label>
									<Input
										id='state'
										name='state'
										defaultValue={agency?.state || ""}
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='country'>Country</Label>
									<Input
										id='country'
										name='country'
										defaultValue={agency?.country || ""}
										required
									/>
								</div>
							</div>

							{/* Goal field - only show when editing */}
							{isEditing && (
								<div className='space-y-2'>
									<Label htmlFor='goal'>Goal</Label>
									<Input
										type='number'
										min={1}
										defaultValue={agency?.goal || 5}
										onChange={async e => {
											if (!agency?.id) return;

											await updateAgencyDetails(agency.id, {
												goal: parseInt(e.target.value),
											});

											await saveActivityLogNotification({
												agencyId: agency.id,
												description: `Updated goal to ${e.target.value}`,
											});
										}}
										id='goal'
										name='goal'
									/>
								</div>
							)}

							<SheetClose className=' w-full'>
								<LoadingButton
									type='submit'
									isPending={isPending}
									disabled={isPending}
									className='w-full'
								>
									{isEditing ? "Update Agency" : "Create Agency"}
								</LoadingButton>
							</SheetClose>
							{/* DELETE AGENCY - only show when editing */}
							{isEditing && (
								<div className='border p-4 border-destructive rounded-md'>
									<p className='font-semibold'>Danger Zone</p>
									<p className='text-muted-foreground'>
										Deleting this agency will permanently remove all associated
										data including clients, pipelines, and team members. This
										action cannot be undone.
									</p>
									<br />
									<LoadingButton
										disabled={isDeletingPending}
										isPending={isDeletingPending}
										onClick={handleDelete}
										type='button'
										variant={"destructive"}
										className='w-full'
									>
										Delete Agency
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
