import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
export default function Provider({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<Toaster />
			<NextTopLoader />
			{children}
		</ClerkProvider>
	);
}
