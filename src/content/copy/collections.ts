export const collectionsCopy = {
	title: "Series & collections",
	previous: "Previous collections",
	next: "Next collections",
	crumb: "Posts",
	part: (roman: string) => `Part ${roman}`,
	postCount: (n: number) => (n === 1 ? "1 post" : `${n} posts`),
	partCount: (n: number) => (n === 1 ? "1 part" : `${n} parts`),
	start: "Start with Part I",
};
