import { metaCopy } from "./meta";

export const headerCopy = {
	logo: {
		prefix: "~/",
		name: "anjay",
		suffix: ".sh",
		label: "anjay.sh home",
	},
	nav: {
		label: "Primary",
		items: [
			{ path: "/", title: metaCopy.pages.home, match: ["/"] },
			{ path: "/posts/", title: metaCopy.pages.posts, match: ["/posts/", "/tags/", "/collections/"] },
			{ path: "/showcase/", title: metaCopy.pages.showcase, match: ["/showcase/"] },
			{ path: "/about/", title: "About", match: ["/about/"] },
		],
	},
	search: {
		button: metaCopy.searchPosts,
		label: metaCopy.searchPosts,
	},
	theme: {
		toDark: "Switch to dark theme",
		toLight: "Switch to light theme",
		label: "Toggle theme",
	},
	skipLink: "Skip to content",
};
