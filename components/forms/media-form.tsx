"use client";
import LoadingButton from "@/components/global/loading-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMedia } from "@/lib/queries/queries";
import { UploadDropzone } from "@/lib/uploadthings";
import { useMediaUploadOpen } from "@/sheet/hooks/use-media-upload-open";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function MediaForm({ clientId }: { clientId: string }) {
	const { setOpen } = useMediaUploadOpen();
	const [name, setName] = useState("");
	const [link, setLink] = useState("");
	const router = useRouter();
	const [isPending, startTransition] = React.useTransition();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			startTransition(async () => {
				setOpen(false);
				toast.loading("Uploading...", { id: "media" });
				if (!name || !link) return;
				await createMedia({ name, link, clientId });
				toast.success("Media uploaded successfully", { id: "media" });
				router.refresh();
			});
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong", { id: "media" });
		}
	};

	return (
		<form onSubmit={handleSubmit} className=' space-y-4'>
			{/* Name */}
			<div className='grid gap-2'>
				<Label htmlFor='name'>Name</Label>
				<Input
					id='name'
					name='name'
					value={name}
					onChange={e => setName(e.target.value)}
					required
				/>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='link'>Link</Label>
			</div>
			{link ? (
				<AspectRatio ratio={16 / 9} className=' relative'>
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => setLink("")}
						className=' absolute top-2 right-2 z-50 rounded-full'
					>
						<X />
					</Button>
					<Image
						src={link}
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
							setLink(res[0].url);
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
			<LoadingButton
				isPending={isPending}
				disabled={isPending || !name || !link}
				type='submit'
				className=' w-full'
			>
				Upload
			</LoadingButton>
		</form>
	);
}
