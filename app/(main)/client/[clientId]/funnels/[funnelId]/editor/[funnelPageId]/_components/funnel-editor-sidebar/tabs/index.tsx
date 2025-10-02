import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";
import React from "react";

const TabList = () => {
	return (
		<TabsList className='flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-2'>
			<TabsTrigger
				value='Settings'
				className=' h-8 w-8 p-0  hover:bg-gray-800 aspect-square'
			>
				<SettingsIcon />
			</TabsTrigger>

			<TabsTrigger
				value='Components'
				className=' hover:bg-gray-800 aspect-square  h-8 w-8 p-0'
			>
				<Plus />
			</TabsTrigger>

			<TabsTrigger
				value='Layers'
				className=' h-8 w-8 p-0  hover:bg-gray-800 aspect-square'
			>
				<SquareStackIcon />
			</TabsTrigger>
			<TabsTrigger
				value='Media'
				className=' h-8 w-8 p-0  hover:bg-gray-800 aspect-square'
			>
				<Database />
			</TabsTrigger>
		</TabsList>
	);
};

export default TabList;
