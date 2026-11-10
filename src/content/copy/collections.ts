export const collectionsCopy = {
	title: "Series & collections",
	previous: "Previous collection",
	next: "Next collection",
	crumb: "Posts",
	postCount: (n: number) => (n === 1 ? "1 post" : `${n} posts`),
	partCount: (n: number) => (n === 1 ? "1 part" : `${n} parts`),
	recentPosts: "Recent posts",
	parts: "Parts",
	all: (n: number) => `All ${n}`,
	allIn: (count: string, title: string) => `All ${count} in ${title}`,
};
