import React from "react";
import Logo from "./global/logo";
import { navigation } from "@/constants";
import Link from "next/link";
import ActionButtons from "./action-buttons";
import Container from "./global/container";

export default function Navigation() {
	return (
		<div className=' border-b'>
			<Container className=' flex items-center justify-between h-14 text-sm'>
				<Logo />
				<div className='flex items-center gap-10'>
					{navigation.map(item => (
						<Link key={item.href} href={item.href}>
							{item.name}
						</Link>
					))}
				</div>
				<ActionButtons />
			</Container>
		</div>
	);
}
