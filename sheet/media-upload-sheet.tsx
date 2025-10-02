"use client";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import MediaForm from "@/components/forms/media-form";
import { useMediaUploadOpen } from "./hooks/use-media-upload-open";

export default function MediaUploadSheet({ clientId }: { clientId: string }) {
	const { open, setOpen } = useMediaUploadOpen();
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent className=' w-[500px]'>
				<SheetHeader>
					<SheetTitle>Media Upload</SheetTitle>
					<SheetDescription> Upload Media </SheetDescription>
				</SheetHeader>
				<div className=' p-4 space-y-4'>
					<MediaForm clientId={clientId} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
