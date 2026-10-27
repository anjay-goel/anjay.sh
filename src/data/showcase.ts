export type ShowcaseSource = "play" | "github" | "web";

export interface ShowcaseItem {
	name: string;
	href: string;
	stack: string;
	badge?: string;
	highlight?: boolean;
	desc: string;
	summary: string;
	source: ShowcaseSource;
}

export interface ShowcaseFeatured {
	name: string;
	href: string;
	desc: string;
	linkText: string;
}

export const featuredProject: ShowcaseFeatured = {
	name: "frameo.ai",
	href: "https://frameo.ai",
	desc: "An AI video production studio for short films, micro-dramas, ads, anything you can imagine.",
	linkText: "frameo.ai",
};

export const showcase: ShowcaseItem[] = [
	{
		name: "DashReels",
		href: "https://play.google.com/store/apps/details?id=com.dashtoon.video.reels&hl=en_IN",
		stack: "App · Short videos",
		badge: "50M+ installs",
		highlight: true,
		desc: "A mobile entertainment app offering short-form video content across multiple genres. Features include free short dramas, a personalized recommendation system, and an engaging, user-friendly experience.",
		summary: "Short-form drama app with personalised recommendations.",
		source: "play",
	},
	{
		name: "DashToon",
		href: "https://play.google.com/store/apps/details?id=com.dashtoon.app&hl=en_IN",
		stack: "App · Comics",
		badge: "1M+ installs",
		highlight: true,
		desc: "A mobile application focused on comics and webtoons. Provides users with access to a wide variety of digital comics and manga content with an intuitive reading experience.",
		summary: "A reader for comics and webtoons.",
		source: "play",
	},
	{
		name: "RedScout",
		href: "https://github.com/anjay-goel/RedScout",
		stack: "Redis · Monitoring · CLI",
		badge: "open source",
		desc: "A Redis monitoring tool that provides namespace-level insights into your Redis database. Unlike traditional tools, It breaks down memory usage, key TTLs, and operations per second by logical namespaces.",
		summary: "Namespace-level Redis insights: memory, TTLs and ops/sec.",
		source: "github",
	},
	{
		name: "Stable Roommate",
		href: "https://github.com/anjay-goel/stable-roommate-generalised",
		stack: "Python · Algorithms",
		badge: "open source",
		desc: "An algorithm & webapp to automatically group people into optimal teams based on their individual preferences.",
		summary: "Groups people into optimal teams from their own preferences.",
		source: "github",
	},
];
