import { cn } from "@/lib/utils";
import React from "react";

export default function Container({
	className,
	children,
}: {
	className: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn(" max-w-[1600px] px-2 mx-auto", className)}>
			{children}
		</div>
	);
}
