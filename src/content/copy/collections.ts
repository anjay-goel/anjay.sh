import { postCopy } from "@/content/copy/post";

export const collectionsCopy = {
	back: {
		text: "All posts",
		href: "/posts/",
	},
	start: (part: string) => `Start with ${part}`,
	postsLabel: "Posts in this collection",
	partsLabel: postCopy.series.partsLabel,
	more: "More collections",
};
