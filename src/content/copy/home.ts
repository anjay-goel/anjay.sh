import { education } from "@/content/copy/about";
import { metaCopy } from "./meta";

export interface TerminalRow {
	key: string;
	value: string;
	accent?: string;
}

export const homeCopy = {
	meta: {
		title: metaCopy.pages.home,
	},
	hero: {
		title: "Hi! I’m Anjay.",
	},
	terminal: {
		label: "whoami",
		title: "anjay@web: ~",
		shell: "zsh",
		prompt: metaCopy.prompt,
		whoami: {
			command: "whoami",
			name: "anjay goel",
			rows: [
				{ key: "building", value: "frameo.ai" },
				{ key: "education", value: education },
			] satisfies TerminalRow[],
		},
		shipped: {
			command: "ls ~/shipped",
		},
		posts: {
			command: "ls ~/posts | wc -l",
		},
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
