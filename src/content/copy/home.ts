import { education } from "@/content/copy/about";
import { installsSuffix, showcase } from "@/data/showcase";

export interface TerminalRow {
	key: string;
	value: string;
	accent?: string;
}

export const homeCopy = {
	meta: {
		title: "Home",
	},
	hero: {
		title: "Hi! I’m Anjay.",
		intro:
			"I love to write about software development, technology and occasionally other stuff like economics & finance. I hope you find something interesting here.",
	},
	terminal: {
		label: "whoami",
		title: "anjay@web: ~",
		shell: "zsh",
		prompt: "$",
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
			rows: showcase
				.slice(0, 3)
				.map((item): TerminalRow =>
					item.reach ? { key: item.name, accent: item.reach, value: installsSuffix } : { key: item.name, value: item.badge ?? "" },
				),
		},
		posts: {
			command: "ls ~/posts | wc -l",
		},
	},
	latest: {
		title: "Latest",
		allPosts: (n: number) => `All ${n} posts`,
		collectionLabels: {
			postmortems: "Postmortem",
		} as Record<string, string>,
		postLabels: {
			"building-an-ai-dubbing-pipeline-for-micro-dramas": "AI & pipelines",
			"claude-code-long-running-agent": "AI & tooling",
		} as Record<string, string>,
		externalSources: {
			"insiders.dashverse.ai": "on the Dashverse blog",
		} as Record<string, string>,
	},
	collections: {
		title: "Series & collections",
		shortTitle: "Series",
		swipe: "swipe",
		previous: "Previous collections",
		next: "Next collections",
		itemTags: {
			"non-blocking-io": "linux",
			"developer-guide-to-domains-and-dns": "dns",
			"ios-keychain": "ios",
			"TIL-Partial-Index-And-Soft-Delete": "sql",
			"myth-of-market-timing": "finance",
			"How-To-Count-Votes": "society",
			cryptocurrencies: "finance",
			"covid-19-india-analysing-death-registration-trends": "data",
		} as Record<string, string>,
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
