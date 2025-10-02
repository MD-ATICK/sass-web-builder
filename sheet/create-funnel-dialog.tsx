"use client";
import LoadingButton from "@/components/global/loading-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFunnel, updateFunnel } from "@/lib/queries/funnel";
import { UploadDropzone } from "@/lib/uploadthings";
import { Funnel } from "@prisma/client";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function CreateFunnelDialog({
	clientId,
	funnel,
}: {
	clientId: string;
	funnel?: Funnel;
}) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState(funnel?.name || "");
	const [description, setDescription] = React.useState(
		funnel?.description || "",
	);
	const [favicon, setFavicon] = React.useState(funnel?.favicon || "");
	const [subDomainName, setSubDomainName] = React.useState(
		funnel?.subDomainName || "",
	);

	const [isPending, startTransition] = React.useTransition();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			setOpen(false);
			toast.loading(`${funnel ? "Updating" : "Creating"} Funnel...`, {
				id: "funnel",
			});
			if (!name || !description || !favicon || !subDomainName) return;
			if (funnel) {
				await updateFunnel({
					name,
					description,
					favicon,
					subDomainName,
					clientId,
					id: funnel.id,
				});
			} else {
				await createFunnel({
					name,
					description,
					favicon,
					subDomainName,
					clientId,
				});
			}
			toast.success(`Funnel ${funnel ? "updated" : "created"} successfully`, {
				id: "funnel",
			});
			router.refresh();
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"sm"}>
					<Plus size={15} />
					{funnel ? "Edit" : "Create"} Funnel
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle> {funnel ? "Edit" : "Create"} Funnel</DialogTitle>
					<DialogDescription>
						{" "}
						{funnel ? "Edit your old" : "Create a new"} funnel{" "}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className=' space-y-4'>
					{favicon ? (
						<AspectRatio ratio={16 / 9} className=' relative'>
							<Button
								variant={"outline"}
								size={"icon"}
								onClick={() => setFavicon("")}
								className=' absolute top-2 right-2 z-50 rounded-full'
							>
								<X />
							</Button>
							<Image
								src={favicon}
								alt={name}
								fill
								className=' rounded-sm object-cover'
							/>
						</AspectRatio>
					) : (
						<div className='UploadButton'>
							<UploadDropzone
								endpoint='imageUploader'
								onClientUploadComplete={res => {
									setFavicon(res[0].url);
									// Do something with the response
									console.log("Files: ", res);
									toast.success("Upload Completed!");
								}}
								onUploadError={(error: Error) => {
									// Do something with the error.
									toast.error(`ERROR! ${error.message}`);
								}}
							/>
						</div>
					)}
					<div className=' space-y-2'>
						<Label> Name</Label>
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
							required
						/>
					</div>
					<div className=' space-y-2'>
						<Label> Description</Label>
						<Input
							value={description}
							onChange={e => setDescription(e.target.value)}
							required
						/>
					</div>
					<div className=' space-y-2'>
						<Label> SubDomain Name</Label>
						<Input
							value={subDomainName}
							onChange={e => setSubDomainName(e.target.value)}
							required
						/>
					</div>

					<br />
					<LoadingButton
						isPending={isPending}
						disabled={isPending || !name}
						type='submit'
						className=' w-full'
					>
						{funnel ? "Update Funnel" : "Create Funnel"}
					</LoadingButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
