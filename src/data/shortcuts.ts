export const shortcutKeys = {
	search: "/",
	next: "j",
	previous: "k",
	open: "Enter",
	theme: "t",
	go: "g",
	home: "h",
	posts: "p",
	help: "?",
	close: "Escape",
} as const;

export type ShortcutId = "search" | "move" | "open" | "theme" | "home" | "posts" | "help" | "close";

export type ShortcutJoin = "or" | "sequence";

export interface Shortcut {
	id: ShortcutId;
	keys: string[];
	join?: ShortcutJoin;
}

export const shortcuts: Shortcut[] = [
	{ id: "search", keys: [shortcutKeys.search] },
	{ id: "move", keys: [shortcutKeys.next, shortcutKeys.previous], join: "or" },
	{ id: "open", keys: [shortcutKeys.open] },
	{ id: "theme", keys: [shortcutKeys.theme] },
	{ id: "home", keys: [shortcutKeys.go, shortcutKeys.home], join: "sequence" },
	{ id: "posts", keys: [shortcutKeys.go, shortcutKeys.posts], join: "sequence" },
	{ id: "help", keys: [shortcutKeys.help] },
	{ id: "close", keys: [shortcutKeys.close] },
];
