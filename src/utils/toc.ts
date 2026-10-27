import type { MarkdownHeading } from "astro";

export interface TocItem {
	slug: string;
	text: string;
	children: TocItem[];
}

export const MIN_TOC_ENTRIES = 3;

export function buildToc(headings: MarkdownHeading[]): TocItem[] {
	const usable = headings.filter((h) => h.depth >= 1 && h.depth <= 4 && h.slug && h.text.trim());
	const depths = [...new Set(usable.map((h) => h.depth))].sort((a, b) => a - b);
	const [top, sub] = depths;
	if (top === undefined) return [];
	const items: TocItem[] = [];
	for (const h of usable) {
		const item: TocItem = { slug: h.slug, text: h.text.trim(), children: [] };
		if (h.depth === top) items.push(item);
		else if (h.depth === sub) {
			const parent = items.at(-1);
			if (parent) parent.children.push(item);
			else items.push(item);
		}
	}
	return items;
}

export function countToc(items: TocItem[]): number {
	return items.reduce((n, item) => n + 1 + item.children.length, 0);
}
