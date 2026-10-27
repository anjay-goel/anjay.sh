import type { ExpressiveCodePlugin } from "astro-expressive-code";
import type { Element, ElementContent } from "hast";
import { h, s } from "hastscript";

interface CodeHeaderLabels {
	title: (language: string) => string;
	copy: string;
	copyCode: string;
	copied: string;
}

function copyIcon(): Element {
	return s(
		"svg",
		{
			"aria-hidden": "true",
			className: ["copy-icon"],
			width: 13,
			height: 13,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 1.75,
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		[
			s("rect", { x: 8, y: 8, width: 12, height: 12, rx: 2 }),
			s("path", { d: "M16 8V6a2 2 0 0 0 -2 -2H6a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" }),
		],
	);
}

function hasClass(node: ElementContent, name: string): node is Element {
	if (node.type !== "element") return false;
	const value = node.properties.className;
	return Array.isArray(value) && value.includes(name);
}

export function pluginCodeHeader(labels: CodeHeaderLabels): ExpressiveCodePlugin {
	return {
		name: "Code header",
		hooks: {
			preprocessCode: ({ codeBlock }) => {
				const { props } = codeBlock;
				if (props.title === undefined && props.frame !== "none")
					props.title = labels.title(codeBlock.language);
			},
			postprocessRenderedBlock: ({ renderData }) => {
				const copy = renderData.blockAst.children.find((child) => hasClass(child, "copy"));
				const button =
					copy?.type === "element"
						? copy.children.find((child) => child.type === "element" && child.tagName === "button")
						: undefined;
				if (button?.type !== "element") return;
				button.properties.title = labels.copyCode;
				button.properties.dataCopied = labels.copied;
				button.children.push(copyIcon(), h("span", { className: ["copy-label"] }, labels.copy));
			},
		},
	};
}
