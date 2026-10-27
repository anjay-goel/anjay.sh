export const postCopy = {
	allPosts: "All posts",
	readTime: (minutes: number) => `${minutes} min read`,
	updated: (date: string) => `updated ${date}`,
	draft: "draft",
	authorNotes: {
		"anatomy-of-containers-iii": "Go · hands-on",
	} as Record<string, string>,
	series: {
		label: "Series",
		boxLabel: "Series",
		partOf: (index: number, total: number) => `Part ${index} of ${total}`,
		barLabel: (index: number, total: number) => `Series · part ${index} of ${total}`,
		showParts: "Show all parts",
		hideParts: "Hide all parts",
		partsLabel: "Parts in this series",
		partTitle: (roman: string, title: string) => `Part ${roman}: ${title}`,
	},
	toc: {
		label: "On this page",
		progress: (percent: number) => `${percent}%`,
		progressLabel: "Reading progress",
		backToTop: "↑ Back to top",
		copyLink: "Copy link",
		copied: "Copied",
		toggle: "Show sections",
	},
	pager: {
		label: "More posts",
		previous: "← Previous",
		previousInSeries: "← Previous in series",
		next: "Read next",
		nextInSeries: "Next in series →",
	},
	code: {
		copy: "Copy",
		copied: "Copied",
	},
	notes: {
		label: (n: number) => `Note ${n}`,
	},
	comments: {
		label: "Comments",
	},
	capabilities: {
		reset: "Reset",
		ok: "✓",
		fail: "✗",
		prompt: "$",
	},
};
