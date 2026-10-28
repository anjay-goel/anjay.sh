import { searchCopy } from "@/content/copy/search";
import type {
	Pagefind,
	PagefindData,
	PagefindSubResult,
	SearchPostIndex,
} from "@/scripts/search-types";

const RESULT_LIMIT = 16;
const DEBOUNCE_MS = 120;
const EXCERPT_WORDS = 16;
const ELLIPSIS = "…";
const MIN_STEM = 3;
const STEM_RATIO = 0.6;

interface SearchItem {
	href: string;
	title: string;
	meta: string;
	crumb: string;
	excerpt: string;
}

interface PagefindPage extends PagefindData {
	anchors?: { text: string; location: number }[];
}

interface Loaded {
	pagefind: Pagefind;
	index: SearchPostIndex;
}

const WORD = /([\p{L}\p{N}]+)/u;
const NON_WORD = /[^\p{L}\p{N}]+/u;
const ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

function escapeHtml(text: string): string {
	return text.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);
}

function queryTerms(query: string): string[] {
	return query.toLowerCase().split(NON_WORD).filter(Boolean);
}

function highlight(text: string, terms: string[]): string {
	return text
		.split(WORD)
		.map((part, i) => {
			const safe = escapeHtml(part);
			const hit = i % 2 === 1 && terms.some((t) => part.toLowerCase().startsWith(t));
			return hit ? `<mark>${safe}</mark>` : safe;
		})
		.join("");
}

function tightenMarks(excerpt: string): string {
	return excerpt.replace(
		/<mark>([^<&\p{L}\p{N}]*)([\p{L}\p{N}]+)([^<]*)<\/mark>/gu,
		"$1<mark>$2</mark>$3",
	);
}

