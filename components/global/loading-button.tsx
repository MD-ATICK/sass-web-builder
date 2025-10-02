"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};
interface LoadingButtonProps extends ButtonProps {
	isPending?: boolean;
	disabled?: boolean;
}

export default function LoadingButton({
	isPending,
	disabled,
	className,
	...props
}: LoadingButtonProps) {
	return (
		<Button
			className={cn("", className)}
			disabled={disabled || isPending}
			{...props}
		>
			{isPending ? (
				<>
					<Loader2Icon className=' text-white animate-spin' size={16} />
					<p>Loading...</p>
				</>
			) : (
				props.children
			)}
		</Button>
	);
}
