import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function page() {
	return (
		<div className=' h-svh w-full flex justify-center items-center flex-col gap-5'>
			<h1 className=' font-sans bg-gradient-to-r font-bold text-5xl bg-clip-text text-transparent from-blue-600 to-blue-800'>
				Plura
			</h1>
			<SignIn />
		</div>
	);
}
