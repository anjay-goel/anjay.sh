import { metaCopy } from "./meta";

export const footerCopy = {
	copyright: (year: number, name: string) => `© ${year} ${name}`,
	rss: metaCopy.rss,
	colophon: "Colophon",
	home: {
		email: "Email me",
		middle: ", or follow along via ",
		rss: metaCopy.rss,
		end: ".",
	},
	socials: {
		label: "Find me on",
		listLabel: "Elsewhere",
		github: metaCopy.github,
		linkedin: "LinkedIn",
		email: "Email",
		rss: "RSS feed",
	},
};
