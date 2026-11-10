import { copyText } from "../copy";

const COPIED_MS = 1200;

const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
const usedIds = new Set<string>();
document
	.querySelectorAll<HTMLHeadingElement>(
		".post-article h1, .post-article h2, .post-article h3, .post-article h4, .post-article h5, .post-article h6",
	)
	.forEach((h) => {
		const baseId = h.id || slugify(h.textContent ?? "");
		if (!baseId) return;
		let id = baseId;
		for (let n = 2; usedIds.has(id); n++) id = `${baseId}-${n}`;
		usedIds.add(id);
		if (!h.id) h.id = id;

		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "heading-anchor";
		btn.setAttribute("aria-label", `Copy link to ${h.textContent ?? "section"}`);
		btn.textContent = "#";
		btn.addEventListener("click", async () => {
			const url = `${location.origin}${location.pathname}#${id}`;
			history.replaceState(null, "", `#${id}`);
			if (!(await copyText(url))) return;
			btn.textContent = "✓";
			setTimeout(() => {
				btn.textContent = "#";
			}, COPIED_MS);
		});
		h.prepend(btn);
	});
