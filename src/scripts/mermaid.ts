export {};

const diagrams = Array.from(document.querySelectorAll<HTMLElement>("pre.mermaid"));
if (diagrams.length) {
	const sources = new Map(diagrams.map((node) => [node, node.textContent ?? ""]));
	let renderId = 0;
	let pending = Promise.resolve();

	function readPalette() {
		const probe = document.body.appendChild(document.createElement("span"));
		const resolve = (color: string) => {
			probe.style.color = color;
			return getComputedStyle(probe).color;
		};
		const palette = {
			bg: resolve("hsl(var(--theme-bg))"),
			paper: resolve("var(--paper)"),
			border: resolve("var(--faint)"),
			line: resolve("hsl(var(--theme-text-muted))"),
			text: resolve("hsl(var(--theme-text))"),
		};
		probe.remove();
		return palette;
	}

	function renderDiagrams() {
		pending = pending
			.then(async () => {
				const { default: mermaid } = await import("mermaid");
				await document.fonts.ready;
				const dark = document.documentElement.dataset.theme === "dark";
				const palette = readPalette();
				mermaid.initialize({
					startOnLoad: false,
					layout: "dagre",
					look: "classic",
					securityLevel: "strict",
					suppressErrorRendering: true,
					theme: "base",
					fontFamily: "IBM Plex Sans Variable, sans-serif",
					themeVariables: {
						darkMode: dark,
						background: palette.bg,
						primaryColor: palette.paper,
						primaryTextColor: palette.text,
						primaryBorderColor: palette.border,
						lineColor: palette.line,
						secondaryColor: palette.paper,
						tertiaryColor: palette.bg,
						edgeLabelBackground: palette.bg,
						noteBkgColor: palette.paper,
						noteBorderColor: palette.border,
						noteTextColor: palette.text,
					},
					flowchart: { htmlLabels: false, curve: "linear" },
					themeCSS: ".edgeLabel .label rect { opacity: 1; }",
				});
				for (const [node, source] of sources) {
					try {
						const { svg } = await mermaid.render(`mermaid-diagram-${renderId++}`, source);
						node.innerHTML = svg;
						node.dataset.rendered = "true";
						const diagram = node.querySelector("svg");
						if (diagram)
							diagram.style.minWidth = `${Math.min(diagram.viewBox.baseVal.width * 0.7, 560)}px`;
					} catch (error) {
						console.error("Could not render Mermaid diagram", error);
					}
				}
			})
			.catch((error) => console.error("Could not load Mermaid", error));
	}

	renderDiagrams();
	new MutationObserver(renderDiagrams).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});
}
