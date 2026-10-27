export const metaCopy = {
	separator: " · ",
	minutes: (n: number) => `${n} min`,
	external: "external ↗",
	externalSr: "(opens external site)",
	part: (roman: string) => `Part ${roman}`,
	tag: (tag: string) => `#${tag}`,
	postCount: (n: number) => (n === 1 ? "1 post" : `${n} posts`),
	partCount: (n: number) => (n === 1 ? "1 part" : `${n} parts`),
};
