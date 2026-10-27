import { metaCopy } from "./meta";

export const postsCopy = {
	separator: metaCopy.separator,
	index: {
		title: "Posts",
		metaTitle: "Posts",
		description: "Read my collection of posts and the things that interest me",
	},
	filter: {
		label: "Filter by tag",
		all: "all",
	},
	tag: {
		heading: (tag: string) => metaCopy.tag(tag),
		metaTitle: (tag: string) => `Posts tagged #${tag}`,
		description: (tag: string) => `Every post tagged “${tag}”.`,
		summary: (count: number, tag: string) => `${metaCopy.postCount(count)} tagged ${tag}`,
		allPosts: "All posts",
	},
	tags: {
		title: "Tags",
		metaTitle: "Tags",
		description: "Browse every topic written about on this site.",
		summary: (tags: number, posts: number) =>
			`${tags === 1 ? "1 tag" : `${tags} tags`} across ${metaCopy.postCount(posts)}`,
		allPosts: "All posts",
		listLabel: "All tags",
		count: (n: number) => String(n),
		countSr: (n: number) => metaCopy.postCount(n),
	},
	yearCount: (n: number) => metaCopy.postCount(n),
};
