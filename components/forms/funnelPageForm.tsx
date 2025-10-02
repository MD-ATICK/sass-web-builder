import { FunnelPage } from "@prisma/client";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/global/loading-button";
import { toast } from "sonner";
import {
	createFunnelPageData,
	updateFunnelPageData,
} from "@/lib/queries/funnel";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

export default function FunnelPageForm({
	funnelPage,
	setOpen,
	funnelId,
	order,
	duplicateOption,
}: {
	funnelId: string;
	funnelPage?: FunnelPage;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	order?: number;
	duplicateOption?: boolean;
}) {
	const [name, setName] = React.useState(funnelPage?.name || "");
	const [pathName, setPathName] = React.useState(funnelPage?.pathName || "");
	const [isPending, startTransition] = React.useTransition();
	const router = useRouter();
	const [isDuplicatePending, startDuplicateTransition] = React.useTransition();

	const handleDuplicate = () => {
		startDuplicateTransition(async () => {
			await createFunnelPageData({
				name,
				pathName,
				order: order || 0,
				funnelId,
			});
			toast.success("Funnel Page duplicated successfully");
			router.refresh();
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			if (funnelPage) {
				await updateFunnelPageData({
					name,
					pathName,
					id: funnelPage.id,
					order: funnelPage.order || order || 0,
					content: funnelPage.content,
				});
				if (setOpen) setOpen(false);
				toast.success("Funnel Page updated successfully");
				router.refresh();
			} else {
				await createFunnelPageData({
					name,
					pathName,
					order: order || 0,
					funnelId,
				});
				if (setOpen) setOpen(false);
				toast.success("Funnel Page created successfully");
				router.refresh();
			}
		});
	};

	useEffect(() => {
		if (funnelPage) {
			setName(funnelPage.name);
			setPathName(funnelPage.pathName);
		}
	}, [funnelPage]);
	return (
		<form onSubmit={handleSubmit} className=' space-y-6'>
			<div className=' space-y-2'>
				<Label> Name</Label>
				<Input value={name} onChange={e => setName(e.target.value)} required />
			</div>
			<div className=' space-y-2'>
				<Label>
					{" "}
					PathName{" "}
					<span className=' text-muted-foreground text-xs'>
						(Remember to Enter &quot;/&quot;)
					</span>{" "}
				</Label>
				<Input
					value={pathName}
					onChange={e => setPathName(e.target.value)}
					required
				/>
			</div>

			<div className='flex items-center justify-between w-full gap-3'>
				<LoadingButton
					isPending={isPending}
					disabled={isPending || !name}
					type='submit'
					size={"sm"}
					className=' w-[55%]'
				>
					{funnelPage ? "Update Funnel Page" : "Create Funnel Page"}
				</LoadingButton>
				{duplicateOption && (
					<LoadingButton
						size={"sm"}
						variant={"outline"}
						className=' w-[40%]'
						isPending={isDuplicatePending}
						disabled={isDuplicatePending || !name}
						onClick={handleDuplicate}
					>
						<Copy size={15} /> Duplicate
					</LoadingButton>
				)}
			</div>
		</form>
	);
}
