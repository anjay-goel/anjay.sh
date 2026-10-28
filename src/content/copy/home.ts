import { metaCopy } from "./meta";

export const homeCopy = {
	meta: {
		title: metaCopy.pages.home,
	},
	hero: {
		title: "Hi! I’m Anjay.",
	},
	latest: {
		title: "Latest",
		allPosts: (n: number) => `All ${n} posts`,
	},
	collections: {
		title: "Series & collections",
		shortTitle: metaCopy.series,
		swipe: "swipe",
		previous: "Previous collections",
		next: "Next collections",
	},
	archive: {
		title: "Browse the archive",
		navLabel: "Posts by year",
		yearLabel: (year: number) => `Posts from ${year}`,
	},
	shipped: {
		title: "Things I’ve shipped",
		shortTitle: "Shipped",
		listLabel: "Other projects",
		status: "Building now",
	},
};
