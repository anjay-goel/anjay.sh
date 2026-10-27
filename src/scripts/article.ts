const ACTIVE_OFFSET = 0.3;
const COPIED_MS = 1600;

function initDisclosures() {
	for (const root of document.querySelectorAll<HTMLElement>("[data-disclosure]")) {
		const toggle = root.querySelector<HTMLButtonElement>("[data-disclosure-toggle]");
		const panel = root.querySelector<HTMLElement>("[data-disclosure-panel]");
		if (!toggle || !panel) continue;
		const set = (open: boolean) => {
			toggle.setAttribute("aria-expanded", String(open));
			panel.hidden = !open;
			const label = open ? toggle.dataset.labelOpen : toggle.dataset.labelClosed;
			if (label) toggle.setAttribute("aria-label", label);
		};
		toggle.addEventListener("click", () => set(toggle.getAttribute("aria-expanded") !== "true"));
		panel.addEventListener("click", (e) => {
			if ((e.target as HTMLElement).closest("a")) set(false);
		});
		root.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && !panel.hidden) {
				set(false);
				toggle.focus();
			}
		});
	}
}

function initCopyLinks() {
	for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy-link]")) {
		const label = button.querySelector<HTMLElement>("[data-copy-label]");
		let timer: number | undefined;
		button.addEventListener("click", async () => {
			const url = `${location.origin}${location.pathname}`;
			try {
				await navigator.clipboard.writeText(url);
			} catch {
				return;
			}
			button.dataset.copied = "";
			const done = button.dataset.labelDone ?? "";
			if (label) label.textContent = done;
			if (button.hasAttribute("aria-label")) button.setAttribute("aria-label", done);
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				delete button.dataset.copied;
				const idle = button.dataset.label ?? "";
				if (label) label.textContent = idle;
				if (button.hasAttribute("aria-label")) button.setAttribute("aria-label", idle);
			}, COPIED_MS);
		});
	}
}

function initBackToTop() {
	for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-back-to-top]")) {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
			window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
			document.getElementById("main")?.focus({ preventScroll: true });
		});
	}
}

function initReading() {
	const body = document.querySelector<HTMLElement>("[data-article-body]");
	if (!body) return;
	const bars = document.querySelectorAll<HTMLElement>("[data-progress-bar]");
	const fills = document.querySelectorAll<HTMLElement>("[data-progress-fill]");
	const texts = document.querySelectorAll<HTMLElement>("[data-progress-text]");
	const rings = document.querySelectorAll<HTMLElement>("[data-progress-ring]");
	const currents = document.querySelectorAll<HTMLElement>("[data-toc-current]");
	const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"));
	const ids = [...new Set(links.map((a) => decodeURIComponent(a.hash.slice(1))))];
	const headings = ids
		.map((id) => document.getElementById(id))
		.filter((h): h is HTMLElement => h !== null);
	const format = texts[0]?.textContent?.replace(/\d+/, "{n}") ?? "{n}";

	let active: string | undefined;
	let frame = 0;

	const update = () => {
		frame = 0;
		const rect = body.getBoundingClientRect();
		const span = rect.height - window.innerHeight * 0.6;
		const ratio = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
		const percent = Math.round(ratio * 100);
		for (const bar of bars) bar.style.transform = `scaleX(${ratio})`;
		for (const fill of fills) fill.style.transform = `scaleX(${ratio})`;
		for (const text of texts) text.textContent = format.replace("{n}", String(percent));
		for (const ring of rings) ring.style.setProperty("--p", String(percent));

		const line = window.innerHeight * ACTIVE_OFFSET;
		let current = headings[0];
		for (const h of headings) {
			if (h.getBoundingClientRect().top <= line) current = h;
			else break;
		}
		const id = current?.id;
		if (id === active) return;
		active = id;
		for (const link of links) {
			if (decodeURIComponent(link.hash.slice(1)) === id)
				link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		}
		const text = current?.textContent?.trim() ?? "";
		for (const c of currents) c.textContent = text;
	};

	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	update();
	window.addEventListener("scroll", schedule, { passive: true });
	window.addEventListener("resize", schedule, { passive: true });
}

export function initArticle() {
	initDisclosures();
	initCopyLinks();
	initBackToTop();
	initReading();
}
