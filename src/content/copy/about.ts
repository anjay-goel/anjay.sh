import { metaCopy } from "@/content/copy/meta";
import type { MetaPart } from "@/data/post";
import { showcase } from "@/data/showcase";
import { siteConfig } from "@/site-config";

export const education = `${siteConfig.profile?.alumni ?? ""} ’23`;

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
			parts: showcase
				.filter((item) => item.reach)
				.flatMap((item, i): MetaPart[] => [`${i > 0 ? metaCopy.separator : ""}${item.name} `, { text: item.reach ?? "", accent: true }]),
		},
		{ term: "education", parts: [education] },
	] satisfies AboutFact[],
	writing: {
		term: "writing",
		text: (count: number, since: number) => `${count} ${count === 1 ? "post" : "posts"} since ${since}`,
	},
};
