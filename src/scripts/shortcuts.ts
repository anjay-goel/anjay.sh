import { SEARCH_OPEN_EVENT } from "@/scripts/search";
import { toggleTheme } from "@/scripts/theme";

const SEQUENCE_MS = 1200;
const ROW_SELECTOR = "[data-post-row]";

function isTyping(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return target.isContentEditable || target.closest("input, textarea, select, [contenteditable]") !== null;
}

function visibleRows(): HTMLElement[] {
	return [...document.querySelectorAll<HTMLElement>(ROW_SELECTOR)].filter((row) => row.getClientRects().length > 0);
}

function startIndex(rows: HTMLElement[], step: number): number {
	if (step > 0) {
		const below = rows.findIndex((row) => row.getBoundingClientRect().top >= 0);
		return below === -1 ? rows.length - 1 : below;
	}
	const above = rows.filter((row) => row.getBoundingClientRect().bottom <= window.innerHeight).length;
	return Math.max(0, above - 1);
}

function moveSelection(step: number): boolean {
	const rows = visibleRows();
	if (rows.length === 0) return false;
	const current = rows.indexOf(document.activeElement as HTMLElement);
	const next = current === -1 ? startIndex(rows, step) : Math.min(rows.length - 1, Math.max(0, current + step));
	const row = rows[next];
	if (!row) return false;
	row.focus({ preventScroll: true });
	row.scrollIntoView({ block: "nearest" });
	return true;
}

export function initShortcuts(): void {
	const dialog = document.querySelector<HTMLDialogElement>("[data-shortcuts-dialog]");
	const home = dialog?.dataset.home ?? "/";
	const posts = dialog?.dataset.posts ?? "/posts/";
	let returnFocus: HTMLElement | null = null;
	let pressedBackdrop = false;
	let pendingG = 0;

	const openDialog = (trigger?: HTMLElement | null) => {
		if (!dialog || dialog.open) return;
		returnFocus = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
		dialog.showModal();
		dialog.focus();
	};

	if (dialog) {
		dialog.querySelector("[data-shortcuts-close]")?.addEventListener("click", () => dialog.close());
		dialog.addEventListener("pointerdown", (event) => {
			pressedBackdrop = event.target === dialog;
		});
		dialog.addEventListener("click", (event) => {
			if (pressedBackdrop && event.target === dialog) dialog.close();
			pressedBackdrop = false;
		});
		dialog.addEventListener("close", () => {
			returnFocus?.focus({ preventScroll: true });
			returnFocus = null;
		});
	}

	for (const trigger of document.querySelectorAll<HTMLElement>("[data-shortcuts-open]")) {
		trigger.addEventListener("click", () => openDialog(trigger));
	}

	document.addEventListener("keydown", (event) => {
		if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
		if (isTyping(event.target) || document.querySelector("dialog[open]")) return;
		const { key } = event;
		const sequence = pendingG > 0 && Date.now() - pendingG < SEQUENCE_MS;
		pendingG = 0;
		if (sequence && (key === "h" || key === "p")) {
			event.preventDefault();
			window.location.assign(key === "h" ? home : posts);
			return;
		}
		switch (key) {
			case "/":
				event.preventDefault();
				document.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT, { detail: { trigger: null } }));
				break;
			case "?":
				event.preventDefault();
				openDialog();
				break;
			case "t":
				toggleTheme();
				break;
			case "g":
				pendingG = Date.now();
				break;
			case "j":
			case "k":
				if (moveSelection(key === "j" ? 1 : -1)) event.preventDefault();
				break;
			case "Escape":
				if (document.activeElement instanceof HTMLElement && document.activeElement.matches(ROW_SELECTOR)) {
					document.activeElement.blur();
				}
				break;
		}
	});
}
