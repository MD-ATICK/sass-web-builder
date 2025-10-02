"use client";
import { ButtonTypes } from "@/constants";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { EditorAction } from "./editor-actions";
import { FunnelPage } from "@prisma/client";

export type DeviceTypes = "Desktop" | "Tablet" | "Mobile";

export type Element = {
	id: string;
	name: string;
	styles: React.CSSProperties;
	type: ButtonTypes;
	content: Element[] | { innerText?: string; href?: string };
};

export type Editor = {
	elements: Element[];
	selectedElement: Element;
	device: DeviceTypes;
	liveMode: boolean;
	previewMode: boolean;
	funnelPageId: string;
};

export type historyState = {
	history: Editor[];
	currentIndex: number;
};

export type EditorState = {
	editor: Editor;
	history: historyState;
};

export const initialEditor: Editor = {
	device: "Desktop",
	liveMode: false,
	previewMode: false,
	funnelPageId: "",
	elements: [
		{
			id: "_body",
			name: "Body",
			content: [],
			styles: {},
			type: "_body",
		},
	],
	selectedElement: {
		id: "_body",
		name: "Body",
		content: [],
		styles: { height: "400px", width: "100%" },
		type: "_body",
	},
};

export const historyState: historyState = {
	history: [initialEditor],
	currentIndex: 0,
};

export const initialEditorState: EditorState = {
	editor: initialEditor,
	history: historyState,
};

const addElement = (elements: Element[], action: EditorAction): Element[] => {
	if (action.type !== "ADD_ELEMENT") throw new Error("Invalid action type");

	return elements.map(element => {
		if (
			element.id === action.payload.containerId &&
			Array.isArray(element.content)
		) {
			return {
				...element,
				content: [...element.content, action.payload.elementDetails],
			};
		} else if (Array.isArray(element.content) && element.content.length > 0) {
			return {
				...element,
				content: addElement(element.content, action),
			};
		} else {
			return element;
		}
	});
};
const updateElement = (
	elements: Element[],
	action: EditorAction,
): Element[] => {
	if (action.type !== "UPDATE_ELEMENT") throw new Error("Invalid action type");

	return elements.map(element => {
		if (
			element.id === action.payload.elementDetails.id &&
			Array.isArray(element.content)
		) {
			return {
				...element,
				...action.payload.elementDetails,
			};
		} else if (Array.isArray(element.content) && element.content.length > 0) {
			return {
				...element,
				content: updateElement(element.content, action),
			};
		} else if (element.id === action.payload.elementDetails.id) {
			return {
				...element,
				...action.payload.elementDetails,
			};
		} else {
			return element;
		}
	});
};

const deleteElement = (
	elements: Element[],
	action: EditorAction,
): Element[] => {
	if (action.type !== "DELETE_ELEMENT") {
		throw new Error("Invalid action type");
	}

	return elements
		.filter(element => element.id !== action.payload.elementDetails.id) // filter out the deleted element
		.map(element => {
			// if element has nested children
			if (Array.isArray(element.content)) {
				return {
					...element,
					content: deleteElement(element.content, action), // recurse and update children
				};
			}
			return element;
		});
};

