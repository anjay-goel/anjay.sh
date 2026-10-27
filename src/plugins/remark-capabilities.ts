import type { BlockContent, List, Paragraph, PhrasingContent, Root, RootContent } from "mdast";
import type { ContainerDirective, LeafDirective } from "mdast-util-directive";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface CapabilitiesLabels {
	reset: string;
	ok: string;
	fail: string;
	prompt: string;
}

interface Options {
	labels: CapabilitiesLabels;
}

type HNode = Paragraph;

function el(
	tagName: string,
	properties: Record<string, unknown>,
	children: (PhrasingContent | HNode)[] = [],
): HNode {
	return {
		type: "paragraph",
		data: { hName: tagName, hProperties: properties as never },
		children: children as PhrasingContent[],
	};
}

function text(value: string): PhrasingContent {
	return { type: "text", value };
}

interface Toggle {
	name: string;
	on: boolean;
}

interface Command {
	command: string;
	needs: string[];
	ok: string;
	fail: string;
}

function readToggles(list: List): Toggle[] {
	return list.children.map((item) => ({
		name: mdastToString(item).trim(),
		on: item.checked !== false,
	}));
}

function readCommand(node: LeafDirective): Command {
	const attrs = node.attributes ?? {};
	return {
		command: mdastToString(node).trim(),
		needs: (attrs.needs ?? "").split(/[\s,]+/).filter(Boolean),
		ok: attrs.ok ?? "",
		fail: attrs.fail ?? "",
	};
}

function isLabel(node: RootContent | BlockContent): node is Paragraph {
	return node.type === "paragraph" && Boolean(node.data && "directiveLabel" in node.data);
}

function build(node: ContainerDirective, labels: CapabilitiesLabels): HNode {
	const attrs = node.attributes ?? {};
	const labelNode = node.children.find(isLabel);
	const title = labelNode ? mdastToString(labelNode) : "";
	const toggles = node.children.filter((c): c is List => c.type === "list").flatMap(readToggles);
	const commands = node.children
		.filter(
			(c): c is LeafDirective =>
				(c as RootContent).type === "leafDirective" && (c as LeafDirective).name === "command",
		)
		.map(readCommand);
	const enabled = new Set(toggles.filter((t) => t.on).map((t) => t.name));

	const switches = toggles.map((t) =>
		el(
			"button",
			{
				type: "button",
				role: "switch",
				ariaChecked: String(t.on),
				className: ["caps-switch"],
				dataCap: t.name,
				dataDefault: String(t.on),
			},
			[
				el("span", { className: ["caps-track"], ariaHidden: "true" }, [
					el("span", { className: ["caps-thumb"] }),
				]),
				el("span", { className: ["caps-name"] }, [text(t.name)]),
			],
		),
	);

	const outputs = commands.map((c) => {
		const passes = c.needs.every((n) => enabled.has(n));
		return el("div", { className: ["caps-cmd"], dataNeeds: c.needs.join(" ") }, [
			el("span", { className: ["caps-line"] }, [
				el("span", { className: ["caps-prompt"] }, [text(labels.prompt)]),
				text(` ${c.command}`),
			]),
			el(
				"span",
				{
					className: ["caps-result"],
					dataState: passes ? "ok" : "fail",
					dataOk: `${labels.ok} ${c.ok}`,
					dataFail: `${labels.fail} ${c.fail}`,
				},
				[text(passes ? `${labels.ok} ${c.ok}` : `${labels.fail} ${c.fail}`)],
			),
		]);
	});

	const box = el("div", { className: ["caps-box"] }, [
		el("div", { className: ["caps-head"] }, [
			el("span", { className: ["caps-title"] }, [text(title)]),
			el("button", { type: "button", className: ["caps-reset"], dataCapsReset: "" }, [
				text(labels.reset),
			]),
		]),
		el("div", { className: ["caps-body"] }, [
			el("div", { className: ["caps-switches"] }, [
				...(attrs.label ? [el("p", { className: ["caps-label"] }, [text(attrs.label)])] : []),
				...switches,
			]),
			el("div", { className: ["caps-output"], ariaLive: "polite" }, outputs),
		]),
	]);

	const children = [box];
	if (attrs.caption) children.push(el("figcaption", {}, [text(attrs.caption)]));
	return el("figure", { className: ["caps"], dataCaps: "" }, children);
}

export const remarkCapabilities: Plugin<[Options], Root> =
	({ labels }) =>
	(tree, file) => {
		let found = false;
		visit(tree, "containerDirective", (node, index, parent) => {
			if (node.name !== "capabilities" || !parent || index === undefined) return;
			found = true;
			parent.children[index] = build(node, labels) as RootContent as never;
		});
		const astro = file.data.astro as { frontmatter?: Record<string, unknown> } | undefined;
		if (found && astro?.frontmatter) astro.frontmatter.hasCapabilities = true;
	};
