import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FormatValue } from "@/lib/helper";
import { getAgencyDashboardData } from "@/lib/queries/dashboard";
import Link from "next/link";
import React from "react";
import { AreaChart } from "@tremor/react";

export default async function page({
	params,
}: {
	params: Promise<{ agencyId: string }>;
}) {
	const { agencyId } = await params;
	const data = await getAgencyDashboardData(agencyId);

	if ("error" in data) return <div>{data.error}</div>;

	if ("notHaveConnectAccountId" in data)
		return (
			<div className=' py-10 w-full flex justify-center items-center'>
				<div className='  p-4 border rounded-md'>
					<h2 className=' font-semibold text-lg'>Connect to Stripe Account</h2>
					<p className=' text-muted-foreground text-sm'>
						{" "}
						Please connect to your Stripe account{" "}
					</p>
					<br />
					<Link href={`/agency/${agencyId}/launchpad`}>
						<Button variant={"outline"} size={"sm"}>
							Go to LaunchPad
						</Button>
					</Link>
				</div>
			</div>
		);

	return (
		<div className=' p-8 space-y-8'>
			<div className=' grid grid-cols-1 lg:grid-cols-4 gap-6'>
				{/* Income */}
				<div className=' p-4 border rounded-lg'>
					<p>Income</p>
					<h1 className=' text-4xl font-semibold'>
						{FormatValue(data.netIncome)}
					</h1>
					<p className=' text-sm text-muted-foreground'>
						For the year {data.currentYear}
					</p>
					<br />
					<p className=' text-muted-foreground text-xs'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
						magnam repellat nesciunt eius similique error. Lorem ipsum dolor sit
						amet.
					</p>
				</div>
				{/* Pending Income */}
				<div className=' p-4 border rounded-lg'>
					<p>Pending Income</p>
					<h1 className=' text-4xl font-semibold'>
						{FormatValue(data.pendingIncome)}
					</h1>
					<p className=' text-sm text-muted-foreground'>
						For the year {data.currentYear}
					</p>
					<br />
					<p className=' text-muted-foreground text-xs'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
						magnam repellat nesciunt eius similique error. Lorem ipsum dolor sit
						amet.
					</p>
				</div>
				{/* Active Clients */}
				<div className=' p-4 border rounded-lg'>
					<p>Active Clients</p>
					<h1 className=' text-4xl font-semibold'>{data.activeClients}</h1>
					<p className=' text-sm text-muted-foreground'>
						For the year {data.currentYear}
					</p>
					<br />
					<p className=' text-muted-foreground text-xs'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
						magnam repellat nesciunt eius similique error. Lorem ipsum dolor sit
						amet.
					</p>
				</div>

				{/* AGency Goal */}
				<div className=' p-4 border rounded-lg'>
					<p>Active Clients</p>
					<p className=' text-muted-foreground text-xs'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
						magnam repellat nesciunt eius similique error. Lorem ipsum dolor sit
						amet.
					</p>
					<br />
					<div className='flex text-sm items-center justify-between py-2'>
						<p className=' text-muted-foreground'>
							Current :{" "}
							<span className=' font-semibold text-emerald-500 text-lg'>
								{data.activeClients}
							</span>
						</p>
						<p className=' text-muted-foreground'>
							Goal :{" "}
							<span className=' font-semibold text-emerald-500 text-lg'>
								{data.agency.goal}
							</span>
						</p>
					</div>
					<Progress
						value={(data.activeClients / data.agency.goal) * 100}
						className=' h-4'
					/>
				</div>
			</div>

			<div className=' grid grid-cols-1   gap-6 h-[500px]'>
				<div className=' border rounded-lg p-4 space-y-4 w-full'>
					<p>Transaction History</p>
					<AreaChart
						className=' text-sm stroke-primary h-80'
						data={[
							{
								created: new Date().getMonth(),
								amount_total: 100,
							},
							{
								created: new Date().getMonth() + 1,
								amount_total: 1050,
							},
							{
								created: new Date().getMonth() + 2,
								amount_total: 10,
							},
							{
								created: new Date().getMonth(),
								amount_total: 300,
							},
							{
								created: new Date().getMonth() + 1,
								amount_total: 700,
							},
							{
								created: new Date().getMonth() + 2,
								amount_total: 20,
							},
						]}
						index='created'
						categories={["amount_total"]}
						colors={["primary"]}
						yAxisWidth={30}
						showAnimation
					/>
				</div>
			</div>
		</div>
	);
}
