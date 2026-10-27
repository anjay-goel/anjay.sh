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
			{ path: "/", title: "Home", match: ["/"] },
			{ path: "/posts/", title: "Posts", match: ["/posts/", "/tags/", "/collections/"] },
			{ path: "/showcase/", title: "Showcase", match: ["/showcase/"] },
			{ path: "/about/", title: "About", match: ["/about/"] },
		],
	},
	search: {
		button: "Search posts",
		label: "Search posts",
	},
	theme: {
		toDark: "Switch to dark theme",
		toLight: "Switch to light theme",
		label: "Toggle theme",
	},
	skipLink: "Skip to content",
};