function plainWords(text: string): string[] {
	return text
		.replace(/<[^>]*>/g, "")
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.replace(/&[#\w]+;/g, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase());
}

function findRun(words: string[], run: string[]): number {
	for (let i = 0; i + run.length <= words.length; i++) {
		if (run.every((word, j) => words[i + j] === word)) return i;
	}
	return -1;
}

function withEllipses(excerpt: string, data: PagefindPage): string {
	const run = plainWords(excerpt);
	if (run.length < EXCERPT_WORDS) return excerpt;
	const words = plainWords(data.content ?? "");
	const start = findRun(words, run);
	if (start < 0) return `${ELLIPSIS}${excerpt}${ELLIPSIS}`;
	const bounds = new Set([0, words.length]);
	for (const anchor of data.anchors ?? []) {
		bounds.add(anchor.location);
		bounds.add(anchor.location + plainWords(anchor.text).length);
	}
	const head = bounds.has(start) ? "" : ELLIPSIS;
	const tail =
		bounds.has(start + run.length) || /[.!?…]$/.test(excerpt.replace(/<[^>]*>/g, "").trim())
			? ""
			: ELLIPSIS;
	return `${head}${excerpt}${tail}`;
}

function coversTerms(data: PagefindData, terms: string[]): boolean {
	if (!data.content) return true;
	const words = new Set(`${data.meta.title ?? ""} ${data.content}`.toLowerCase().split(NON_WORD));
	return terms.every((term) => {
		const minStem = Math.max(MIN_STEM, Math.ceil(term.length * STEM_RATIO));
		for (const word of words) {
			if (word.startsWith(term) || (term.startsWith(word) && word.length >= minStem)) return true;
		}
		return false;
	});
}

function sectionScore(sub: PagefindSubResult): number {
	if (sub.weighted_locations)
		return sub.weighted_locations.reduce((sum, l) => sum + l.balanced_score, 0);
	return sub.locations?.length ?? 0;
}

function bestSection(data: PagefindData): PagefindSubResult | undefined {
	let best: PagefindSubResult | undefined;
	let bestScore = -1;
	for (const sub of data.sub_results ?? []) {
		const score = sectionScore(sub);
		if (score > bestScore) {
			best = sub;
			bestScore = score;
		}
	}
	return best;
}

function pageKey(url: string): string {
	const path = url.split("#")[0] ?? url;
	return path.endsWith("/") ? path : `${path}/`;
}

function toItem(data: PagefindPage, index: SearchPostIndex, terms: string[]): SearchItem | null {
	const post = index[pageKey(data.url)];
	if (!post && Object.keys(index).length > 0) return null;
	const title = post?.title ?? data.meta.title ?? "";
	const best = bestSection(data);
	const section = best?.url.includes("#") && best.title && best.title !== title ? best : undefined;
	return {
		href: post?.external ? post.href : (section?.url ?? data.url),
		title: highlight(title, terms),
		meta: post?.meta ?? "",
		crumb: section ? searchCopy.inSection(section.title) : "",
		excerpt: withEllipses(tightenMarks(section?.excerpt ?? data.excerpt), data),
	};
}

export interface SearchController {
	opened: (returnTo: HTMLElement | null) => void;
	warm: () => void;
}

export function initSearch(): SearchController | null {
	const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");
	if (!dialog) return null;
	const input = dialog.querySelector<HTMLInputElement>("[data-search-input]");
	const body = dialog.querySelector<HTMLElement>("[data-search-body]");
	const status = dialog.querySelector<HTMLElement>("[data-search-status]");
	const live = dialog.querySelector<HTMLElement>("[data-search-live]");
	const results = dialog.querySelector<HTMLUListElement>("[data-search-results]");
	const empty = dialog.querySelector<HTMLElement>("[data-search-empty]");
	const emptyTitle = dialog.querySelector<HTMLElement>("[data-search-empty-title]");
	const template = dialog.querySelector<HTMLTemplateElement>("[data-search-item]");
	if (!input || !body || !status || !live || !results || !empty || !emptyTitle || !template)
		return null;

	const pagefindUrl = dialog.dataset.pagefind ?? "";
	const indexUrl = dialog.dataset.index ?? "";
	let loader: Promise<Loaded> | null = null;
	let ready = false;
	let seq = 0;
	let active = -1;
	let returnFocus: HTMLElement | null = null;
	let pressedBackdrop = false;

	const load = (): Promise<Loaded> => {
		loader ??= Promise.all([
			import(pagefindUrl).then(async (pagefind: Pagefind) => {
				await pagefind.options({ excerptLength: EXCERPT_WORDS });
				await pagefind.init();
				return pagefind;
			}),
			fetch(indexUrl)
				.then((res) => (res.ok ? (res.json() as Promise<SearchPostIndex>) : {}))
				.catch(() => ({})),
		]).then(([pagefind, index]) => {
			ready = true;
			return { pagefind, index };
		});
		loader.catch(() => {
			loader = null;
		});
		return loader;
	};

	const warm = () => {
		load().catch(() => {});
	};

	const options = () => [...results.querySelectorAll<HTMLLIElement>("[role=option]")];

	const setActive = (next: number, scroll = true) => {
		const items = options();
		active = items.length ? (next + items.length) % items.length : -1;
		items.forEach((item, i) => {
			item.setAttribute("aria-selected", String(i === active));
		});
		const current = items[active];
		if (current) {
			input.setAttribute("aria-activedescendant", current.id);
			if (scroll) current.scrollIntoView({ block: "nearest" });
		} else {
			input.removeAttribute("aria-activedescendant");
		}
	};

	const showStatus = (text: string, spoken = text) => {
		status.textContent = text;
		live.textContent = spoken;
	};

	const reset = () => {
		body.hidden = true;
		results.replaceChildren();
		empty.hidden = true;
		showStatus("");
		input.setAttribute("aria-expanded", "false");
		setActive(-1);
	};

	const renderItems = (items: SearchItem[], query: string) => {
		const nodes = items.map((item, i) => {
			const node = template.content.firstElementChild?.cloneNode(true) as HTMLLIElement;
			node.id = `search-option-${i}`;
			const link = node.querySelector<HTMLAnchorElement>("a");
			if (link) link.href = item.href;
			const field = (name: string) => node.querySelector<HTMLElement>(`[data-field="${name}"]`);
			const meta = field("meta");
			const title = field("title");
			const crumb = field("crumb");
			const excerpt = field("excerpt");
			if (meta) meta.textContent = item.meta;
			if (title) title.innerHTML = item.title;
			if (crumb) crumb.textContent = item.crumb;
			if (excerpt) excerpt.innerHTML = item.excerpt;
			return node;
		});
		results.replaceChildren(...nodes);
		body.hidden = false;
		const found = nodes.length > 0;
		empty.hidden = found;
		const emptyText = found ? "" : searchCopy.empty.title(query);
		emptyTitle.textContent = emptyText;
		showStatus(
			found ? searchCopy.count(nodes.length) : "",
			found ? searchCopy.count(nodes.length) : emptyText,
		);
		input.setAttribute("aria-expanded", String(found));
		setActive(found ? 0 : -1);
	};

	const run = async () => {
		const query = input.value.trim();
		const token = ++seq;
		if (!query) {
			reset();
			return;
		}
		if (!ready) {
			body.hidden = false;
			empty.hidden = true;
			showStatus(searchCopy.loading);
		}
		let loaded: Loaded;
		try {
			loaded = await load();
		} catch {
			if (token !== seq) return;
			results.replaceChildren();
			body.hidden = false;
			showStatus(searchCopy.unavailable);
			return;
		}
		const search = await loaded.pagefind.debouncedSearch(query, {}, DEBOUNCE_MS);
		if (!search || token !== seq) return;
		const pages = await Promise.all(search.results.slice(0, RESULT_LIMIT).map((r) => r.data()));
		if (token !== seq) return;
		const terms = queryTerms(query);
		const items = pages
			.filter((p) => coversTerms(p, terms))
			.map((p) => toItem(p, loaded.index, terms))
			.filter((i): i is SearchItem => i !== null);
		renderItems(items, query);
	};

	const close = () => {
		if (dialog.open) dialog.close();
	};

	const activeLink = () => options()[active]?.querySelector<HTMLAnchorElement>("a") ?? null;

	input.addEventListener("input", () => {
		void run();
	});

	input.addEventListener("keydown", (event) => {
		if (event.isComposing) return;
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setActive(active + (event.key === "ArrowDown" ? 1 : -1));
		} else if (event.key === "Enter") {
			const link = activeLink();
			if (!link) return;
			event.preventDefault();
			if (event.metaKey || event.ctrlKey) window.open(link.href, "_blank", "noopener");
			else link.click();
		} else if (event.key === "Escape") {
			event.preventDefault();
			close();
		}
	});

	results.addEventListener("pointermove", (event) => {
		const item = (event.target as Element).closest<HTMLLIElement>("[role=option]");
		if (!item) return;
		const index = options().indexOf(item);
		if (index !== active) setActive(index, false);
	});

	results.addEventListener("click", (event) => {
		if ((event.target as Element).closest("a")) close();
	});

	dialog.addEventListener("pointerdown", (event) => {
		pressedBackdrop = event.target === dialog;
	});

	dialog.addEventListener("click", (event) => {
		if (pressedBackdrop && event.target === dialog) close();
		pressedBackdrop = false;
	});

	dialog.addEventListener("close", () => {
		returnFocus?.focus({ preventScroll: true });
		returnFocus = null;
	});

	for (const button of dialog.querySelectorAll<HTMLButtonElement>("[data-search-close]")) {
		button.addEventListener("click", close);
	}

	if (input.value.trim()) void run();

	return {
		opened: (returnTo) => {
			returnFocus = returnTo;
			warm();
		},
		warm,
	};
}
