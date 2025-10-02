"use client";
import { ProgressCircle } from "@tremor/react";
import React from "react";

export default function SuccessRateCircle({ value }: { value: number }) {
	return (
		<div className=' border rounded-lg p-4 space-y-4'>
			<p>Conversions</p>
			<ProgressCircle value={value} radius={120} strokeWidth={25} showAnimation>
				hi
			</ProgressCircle>
			<br />
			<br />
			<div>
				<p>Closing Rate</p>
				<p className=' text-muted-foreground text-sm'>
					{" "}
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis,
					harum recusandae? Numquam officiis minus ducimus dolores tempora
					deserunt. Corporis, earum!
				</p>
			</div>
		</div>
	);
}
