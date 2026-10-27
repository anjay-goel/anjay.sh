export type ColophonFont = "sans" | "serif" | "mono";

export interface ColophonSwatch {
	name: string;
	hex: string;
}

export type ColophonPart =
	| string
	| { kind: "kbd"; text: string }
	| { kind: "font"; font: ColophonFont; text: string }
	| { kind: "link"; text: string; href: string }
	| { kind: "swatches"; items: ColophonSwatch[] }
	| { kind: "desktop"; parts: ColophonPart[] };

export interface ColophonRow {
	term: string;
	parts: ColophonPart[];
}

export interface ColophonShortcut {
	keys: string[];
	joiner?: string;
	label: string;
}

export const colophonCopy = {
	title: "Colophon",
	description: "How anjay.sh is put together: the stack, type, colours and keyboard shortcuts.",
	dek: "How this site is put together.",
	rows: [
		{
			term: "Built with",
			parts: ["Astro and Tailwind CSS. Code blocks by Expressive Code, maths by KaTeX, diagrams by Mermaid."],
		},
		{
			term: "Search",
			parts: [
				"Pagefind, indexed when the site is built.",
				{ kind: "desktop", parts: [" Press ", { kind: "kbd", text: "/" }, " anywhere."] },
			],
		},
		{ term: "Share images", parts: ["Drawn for each post at build time with Satori."] },
		{
			term: "Type",
			parts: [
				{ kind: "font", font: "sans", text: "IBM Plex Sans" },
				" for headings, ",
				{ kind: "font", font: "serif", text: "Source Serif 4" },
				" for long reading, ",
				{ kind: "font", font: "mono", text: "IBM Plex Mono" },
				" for code.",
			],
		},
		{
			term: "Colour",
			parts: [
				{
					kind: "swatches",
					items: [
						{ name: "paper", hex: "#f6f6f5" },
						{ name: "ink", hex: "#1a1a1a" },
						{ name: "blue", hex: "#335a85" },
						{ name: "night", hex: "#131313" },
						{ name: "night blue", hex: "#9fc3e6" },
					],
				},
			],
		},
		{ term: "Icons", parts: ["Tabler Icons."] },
		{
			term: "Source",
			parts: [
				{ kind: "link", text: "github.com/anjay-goel/anjay.sh", href: "https://github.com/anjay-goel/anjay.sh" },
			],
		},
	] satisfies ColophonRow[],
	keyboard: {
		heading: "Keyboard",
		intro: ["Press ", { kind: "kbd", text: "?" }, " on any page to bring these up."] satisfies ColophonPart[],
		shortcuts: [
			{ keys: ["/"], label: "Search posts" },
			{ keys: ["j", "k"], joiner: "/", label: "Next / previous post" },
			{ keys: ["Enter"], label: "Open the selected post" },
			{ keys: ["t"], label: "Switch light / dark" },
			{ keys: ["g", "h"], joiner: "then", label: "Go home" },
			{ keys: ["g", "p"], joiner: "then", label: "Go to all posts" },
			{ keys: ["?"], label: "Show this list" },
			{ keys: ["Esc"], label: "Close" },
		] satisfies ColophonShortcut[],
	},
};
