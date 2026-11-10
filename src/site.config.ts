import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const siteConfig: SiteConfig = {
	author: "Anjay Goel",
	date: {
		locale: "en-US",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
			timeZone: "Asia/Kolkata",
		},
	},
	description:
		"Hi!\nI am Anjay. I love to write about software development, technology and occasionally other stuff like economics & finance. I hope you find something interesting here.",
	lang: "en-US",
	ogLocale: "en_US",
	sortPostsByUpdatedDate: false,
	title: "Anjay Goel",
	profile: {
		name: "Anjay Goel",
		email: "anjay.goel@gmail.com",
		github: "https://github.com/anjay-goel",
		linkedin: "https://www.linkedin.com/in/anjaygoel/",
		jobTitle: "Software Engineer",
		employer: "Dashtoon",
		employerUrl: "https://www.linkedin.com/company/dashtoon/",
		alumni: "IIT Kharagpur",
	},
	comments: {
		repo: "anjay-goel/anjay.sh",
		repoId: "MDEwOlJlcG9zaXRvcnkzNzY2MjI0MjY=",
		category: "General",
		categoryId: "DIC_kwDOFnLNWs4CQ8t3",
	},
	analytics: {
		googleAnalyticsId: "G-YMCFXDNKXR",
		goatcounterUrl: "https://anjaygoel.goatcounter.com/count",
	},
};

export const authorName = siteConfig.profile?.name ?? siteConfig.author;

export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/posts/",
		title: "Posts",
	},
	{
		path: "/showcase/",
		title: "Showcase",
	},
	{
		path: "/about/",
		title: "About",
	},
];

const codeSurface = { light: "#f6f7f9", dark: "#1b1c20" };
const codeChrome = { light: "#eceef2", dark: "#101114" };

export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	defaultProps: {
		frame: "code",
	},
	styleOverrides: {
		borderColor: "transparent",
		borderRadius: "4px",
		codeBackground: ({ theme }) => codeSurface[theme.type],
		codeFontFamily: "var(--font-mono)",
		codeFontSize: "0.875rem",
		codeLineHeight: "1.6",
		codePaddingInline: "1rem",
		frames: {
			editorActiveTabBackground: ({ theme }) => codeSurface[theme.type],
			editorTabBarBackground: ({ theme }) => codeChrome[theme.type],
			frameBoxShadowCssValue: "none",
		},
		uiLineHeight: "inherit",
	},
	themeCssSelector(theme, { styleVariants }) {
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme;
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme;
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`;
		}
		return `[data-theme="${theme.name}"]`;
	},
	themes: ["github-dark", "min-light"],
	useThemedScrollbars: false,
};
