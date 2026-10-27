import { metaCopy } from "./meta";

export const searchCopy = {
	dialogLabel: metaCopy.searchPosts,
	inputLabel: metaCopy.searchPosts,
	placeholder: metaCopy.searchPosts,
	close: metaCopy.keys.Escape,
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
		tagsLabel: metaCopy.pages.tags,
	},
	hints: {
		up: "↑",
		down: "↓",
		move: "to move",
		enter: metaCopy.keys.Enter,
		open: "to open",
		esc: metaCopy.keys.Escape,
		close: "to close",
	},
	credit: "Search by Pagefind",
};
