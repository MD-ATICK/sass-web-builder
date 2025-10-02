import Navigation from "@/components/navigation";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div>
			<Navigation />
			{children}
		</div>
	);
}
