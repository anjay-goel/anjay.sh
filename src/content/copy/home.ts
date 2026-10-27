export interface TerminalRow {
	key: string;
	value: string;
	accent?: string;
}

export interface ShippedRow {
	name: string;
	showcase: string;
	description: string;
	kind: string;
	reach: string;
	reachAccent: boolean;
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
				{ key: "education", value: "IIT Kharagpur ’23" },
			] satisfies TerminalRow[],
		},
		shipped: {
			command: "ls ~/shipped",
			rows: [
				{ key: "DashReels", accent: "50M+", value: " installs" },
				{ key: "DashToon", accent: "1M+", value: " installs" },
				{ key: "RedScout", value: "open source" },
			] satisfies TerminalRow[],
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
		featured: {
			status: "Building now",
			name: "frameo.ai",
			description: "An AI video production studio for short films, micro-dramas, ads, anything you can imagine.",
			linkText: "frameo.ai",
			href: "https://frameo.ai",
		},
		rows: [
			{
				name: "DashReels",
				showcase: "DashReels",
				description: "Short-form drama app with personalised recommendations.",
				kind: "App · Short videos",
				reach: "50M+ installs",
				reachAccent: true,
			},
			{
				name: "DashToon",
				showcase: "DashToon",
				description: "A reader for comics and webtoons.",
				kind: "App · Comics",
				reach: "1M+ installs",
				reachAccent: true,
			},
			{
				name: "RedScout",
				showcase: "RedScout",
				description: "Namespace-level Redis insights: memory, TTLs and ops/sec.",
				kind: "Redis · Monitoring · CLI",
				reach: "open source",
				reachAccent: false,
			},
			{
				name: "Stable Roommate",
				showcase: "Generalised Stable Roommate",
				description: "Groups people into optimal teams from their own preferences.",
				kind: "Python · Algorithms",
				reach: "open source",
				reachAccent: false,
			},
		] satisfies ShippedRow[],
	},
};
