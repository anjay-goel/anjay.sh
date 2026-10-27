import { siteConfig } from "@/site-config";

const { alumni, graduationYear } = siteConfig.profile ?? {};

export const education = [alumni, graduationYear && `’${String(graduationYear).slice(-2)}`]
	.filter(Boolean)
	.join(" ");

export const aboutCopy = {
	writing: (count: number, since: number) =>
		`${count} ${count === 1 ? "post" : "posts"} since ${since}`,
};
