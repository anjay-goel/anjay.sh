import { Resvg } from "@resvg/resvg-js";
import { palette } from "@/data/palette";

const PROMPT = "M6 9l7 7l-7 7";
const CURSOR = "M16 24h10";
const STROKE = 'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const APP_BOX = 44;
const APP_RADIUS = 10;

export interface AppIconOptions {
	size: number;
	rounded: boolean;
}

export function faviconSvg(): string {
	const { light, dark } = palette;
	const style = `@media (prefers-color-scheme:dark){.p{stroke:${dark.ink}}.c{stroke:${dark.accent}}}`;
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>${style}</style><path class="p" d="${PROMPT}" stroke="${light.ink}" ${STROKE}/><path class="c" d="${CURSOR}" stroke="${light.accent}" ${STROKE}/></svg>`;
}

export function appIconSvg({ size, rounded }: AppIconOptions): string {
	const { bg, ink, accent } = palette.light;
	const radius = rounded ? APP_RADIUS : 0;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-6 -6 ${APP_BOX} ${APP_BOX}"><rect x="-6" y="-6" width="${APP_BOX}" height="${APP_BOX}" rx="${radius}" fill="${bg}"/><path d="${PROMPT}" stroke="${ink}" ${STROKE}/><path d="${CURSOR}" stroke="${accent}" ${STROKE}/></svg>`;
}

export function appIconPng(options: AppIconOptions): Uint8Array {
	const png = new Resvg(appIconSvg(options), { fitTo: { mode: "width", value: options.size } })
		.render()
		.asPng();
	return new Uint8Array(png);
}

export function pngResponse(body: Uint8Array): Response {
	return new Response(body as BodyInit, {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}
