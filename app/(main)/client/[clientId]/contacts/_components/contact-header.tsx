"use client";
import { Button } from "@/components/ui/button";
import { useCreateContactOpen } from "@/sheet/hooks/use-create-contact-open";
import React from "react";

export default function ContactHeader() {
	const { setOpen } = useCreateContactOpen();

	return (
		<div className='flex items-center justify-between p-4'>
			<h1 className=' font-semibold text-lg'>Contacts</h1>
			<Button size={"sm"} onClick={() => setOpen(true)}>
				Create New
			</Button>
		</div>
	);
}
