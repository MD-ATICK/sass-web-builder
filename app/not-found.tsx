"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className='flex flex-col justify-center items-center h-screen'>
			<h1 className=' font-bold text-8xl text-primary'>404</h1>
			<p className=' text-sm text-muted-foreground'>
				This page in not available!
			</p>
			<br />
			<Button onClick={() => router.back()}>Back</Button>
		</div>
	);
}
