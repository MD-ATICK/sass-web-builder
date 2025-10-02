import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: "cdn.dribbble.com",
				protocol: "https",
			},
			{
				hostname: "ik5dbjfu9c.ufs.sh",
				protocol: "https",
			},
			{
				hostname: "img.clerk.com",
				protocol: "https",
			},
			{
				hostname: "utfs.io",
				protocol: "https",
			},
			{
				hostname: "files.stripe.com",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
