import { getTheme, THEME_EVENT } from "@/scripts/theme";

const ORIGIN = "https://giscus.app";

function load(mount: HTMLElement) {
	const d = mount.dataset;
	const themeFor = (theme: string) => (theme === "dark" ? d.themeDark : d.themeLight) ?? "";
	const script = document.createElement("script");
	script.src = `${ORIGIN}/client.js`;
	const attrs: Record<string, string> = {
		"data-repo": d.repo ?? "",
		"data-repo-id": d.repoId ?? "",
		"data-category": d.category ?? "",
		"data-category-id": d.categoryId ?? "",
		"data-mapping": "title",
		"data-strict": "0",
		"data-reactions-enabled": "1",
		"data-emit-metadata": "0",
		"data-input-position": "top",
		"data-theme": themeFor(getTheme()),
		"data-lang": "en",
		"data-loading": "lazy",
		crossorigin: "anonymous",
	};
	for (const [k, v] of Object.entries(attrs)) script.setAttribute(k, v);
	script.async = true;
	mount.appendChild(script);

	document.addEventListener(THEME_EVENT, (e) => {
		const theme = (e as CustomEvent<{ theme: string }>).detail?.theme ?? getTheme();
		const frame = mount.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
		frame?.contentWindow?.postMessage(
			{ giscus: { setConfig: { theme: themeFor(theme) } } },
			ORIGIN,
		);
	});
}

export function initComments() {
	const mount = document.querySelector<HTMLElement>("[data-giscus]");
	if (!mount) return;
	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			observer.disconnect();
			load(mount);
		},
		{ rootMargin: "600px 0px" },
	);
	observer.observe(mount);
}
