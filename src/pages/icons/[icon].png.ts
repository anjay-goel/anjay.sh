import type { APIContext } from "astro";
import { type AppIconOptions, appIconPng, pngResponse } from "@/utils/icons";

const appIcons: Record<string, AppIconOptions> = {
	"apple-touch-icon": { size: 180, rounded: false },
	"icon-192": { size: 192, rounded: true },
	"icon-512": { size: 512, rounded: true },
};

export function getStaticPaths() {
	return Object.entries(appIcons).map(([icon, options]) => ({ params: { icon }, props: options }));
}

export function GET({ props }: APIContext) {
	return pngResponse(appIconPng(props as AppIconOptions));
}
