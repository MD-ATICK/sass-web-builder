import { DeviceTypes, Element } from "./editor-provider";

export type EditorAction =
	| {
			type: "ADD_ELEMENT";
			payload: {
				containerId: string;
				elementDetails: Element;
			};
	  }
	| {
			type: "UPDATE_ELEMENT";
			payload: {
				elementDetails: Element;
			};
	  }
	| {
			type: "DELETE_ELEMENT";
			payload: {
				elementDetails: Element;
			};
	  }
	| {
			type: "CHANGE_CLICKED_ELEMENT";
			payload: {
				elementDetails?: Element;
			};
	  }
	| {
			type: "CHANGE_DEVICE";
			payload: {
				device: DeviceTypes;
			};
	  }
	| {
			type: "TOGGLE_PREVIEW_MODE";
	  }
	| {
			type: "TOGGLE_LIVE_MODE";
			payload?: {
				value: boolean;
			};
	  }
	| { type: "REDO" }
	| { type: "UNDO" }
	| {
			type: "LOAD_DATA";
			payload: {
				elements: Element[];
				withLive: boolean;
			};
	  }
	| {
			type: "SET_FUNNEL_PAGE_ID";
			payload: {
				funnelPageId: string;
			};
	  };
