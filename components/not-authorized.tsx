import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function NotAuthorized() {
	return (
		<div className='flex flex-col items-center justify-center gap-3 h-svh w-full'>
			<h2 className=' font-bold text-2xl'>Not Authorized</h2>
			<Link href={"/"}>
				<Button size={"sm"}>Back to home</Button>
			</Link>
		</div>
	);
}
