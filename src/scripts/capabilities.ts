function update(widget: HTMLElement) {
	const enabled = new Set(
		Array.from(widget.querySelectorAll<HTMLElement>(".caps-switch"))
			.filter((s) => s.getAttribute("aria-checked") === "true")
			.map((s) => s.dataset.cap ?? ""),
	);
	for (const cmd of widget.querySelectorAll<HTMLElement>(".caps-cmd")) {
		const needs = (cmd.dataset.needs ?? "").split(" ").filter(Boolean);
		const result = cmd.querySelector<HTMLElement>(".caps-result");
		if (!result) continue;
		const passes = needs.every((n) => enabled.has(n));
		result.dataset.state = passes ? "ok" : "fail";
		result.textContent = (passes ? result.dataset.ok : result.dataset.fail) ?? "";
	}
}

export function initCapabilities() {
	for (const widget of document.querySelectorAll<HTMLElement>("[data-caps]")) {
		const switches = Array.from(widget.querySelectorAll<HTMLElement>(".caps-switch"));
		for (const s of switches) {
			s.addEventListener("click", () => {
				s.setAttribute("aria-checked", String(s.getAttribute("aria-checked") !== "true"));
				update(widget);
			});
		}
		widget.querySelector("[data-caps-reset]")?.addEventListener("click", () => {
			for (const s of switches) s.setAttribute("aria-checked", s.dataset.default ?? "true");
			update(widget);
		});
	}
}
