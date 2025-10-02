import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { ButtonTypes } from "@/constants";
import React from "react";
import TextPlaceholder from "./placeholder/text-placeholder";
import ContainerPlaceholder from "./placeholder/container-placeholder";
import CheckoutPlaceholder from "./placeholder/checkout-placeholder";

type ComponentType = {
	component: React.ReactNode;
	type: ButtonTypes;
	group: "layouts" | "elements";
};

export default function ComponentTab() {
	const components: ComponentType[] = [
		{
			component: <TextPlaceholder />,
			type: "text",
			group: "elements",
		},
		{
			component: <ContainerPlaceholder />,
			type: "container",
			group: "layouts",
		},
		{
			component: <CheckoutPlaceholder />,
			type: "paymentForm",
			group: "layouts",
		},
	];

	return (
		<div>
			<SheetHeader>
				<SheetTitle>Components</SheetTitle>
				<SheetDescription> Choose a component </SheetDescription>
			</SheetHeader>
			<Accordion
				type='multiple'
				value={["layouts", "elements"]}
				className=' p-4'
			>
				<AccordionItem value='layouts'>
					<AccordionTrigger>Layouts</AccordionTrigger>
					<AccordionContent>
						<div className=' grid grid-cols-2 gap-3'>
							{components
								.filter(component => component.group === "layouts")
								.map(component => component.component)}
						</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value='elements'>
					<AccordionTrigger>Elements</AccordionTrigger>
					<AccordionContent>
						<div className=' grid grid-cols-2 gap-3'>
							{components
								.filter(component => component.group === "elements")
								.map(component => component.component)}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
