import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();
	console.log({ userId });
	const pathName = req.nextUrl.pathname;
	const urlExtension = pathName + req.nextUrl.search;
	console.log({ urlExtension, pathName });
	const customSubDomain = req.headers
		.get("host")
		?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
		.filter(Boolean)[0];
	console.log(req.headers.get("host"));

	if (customSubDomain) {
		return NextResponse.rewrite(
			new URL(`/${customSubDomain}${urlExtension}`, req.url),
		);
	}

	if (userId) {
		if (customSubDomain) {
			return NextResponse.rewrite(
				new URL(`/${customSubDomain}${urlExtension}`, req.url),
			);
		}

		if (pathName === "/sign-in") {
			return NextResponse.redirect(new URL("/agency/sign-in", req.url));
		}
	}

	if (pathName === "/") {
		return NextResponse.rewrite(new URL("/site", req.url));
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
