import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function ActionButtons() {
	const { userId } = await auth();

	return (
		<div className='flex items-center gap-3'>
			{!userId && (
				<SignInButton>
					<Button size={"sm"}>Sign In</Button>
				</SignInButton>
			)}
			{userId && (
				<Link href={"/agency"}>
					<Button size={"sm"}>Go to Agency</Button>
				</Link>
			)}
			<UserButton />
		</div>
	);
}
