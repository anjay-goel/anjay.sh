import { metaCopy } from "./meta";
import { postCopy } from "./post";

export const collectionsCopy = {
	back: {
		text: metaCopy.allPosts,
		href: "/posts/",
	},
	start: (part: string) => `Start with ${part}`,
	postsLabel: "Posts in this collection",
	partsLabel: postCopy.series.partsLabel,
	more: "More collections",
};
