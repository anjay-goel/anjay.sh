export type ShortcutJoin = "or" | "sequence";

export interface Shortcut {
	keys: string[];
	join?: ShortcutJoin;
	action: string;
}

const items: Shortcut[] = [
	{ keys: ["/"], action: "Search posts" },
	{ keys: ["j", "k"], join: "or", action: "Next / previous post" },
	{ keys: ["Enter"], action: "Open the selected post" },
	{ keys: ["t"], action: "Switch light / dark" },
	{ keys: ["g", "h"], join: "sequence", action: "Go home" },
	{ keys: ["g", "p"], join: "sequence", action: "Go to all posts" },
	{ keys: ["?"], action: "Show this list" },
	{ keys: ["Esc"], action: "Close" },
];

export const shortcutsCopy = {
	title: "Keyboard shortcuts",
	close: "Esc",
	closeLabel: "Close keyboard shortcuts",
	joins: { or: "/", sequence: "then" } satisfies Record<ShortcutJoin, string>,
	items,
	note: "Off while you’re typing in a field.",
};
