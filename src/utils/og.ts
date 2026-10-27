import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import PlexMono400 from "@/assets/fonts/og/ibm-plex-mono-400.ttf";
import PlexMono500 from "@/assets/fonts/og/ibm-plex-mono-500.ttf";
import PlexSans600 from "@/assets/fonts/og/ibm-plex-sans-600.ttf";
import SourceSerif400 from "@/assets/fonts/og/source-serif-4-400.ttf";
import { headerCopy } from "@/content/copy/header";
import { palette } from "@/data/palette";

export interface OgCard {
	meta: string;
	title: string;
	description: string;
	descriptionLines?: number;
}

type Style = Record<string, string | number>;

interface Node {
	type: string;
	props: { style?: Style; children?: Node | string | (Node | string)[] };
}

const WIDTH = 1200;
const HEIGHT = 630;
const SANS = "IBM Plex Sans";
const MONO = "IBM Plex Mono";
const SERIF = "Source Serif 4";

const options: SatoriOptions = {
	width: WIDTH,
	height: HEIGHT,
	fonts: [
		{ name: SANS, data: Buffer.from(PlexSans600), weight: 600, style: "normal" },
		{ name: MONO, data: Buffer.from(PlexMono400), weight: 400, style: "normal" },
		{ name: MONO, data: Buffer.from(PlexMono500), weight: 500, style: "normal" },
		{ name: SERIF, data: Buffer.from(SourceSerif400), weight: 400, style: "normal" },
	],
};

function h(type: string, style: Style, children?: Node["props"]["children"]): Node {
	return { type, props: { style, children } };
}

function titleSize(title: string): number {
	if (title.length <= 40) return 76;
	if (title.length <= 64) return 64;
	return 56;
}

function card({ meta, title, description, descriptionLines = 2 }: OgCard): Node {
	const c = palette.light;
	const { prefix, name, suffix } = headerCopy.logo;
	const size = titleSize(title);
	const logo = h(
		"div",
		{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 26, fontWeight: 500 },
		[
			h("span", { color: c.soft }, prefix),
			h("span", {}, name),
			h("span", { color: c.accent }, suffix),
			h("span", { width: 13, height: 28, marginLeft: 8, background: c.accent }),
		],
	);
	const text = h("div", { display: "flex", flexDirection: "column", maxWidth: 940 }, [
		h("p", { margin: 0, fontFamily: MONO, fontSize: 21, fontWeight: 400, color: c.soft }, meta),
		h(
			"h1",
			{
				margin: "18px 0 0",
				fontFamily: SANS,
				fontSize: size,
				fontWeight: 600,
				lineHeight: 1.04,
				letterSpacing: size * -0.025,
			},
			title,
		),
		h(
			"p",
			{
				display: "block",
				margin: "20px 0 0",
				fontFamily: SERIF,
				fontSize: 26,
				fontWeight: 400,
				lineHeight: 1.45,
				color: c.muted,
				lineClamp: descriptionLines,
			},
			description,
		),
	]);
	return h(
		"div",
		{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			boxSizing: "border-box",
			width: WIDTH,
			height: HEIGHT,
			padding: "64px 72px",
			background: c.bg,
			color: c.ink,
			fontFamily: SANS,
		},
		[logo, text],
	);
}

export async function renderOgPng(data: OgCard): Promise<Uint8Array> {
	const svg = await satori(card(data) as Parameters<typeof satori>[0], options);
	return new Uint8Array(new Resvg(svg).render().asPng());
}
