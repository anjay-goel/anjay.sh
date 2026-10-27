import type { MetaPart } from "@/data/post";

export interface AboutFact {
	term: string;
	parts: MetaPart[];
}

export const aboutCopy = {
	heading: "Hi, I’m Anjay.",
	photoAlt: "Anjay Goel",
	factsLabel: "At a glance",
	facts: [
		{ term: "now", parts: ["frameo.ai at Dashverse"] },
		{
			term: "before",
			parts: ["DashReels ", { text: "50M+", accent: true }, " · DashToon ", { text: "1M+", accent: true }],
		},
		{ term: "education", parts: ["IIT Kharagpur ’23"] },
	] satisfies AboutFact[],
	writing: {
		term: "writing",
		text: (count: number, since: number) => `${count} ${count === 1 ? "post" : "posts"} since ${since}`,
	},
};
