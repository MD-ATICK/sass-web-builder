"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useUserDetailsOpen } from "./hooks/use-user-details-open";
import UserDetails from "@/components/forms/user-details";
import { client } from "@prisma/client";

type props = {
	clients: client[];
};
export default function UserDetailsSheet({ clients }: props) {
	const { open, setOpen, user } = useUserDetailsOpen();
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent>
				<div className=' p-4 space-y-6'>
					<h2 className=' font-bold text-2xl'>User Details</h2>
					{user && <UserDetails user={user} clients={clients} />}
				</div>
			</SheetContent>
		</Sheet>
	);
}
