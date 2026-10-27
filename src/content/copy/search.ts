import { metaCopy } from "@/content/copy/meta";

export const searchCopy = {
	dialogLabel: "Search posts",
	inputLabel: "Search posts",
	placeholder: "Search posts",
	close: "Esc",
	closeLabel: "Close search",
	cancel: "Cancel",
	resultsLabel: "Results",
	count: metaCopy.postCount,
	inSection: (title: string) => `in “${title}”`,
	loading: "Searching…",
	unavailable: "Search isn’t available right now.",
	empty: {
		title: (query: string) => `No posts match “${query}”.`,
		hint: "Try a single word, or browse a related tag.",
		tagsLabel: "Tags",
	},
	hints: {
		up: "↑",
		down: "↓",
		move: "to move",
		enter: "Enter",
		open: "to open",
		esc: "Esc",
		close: "to close",
	},
	credit: "Search by Pagefind",
};
