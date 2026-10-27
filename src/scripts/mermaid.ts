export {};

const diagrams = Array.from(document.querySelectorAll<HTMLElement>("pre.mermaid"));
if (diagrams.length) {
	const sources = new Map(diagrams.map((node) => [node, node.textContent ?? ""]));
	let renderId = 0;
	let pending = Promise.resolve();

	function renderDiagrams() {
		pending = pending
			.then(async () => {
				const { default: mermaid } = await import("mermaid");
				await document.fonts.ready;
				const dark = document.documentElement.dataset.theme === "dark";
				const styles = getComputedStyle(document.documentElement);
				const token = (name: string) => styles.getPropertyValue(name).trim();
				const palette = {
					bg: token("--paper"),
					paper: token("--paper"),
					soft: token("--accent-soft"),
					border: token("--rule-strong"),
					line: token("--soft"),
					text: token("--ink"),
				};
				const font = token("--font-sans");
				mermaid.initialize({
					startOnLoad: false,
					layout: "dagre",
					look: "classic",
					securityLevel: "strict",
					suppressErrorRendering: true,
					theme: "base",
					fontFamily: font,
					themeVariables: {
						darkMode: dark,
						background: palette.bg,
						primaryColor: palette.paper,
						primaryTextColor: palette.text,
						primaryBorderColor: palette.border,
						lineColor: palette.line,
						secondaryColor: palette.paper,
						tertiaryColor: palette.soft,
						clusterBkg: palette.soft,
						clusterBorder: palette.border,
						fontSize: "14px",
						edgeLabelBackground: palette.bg,
						noteBkgColor: palette.paper,
						noteBorderColor: palette.border,
						noteTextColor: palette.text,
					},
					flowchart: { htmlLabels: false, curve: "linear" },
					themeCSS:
						".edgeLabel .label rect { opacity: 1; } .node rect, .cluster rect { rx: 8px; ry: 8px; }",
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
