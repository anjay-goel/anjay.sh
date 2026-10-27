import { ExpressiveCodeTheme } from "astro-expressive-code";

interface Palette {
	code: string;
	ink: string;
	soft: string;
	accent: string;
	ok: string;
	err: string;
}

const light: Palette = {
	code: "#f1f1f0",
	ink: "#1a1a1a",
	soft: "#656565",
	accent: "#335a85",
	ok: "#3f6b4a",
	err: "#a3412c",
};

const dark: Palette = {
	code: "#181817",
	ink: "#ebe9e5",
	soft: "#908d87",
	accent: "#9fc3e6",
	ok: "#95c4a0",
	err: "#e8a598",
};

function siteTheme(name: string, type: "light" | "dark", p: Palette) {
	return new ExpressiveCodeTheme({
		name,
		type,
		colors: {
			"editor.background": p.code,
			"editor.foreground": p.ink,
		},
		tokenColors: [
			{ settings: { foreground: p.ink } },
			{
				scope: ["comment", "punctuation.definition.comment", "string.comment"],
				settings: { foreground: p.soft },
			},
			{
				scope: [
					"keyword",
					"storage",
					"storage.type",
					"support.type.primitive",
					"entity.name.type",
					"support.type.builtin",
					"keyword.operator.new",
					"variable.language",
					"entity.name.tag",
				],
				settings: { foreground: p.accent },
			},
			{
				scope: [
					"string",
					"constant.numeric",
					"constant.language",
					"constant.character",
					"support.constant",
					"markup.inserted",
					"entity.other.attribute-name",
				],
				settings: { foreground: p.ok },
			},
			{
				scope: ["invalid", "markup.deleted"],
				settings: { foreground: p.err },
			},
			{
				scope: ["keyword.operator", "punctuation", "meta.brace"],
				settings: { foreground: p.ink },
			},
		],
	});
}

export const siteLightTheme = siteTheme("site-light", "light", light);
export const siteDarkTheme = siteTheme("site-dark", "dark", dark);
