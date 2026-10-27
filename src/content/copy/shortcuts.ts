import type { ShortcutId, ShortcutJoin } from "@/data/shortcuts";
import { metaCopy } from "./meta";

const keyLabels: Record<string, string> = metaCopy.keys;

export const shortcutsCopy = {
	title: "Keyboard shortcuts",
	closeLabel: "Close keyboard shortcuts",
	joins: { or: "/", sequence: "then" } satisfies Record<ShortcutJoin, string>,
	keyLabel: (key: string) => keyLabels[key] ?? key,
	actions: {
		search: metaCopy.searchPosts,
		move: "Next / previous post",
		open: "Open the selected post",
		theme: "Switch light / dark",
		home: "Go home",
		posts: "Go to all posts",
		help: "Show this list",
		close: "Close",
	} satisfies Record<ShortcutId, string>,
	note: "Off while you’re typing in a field.",
};
