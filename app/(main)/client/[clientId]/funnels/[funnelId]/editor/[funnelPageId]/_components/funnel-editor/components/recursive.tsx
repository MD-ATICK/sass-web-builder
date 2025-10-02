import { Element } from "@/provider/editor/editor-provider";
import TextComponent from "./text";
import Container from "./container";
import Checkout from "./checkout";

export default function Recursive({ element }: { element: Element }) {
	switch (element.type) {
		case "text":
			return <TextComponent element={element} />;
		case "container":
			return <Container element={element} />;
		case "_body":
			return <Container element={element} />;
		case "paymentForm":
			return <Checkout element={element} />;
	}
}
