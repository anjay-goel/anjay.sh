import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	// @ts-expect-error:next-line
	return (tree, { data }) => {
		const textOnPage = mdastToString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
		data.astro.frontmatter.readingMinutes = Math.max(
			1,
			Math.ceil(Number(readingTime.minutes.toFixed(2))),
		);
	};
}
