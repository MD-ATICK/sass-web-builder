"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditor } from "@/provider/editor/editor-provider";
import React from "react";
import { motion } from "framer-motion";
import FunnelPagePlaceholder from "@/components/funnel-page-placeholder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlignCenter,
	AlignHorizontalJustifyCenterIcon,
	AlignHorizontalJustifyEndIcon,
	AlignHorizontalJustifyStart,
	AlignHorizontalSpaceAround,
	AlignHorizontalSpaceBetween,
	AlignLeft,
	AlignRight,
	AlignVerticalJustifyCenter,
	AlignVerticalJustifyStart,
	ChevronsLeftRightIcon,
	CircleDashed,
	Eye,
	LucideImageDown,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import EditorInput from "./EditorInput";
import EditorSlider from "./EditorSlider";

export default function SettingsTab() {
	const { state, dispatch } = useEditor();

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const id = e.target.id;

		dispatch({
			type: "UPDATE_ELEMENT",
			payload: {
				elementDetails: {
					...state.editor.selectedElement,
					content: {
						...state.editor.selectedElement.content,
						[id]: value,
					},
				},
			},
		});
	};

	const handleStyleChange = (target: string, value: string) => {
		dispatch({
			type: "UPDATE_ELEMENT",
			payload: {
				elementDetails: {
					...state.editor.selectedElement,
					styles: {
						...state.editor.selectedElement.styles,
						[target]: value,
					},
				},
			},
		});
	};

	const selectElementStyle = state.editor.selectedElement.styles;

	return (
		<div className=' grid gap-2 py-4 overflow-hidden '>
			<Accordion
				type='multiple'
				defaultValue={[
					"Typography",
					"Custom",
					"Dimensions",
					"Decorations",
					"Flexbox",
				]}
			>
				{/* Custom */}
				<AccordionItem value='Custom' className=' px-4'>
					<AccordionTrigger>
						<div className='flex items-center gap-3'>
							<CircleDashed size={16} className=' text-emerald-600' /> Custom
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className=' space-y-4'>
							<Label>Link</Label>
							<Input
								id='href'
								disabled={
									!(
										state.editor.selectedElement.type === "link" &&
										!Array.isArray(state.editor.selectedElement.content)
									)
								}
								onChange={handleValueChange}
								placeholder='https://www.example.com'
								defaultValue={
									state.editor.selectedElement.type === "link" &&
									!Array.isArray(state.editor.selectedElement.content)
										? state.editor.selectedElement.content.href
										: ""
								}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Typography */}
				<AccordionItem value='Typography' className=' px-4'>
					<AccordionTrigger>
						<div className='flex items-center gap-3'>
							<CircleDashed size={16} className=' text-emerald-600' />{" "}
							Typography
						</div>
					</AccordionTrigger>
					<AccordionContent className=' space-y-4'>
						{/* Color */}
						<EditorInput
							target='color'
							name='Color'
							defaultValue={selectElementStyle.color}
						/>

						{/*  Text Align  */}
						<div className=' space-y-2'>
							<Label className=' text-xs'>Text Align</Label>
							<Tabs
								onValueChange={value => handleStyleChange("textAlign", value)}
							>
								<TabsList>
									<TabsTrigger value='left'>
										<AlignLeft />
									</TabsTrigger>
									<TabsTrigger value='center'>
										<AlignCenter />
									</TabsTrigger>
									<TabsTrigger value='right'>
										<AlignRight />
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/* Font Family */}
						<div className=' space-y-2'>
							<Label className=' text-xs'>Font Family</Label>
							<Input
								id='fontFamily'
								placeholder='Arial, sans-serif'
								onChange={e => handleStyleChange(e.target.id, e.target.value)}
								defaultValue={state.editor.selectedElement.styles.fontFamily}
							/>
						</div>

						{/* Font Weight */}
						<div className=' space-y-2'>
							<Label className=' text-xs'>Font Weight</Label>
							<Select
								value={state.editor.selectedElement.styles.fontWeight as string}
								onValueChange={value => handleStyleChange("fontWeight", value)}
							>
								<SelectTrigger className=' w-full'>
									<SelectValue placeholder='Select Font Weight' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='bold'>Bold</SelectItem>
									<SelectItem value='normal'>Regular</SelectItem>
									<SelectItem value='light'>Light</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Font Size */}
						<div className=' space-y-2'>
							<Label className=' text-xs'>Font Size</Label>
							<Input
								id='fontSize'
								type='number'
								placeholder='12px'
								onChange={e =>
									handleStyleChange(e.target.id, `${e.target.value}px`)
								}
								defaultValue={state.editor.selectedElement.styles.fontSize}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Dimensions */}
				<AccordionItem value='Dimensions' className=' px-4'>
					<AccordionTrigger>
						<div className='flex items-center gap-3'>
							<CircleDashed size={16} className=' text-emerald-600' />{" "}
							Dimensions
						</div>
					</AccordionTrigger>
					<AccordionContent className=' space-y-6'>
						{/* Height and Weight */}
						<div className=' flex items-center justify-between gap-3'>
							<EditorInput
								target='height'
								defaultValue={Number(
									selectElementStyle.height?.toString().split("px")[0],
								)}
								px
							/>
							<EditorInput
								target='width'
								defaultValue={selectElementStyle.width as string}
								px
							/>
						</div>

						{/* Margin */}
						<div className=' space-y-3'>
							<Label>Margin</Label>
							<div className=' grid grid-cols-2 items-center justify-between gap-3 '>
								<EditorInput
									target='marginTop'
									name='Top'
									defaultValue={selectElementStyle.marginTop as string}
									px
								/>
								<EditorInput
									target='marginLeft'
									name='Left'
									defaultValue={selectElementStyle.marginLeft as string}
									px
								/>
								<EditorInput
									target='marginRight'
									name='Right'
									defaultValue={selectElementStyle.marginRight as string}
									px
								/>
								<EditorInput
									target='marginBottom'
									name='Bottom'
									defaultValue={selectElementStyle.marginBottom as string}
									px
								/>
							</div>
						</div>

						{/* Padding */}
						<div className=' space-y-3'>
							<Label>Padding</Label>
							<div className=' grid grid-cols-2 items-center justify-between gap-3 '>
								<EditorInput
									target='paddingTop'
									name='Top'
									defaultValue={selectElementStyle.paddingTop as string}
									px
								/>
								<EditorInput
									target='paddingLeft'
									name='Left'
									defaultValue={selectElementStyle.paddingLeft as string}
									px
								/>
								<EditorInput
									target='paddingRight'
									name='Right'
									defaultValue={selectElementStyle.paddingRight as string}
									px
								/>
								<EditorInput
									target='paddingBottom'
									name='Bottom'
									defaultValue={selectElementStyle.paddingBottom as string}
									px
								/>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Decorations */}
				<AccordionItem value='Decorations' className=' px-4'>
					<AccordionTrigger>
						<div className='flex items-center gap-3'>
							<CircleDashed size={16} className=' text-emerald-600' />{" "}
							Decorations
						</div>
					</AccordionTrigger>
					<AccordionContent className=' space-y-4'>
						{/* Opacity */}
						<EditorSlider
							target='opacity'
							name='Opacity'
							defaultPercent={100}
							defaultValue={[Number(selectElementStyle.opacity) || 100]}
						/>

						{/* Opacity */}
						<EditorSlider
							target='borderRadius'
							name='Border Radius'
							defaultPercent={0}
							defaultValue={[Number(selectElementStyle.borderRadius) || 0]}
						/>

						{/* Background Color */}
						<EditorInput
							target='backgroundColor'
							name='Background Color'
							defaultValue={selectElementStyle.backgroundColor}
						/>

						{/* Background Image */}
						<div className=' space-y-2 '>
							<Label className=' text-xs'>Background Image</Label>
							{state.editor.selectedElement.styles.backgroundImage && (
								<div className=' relative h-40'>
									<motion.div
										initial={{
											height: "0px",
										}}
										animate={{
											height: "160px",
										}}
										className=' w-full  h-40  absolute top-0 left-0 z-50 rounded-sm object-contain bg-contain'
										style={{
											backgroundImage:
												state.editor.selectedElement.styles.backgroundImage,
										}}
									></motion.div>
									<div className=' absolute top-0 left-0'>
										<FunnelPagePlaceholder />
									</div>
								</div>
							)}
							<Input
								id='backgroundImage'
								placeholder='url()'
								className=''
								onChange={e =>
									handleStyleChange("backgroundImage", e.target.value)
								}
								defaultValue={
									state.editor.selectedElement.styles.backgroundImage
								}
							/>
						</div>

						{/* Image Position */}
						<div className='flex flex-col gap-2'>
							<Label className='text-muted-foreground'>Image Position</Label>
							<Tabs
								onValueChange={e => handleStyleChange("backgroundSize", e)}
								value={state.editor.selectedElement.styles.backgroundSize?.toString()}
							>
								<TabsList className='flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4'>
									<TabsTrigger
										value='cover'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<ChevronsLeftRightIcon size={18} />
									</TabsTrigger>
									<TabsTrigger
										value='contain'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<AlignVerticalJustifyCenter size={22} />
									</TabsTrigger>
									<TabsTrigger
										value='auto'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<LucideImageDown size={18} />
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* FlexBox */}
				<AccordionItem value='Flexbox' className=' px-4'>
					<AccordionTrigger>
						<div className='flex items-center gap-3'>
							<CircleDashed size={16} className=' text-emerald-600' /> FlexBox
						</div>
					</AccordionTrigger>
					<AccordionContent className=' space-y-4'>
						{/* Justify Content */}
						<div className=' space-y-3'>
							<Label className='text-muted-foreground'>Justify Content</Label>
							<Tabs
								onValueChange={e => handleStyleChange("justifyContent", e)}
								value={state.editor.selectedElement.styles.justifyContent}
							>
								<TabsList className='flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4'>
									<TabsTrigger
										value='space-between'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<AlignHorizontalSpaceBetween size={18} />
									</TabsTrigger>
									<TabsTrigger
										value='space-evenly'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<AlignHorizontalSpaceAround size={18} />
									</TabsTrigger>
									<TabsTrigger
										value='center'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<AlignHorizontalJustifyCenterIcon size={18} />
									</TabsTrigger>
									<TabsTrigger
										value='start'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800 '
									>
										<AlignHorizontalJustifyStart size={18} />
									</TabsTrigger>
									<TabsTrigger
										value='end'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800 '
									>
										<AlignHorizontalJustifyEndIcon size={18} />
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/* Align Items */}
						<div>
							<Label className='text-muted-foreground'>Align Items</Label>
							<Tabs
								onValueChange={e => handleStyleChange("alignItems", e)}
								value={state.editor.selectedElement.styles.alignItems}
							>
								<TabsList className='flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4'>
									<TabsTrigger
										value='center'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800'
									>
										<AlignVerticalJustifyCenter size={18} />
									</TabsTrigger>
									<TabsTrigger
										value='normal'
										className='w-10 h-10 p-0 data-[state=active]:bg-gray-800 '
									>
										<AlignVerticalJustifyStart size={18} />
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>

						{/*  */}
						<div className='flex items-center gap-2 py-2'>
							<Input
								className='h-4 w-4 cursor-pointer'
								placeholder='px'
								type='checkbox'
								id='display'
								onChange={va =>
									handleStyleChange(
										"display",
										va.target.checked ? "flex" : "block",
									)
								}
							/>
							<Label className='text-muted-foreground'>Flex Display</Label>
						</div>

						{/* Direction */}

						<EditorInput
							target='flexDirection'
							name='Flex Direction'
							defaultValue={selectElementStyle.flexDirection}
							px
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			{/* <p>Editor Contents</p>
			<pre>{JSON.stringify(state.editor.elements, null, 4)}</pre> */}
			<div className=' px-4 space-y-4 overflow-auto'>
				<div className=' flex items-center gap-2'>
					{" "}
					<Eye size={16} className=' text-emerald-500' /> View Selected Element
				</div>
				<pre className=' text-xs'>
					{JSON.stringify(state.editor.selectedElement, null, 4)}
				</pre>
			</div>
		</div>
	);
}