const editorReducer = (
	state: EditorState = initialEditorState,
	action: EditorAction,
): EditorState => {
	console.log("calling", action);

	switch (action.type) {
		case "ADD_ELEMENT":
			const newEditor = {
				...state.editor,
				elements: addElement(state.editor.elements, action),
			};

			const newHistory = [
				...state.history.history.slice(0, state.history.currentIndex + 1),
				{ ...state.editor },
			];

			return {
				editor: newEditor,
				history: {
					history: newHistory,
					currentIndex: state.history.currentIndex + 1,
				},
			};

		case "UPDATE_ELEMENT":
			const updatedEditor = {
				...state.editor,
				elements: updateElement(state.editor.elements, action),
			};

			const updatedHistory = [
				...state.history.history.slice(0, state.history.currentIndex + 1),
				{ ...state.editor },
			];

			return {
				editor: {
					...updatedEditor,
					selectedElement: action.payload.elementDetails,
				},
				history: {
					history: updatedHistory,
					currentIndex: state.history.currentIndex + 1,
				},
			};

		case "DELETE_ELEMENT":
			const deletedEditor = {
				...state.editor,
				elements: deleteElement(state.editor.elements, action),
			};

			const deletedHistory = [
				...state.history.history.slice(0, state.history.currentIndex + 1),
				{ ...state.editor },
			];

			return {
				editor: deletedEditor,
				history: {
					history: deletedHistory,
					currentIndex: state.history.currentIndex + 1,
				},
			};

		case "CHANGE_CLICKED_ELEMENT":
			return {
				...state,
				editor: {
					...state.editor,
					selectedElement: action.payload.elementDetails || {
						id: "",
						name: "",
						content: [],
						styles: {},
						type: null,
					},
				},
				history: {
					currentIndex: state.history.currentIndex + 1,
					history: [
						...state.history.history.slice(0, state.history.currentIndex + 1),
						{ ...state.editor },
					],
				},
			};

		case "CHANGE_DEVICE":
			return {
				...state,
				editor: {
					...state.editor,
					device: action.payload.device,
				},
			};
		case "TOGGLE_PREVIEW_MODE":
			return {
				...state,
				editor: {
					...state.editor,
					previewMode: !state.editor.previewMode,
				},
			};
		case "TOGGLE_LIVE_MODE":
			return {
				...state,
				editor: {
					...state.editor,
					liveMode: !state.editor.liveMode,
				},
			};
		case "REDO":
			if (state.history.currentIndex < state.history.history.length - 1) {
				return {
					...state,
					editor: state.history.history[state.history.currentIndex + 1],
					history: {
						...state.history,
						currentIndex: state.history.currentIndex + 1,
					},
				};
			}
		case "UNDO":
			if (state.history.currentIndex > 0) {
				return {
					...state,
					editor: state.history.history[state.history.currentIndex - 1],
					history: {
						...state.history,
						currentIndex: state.history.currentIndex - 1,
					},
				};
			} else {
				return state;
			}
		case "LOAD_DATA":
			return {
				...initialEditorState,
				editor: {
					...initialEditorState.editor,
					elements:
						action.payload.elements || initialEditorState.editor.elements,
					liveMode: !!action.payload.withLive,
				},
			};
		case "SET_FUNNEL_PAGE_ID":
			console.log(action.payload.funnelPageId);
			if (!action.payload.funnelPageId) {
				return state;
			}

			const setFunnelEditor = {
				...state.editor,
				funnelPageId: action.payload.funnelPageId,
			};

			return {
				editor: setFunnelEditor,
				history: {
					history: [
						...state.history.history.slice(0, state.history.currentIndex + 1),
						{ ...state.editor },
					],
					currentIndex: state.history.currentIndex + 1,
				},
			};
		default:
			return state;
	}
};

export type EditorContextData = {
	device: DeviceTypes;
	previewMode: boolean;
	setPreviewMode: (previewMode: boolean) => void;
	setDevice: (device: DeviceTypes) => void;
};

type EditorContextType = {
	state: EditorState;
	dispatch: React.Dispatch<EditorAction>;
	clientId: string;
	funnelId: string;
	funnelPageId: string;
	pageDetails: FunnelPage | null;
	liveMode?: boolean;
};

const EditorContext = createContext<EditorContextType>({
	state: initialEditorState,
	dispatch: () => {},
	clientId: "",
	funnelId: "",
	funnelPageId: "",
	pageDetails: null,
});

type Props = {
	children: React.ReactNode;
	clientId: string;
	funnelId: string;
	pageDetails: FunnelPage | null;
	funnelPageId: string;
	liveMode?: boolean;
};

const EditorProvider = (props: Props) => {
	const [state, dispatch] = useReducer(editorReducer, initialEditorState);

	useEffect(() => {
		dispatch({
			type: "LOAD_DATA",
			payload: {
				elements:
					JSON.parse(props.pageDetails?.content || "[]").length !== 0
						? JSON.parse(props.pageDetails?.content || "[]")
						: initialEditor.elements,
				withLive: false,
			},
		});
		const elements =
			JSON.parse(props.pageDetails?.content || "[]").length !== 0
				? JSON.parse(props.pageDetails?.content || "[]")
				: (initialEditor.elements as Element[]);
		if (elements.length > 0) {
			dispatch({
				type: "CHANGE_CLICKED_ELEMENT",
				payload: {
					elementDetails: elements[0],
				},
			});
		}
	}, [props.pageDetails]);

	return (
		<EditorContext.Provider
			value={{
				state,
				dispatch,
				clientId: props.clientId,
				funnelId: props.funnelId,
				pageDetails: props.pageDetails,
				funnelPageId: props.funnelPageId,
				liveMode: props.liveMode,
			}}
		>
			{props.children}
		</EditorContext.Provider>
	);
};

export default EditorProvider;

export const useEditor = () => {
	const context = useContext(EditorContext);

	if (!context) {
		throw new Error("useEditor must be used within a EditorProvider");
	}

	return context;
};
