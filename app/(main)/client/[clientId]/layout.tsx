import React from "react";
import LayoutDesign from "./_components/layout-design";

export default async function layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ clientId: string }>;
}) {
	const { clientId } = await params;
	return <LayoutDesign clientId={clientId}>{children}</LayoutDesign>;
}
