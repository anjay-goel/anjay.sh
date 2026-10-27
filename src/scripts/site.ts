import { initComments } from "@/scripts/comments";
import { SEARCH_OPEN_EVENT, type SearchOpenDetail } from "@/scripts/events";
import type { SearchController } from "@/scripts/search";
import { initShortcuts } from "@/scripts/shortcuts";
import { getTheme, THEME_EVENT, toggleTheme } from "@/scripts/theme";

function initThemeToggles() {
	const buttons = document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]");
	const syncLabels = () => {
		const dark = getTheme() === "dark";
		for (const btn of buttons) {
			const label = dark ? btn.dataset.labelToLight : btn.dataset.labelToDark;
			if (label) btn.setAttribute("aria-label", label);
		}
	};
	for (const btn of buttons) btn.addEventListener("click", () => toggleTheme());
	document.addEventListener(THEME_EVENT, () => requestAnimationFrame(syncLabels));
	syncLabels();
}

function initSearchTriggers() {
	const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");
	const input = dialog?.querySelector<HTMLInputElement>("[data-search-input]");
	if (!dialog || !input) return;
	let controller: Promise<SearchController | null> | null = null;
	const load = () => {
		controller ??= import("@/scripts/search").then((m) => m.initSearch());
		return controller;
	};
	const warm = () => {
		void load().then((c) => c?.warm());
	};
	const open = (trigger: HTMLElement | null) => {
		const returnTo =
			trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
		if (!dialog.open) dialog.showModal();
		input.focus();
		input.select();
		void load().then((c) => c?.opened(returnTo));
	};
	for (const btn of document.querySelectorAll<HTMLElement>("[data-search-open]")) {
		btn.addEventListener("click", () => open(btn));
		btn.addEventListener("pointerenter", warm, { once: true });
		btn.addEventListener("focus", warm, { once: true });
	}
	document.addEventListener(SEARCH_OPEN_EVENT, (event) => {
		open((event as CustomEvent<SearchOpenDetail>).detail?.trigger ?? null);
	});
}

function initScrollFocus() {
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	document.addEventListener("focusin", (event) => {
		const target = event.target;
		if (!(target instanceof HTMLElement)) return;
		const container = target.closest<HTMLElement>("[data-scroll-focus]");
		if (!container) return;
		let item: HTMLElement = target;
		while (item.parentElement && item.parentElement !== container) item = item.parentElement;
		const box = container.getBoundingClientRect();
		const rect = item.getBoundingClientRect();
		const style = getComputedStyle(container);
		const inView =
			rect.left >= box.left + (Number.parseFloat(style.scrollPaddingLeft) || 0) - 1 &&
			rect.right <= box.right - (Number.parseFloat(style.scrollPaddingRight) || 0) + 1;
		const snap = getComputedStyle(item).scrollSnapAlign.split(" ").pop();
		const inline: ScrollLogicalPosition =
			!inView &&
			style.scrollSnapType !== "none" &&
			(snap === "start" || snap === "center" || snap === "end")
				? snap
				: "nearest";
		item.scrollIntoView({
			block: "nearest",
			inline,
			behavior: reduced.matches ? "auto" : "smooth",
		});
	});
}

initThemeToggles();
initSearchTriggers();
initScrollFocus();
initShortcuts();
initComments();
