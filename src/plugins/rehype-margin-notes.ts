import type { Element, ElementContent, Root, RootContent } from "hast";
import type { Plugin } from "unified";

type Node = Root | RootContent;

const NOTE_HOSTS = new Set(["p", "li"]);
const BLOCKERS = new Set([
	"td",
	"th",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"figcaption",
	"summary",
	"a",
]);

function isElement(node: Node | undefined): node is Element {
	return node?.type === "element";
}

function isBlank(node: ElementContent): boolean {
	return node.type === "text" && node.value.trim() === "";
}

function findFootnotes(
	node: Node,
	parent?: Root | Element,
): { section: Element; parent: Root | Element } | undefined {
	if (isElement(node) && node.properties?.dataFootnotes !== undefined && parent)
		return { section: node, parent };
	if (node.type !== "root" && node.type !== "element") return undefined;
	for (const child of node.children) {
		const found = findFootnotes(child, node);
		if (found) return found;
	}
	return undefined;
}

function noteContent(item: Element): ElementContent[] | undefined {
	const blocks = item.children.filter((c) => !isBlank(c));
	if (!blocks.length || !blocks.every((b) => isElement(b) && b.tagName === "p")) return undefined;
	const content: ElementContent[] = [];
	(blocks as Element[]).forEach((p, i) => {
		const kept = p.children.filter(
			(c) => !(isElement(c) && c.properties?.dataFootnoteBackref !== undefined),
		);
		while (kept.length && isBlank(kept[kept.length - 1] as ElementContent)) kept.pop();
		const last = kept[kept.length - 1];
		if (last?.type === "text") kept[kept.length - 1] = { ...last, value: last.value.trimEnd() };
		if (i > 0) content.push({ type: "text", value: " " });
		content.push(...kept);
	});
	return content;
}

function refTarget(sup: Element): string | undefined {
	if (sup.tagName !== "sup") return undefined;
	const link = sup.children.find(isElement);
	if (!link || link.properties?.dataFootnoteRef === undefined) return undefined;
	const href = String(link.properties.href ?? "");
	return href.startsWith("#") ? href.slice(1) : undefined;
}

function note(label: string, content: ElementContent[], variant: "side" | "end"): Element {
	return {
		type: "element",
		tagName: "span",
		properties: {
			className: ["margin-note", `margin-note-${variant}`],
			role: "note",
			...(variant === "end" ? { dataPagefindIgnore: "" } : {}),
		},
		children: [
			{
				type: "element",
				tagName: "span",
				properties: { className: ["margin-note-num"] },
				children: [{ type: "text", value: label }],
			},
			...structuredClone(content),
		],
	};
}

function toText(node: ElementContent): string {
	if (node.type === "text") return node.value;
	return isElement(node) ? node.children.map(toText).join("") : "";
}

function plainRef(label: string): Element {
	return {
		type: "element",
		tagName: "sup",
		properties: { className: ["note-ref"], ariaHidden: "true" },
		children: [{ type: "text", value: label }],
	};
}

export const rehypeMarginNotes: Plugin<[], Root> = () => (tree) => {
	const found = findFootnotes(tree);
	if (!found) return;
	const list = found.section.children.find((c): c is Element => isElement(c) && c.tagName === "ol");
	if (!list) return;

	const items = new Map<string, { item: Element; content: ElementContent[] }>();
	for (const item of list.children) {
		if (!isElement(item) || item.tagName !== "li") continue;
		const content = noteContent(item);
		if (content) items.set(String(item.properties?.id ?? ""), { item, content });
	}

	const refs: {
		sup: Element;
		parent: Root | Element;
		host: Element | undefined;
		target: string;
		label: string;
	}[] = [];
	const walk = (node: Root | Element, host: Element | undefined, blocked: boolean) => {
		for (const child of node.children) {
			if (!isElement(child) || child === found.section) continue;
			const target = refTarget(child);
			if (target) {
				refs.push({
					sup: child,
					parent: node,
					host: blocked ? undefined : host,
					target,
					label: toText(child),
				});
				continue;
			}
			const isHost = NOTE_HOSTS.has(child.tagName);
			walk(child, isHost ? child : host, isHost ? false : blocked || BLOCKERS.has(child.tagName));
		}
	};
	walk(tree, undefined, false);

	const converted = new Set<string>();
	for (const ref of refs) {
		const entry = items.get(ref.target);
		if (!entry) continue;
		const index = ref.parent.children.indexOf(ref.sup);
		if (converted.has(ref.target)) {
			ref.parent.children.splice(index, 1, plainRef(ref.label));
			continue;
		}
		if (!ref.host) {
			items.delete(ref.target);
			continue;
		}
		converted.add(ref.target);
		ref.parent.children.splice(
			index,
			1,
			plainRef(ref.label),
			note(ref.label, entry.content, "side"),
		);
		ref.host.children.push(note(ref.label, entry.content, "end"));
	}

	if (!converted.size) return;
	list.children = list.children.filter(
		(c) => !(isElement(c) && converted.has(String(c.properties?.id ?? ""))),
	);
	if (!list.children.some(isElement)) {
		found.parent.children = found.parent.children.filter(
			(c) => c !== found.section,
		) as typeof found.parent.children;
	}
};
