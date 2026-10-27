import { metaCopy } from "./meta";

export const postCopy = {
	allPosts: metaCopy.allPosts,
	readTime: (minutes: number) => `${minutes} min read`,
	updated: (date: string) => `updated ${date}`,
	draft: "draft",
	series: {
		label: metaCopy.series,
		boxLabel: metaCopy.series,
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
		backToTop: "↑ Back to top",
		copyLink: "Copy link",
		copied: "Copied",
		copyFailed: "Copy failed",
		copiedStatus: "Link copied",
		copyFailedStatus: "Could not copy the link",
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
		copyCode: "Copy code",
		copied: "Copied",
		title: (language: string) =>
			(
				({ "": "text", plaintext: "text", txt: "text", sh: "shell", zsh: "shell" }) as Record<
					string,
					string
				>
			)[language] ?? language,
	},
	comments: {
		label: "Comments",
	},
	capabilities: {
		reset: "Reset",
		ok: "✓",
		fail: "✗",
		prompt: metaCopy.prompt,
	},
};
