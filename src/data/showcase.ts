export interface ShowcaseItem {
	name: string;
	href: string;
	stack: string;
	badge?: string;
	desc: string;
}

export const showcase: ShowcaseItem[] = [
	{
		name: "frameo.ai",
		href: "https://frameo.ai",
		stack: "Gen AI · Media",
		badge: "Building now",
		desc: "A Gen-AI powered video production platform for short films, micro-dramas, ads, anything you can imagine.",
	},
	{
		name: "RedScout",
		href: "https://github.com/anjay-goel/RedScout",
		stack: "Redis · Monitoring · CLI",
		badge: "OSS",
		desc: "A Redis monitoring tool that provides real application-level insights by breaking down metrics by logical namespaces.",
	},
	{
		name: "DashReels",
		href: "https://play.google.com/store/apps/details?id=com.dashtoon.video.reels&hl=en_IN",
		stack: "App · Streaming",
		badge: "50M+ installs",
		desc: "An entertainment platform for short-form dramas. Watched by 50M+ users across India, Southeast Asia and North America.",
	},
	{
		name: "Generalised Stable Roommate",
		href: "https://github.com/anjay-goel/stable-roommate-generalised",
		stack: "Python · Algorithms",
		badge: "OSS",
		desc: "An algorithm & webapp to automatically group people into optimal teams based on their individual preferences.",
	},
];
