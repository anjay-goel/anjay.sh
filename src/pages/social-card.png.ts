import { homeCopy } from "@/content/copy/home";
import { ogCopy } from "@/content/copy/og";
import { pngResponse } from "@/utils/icons";
import { renderOgPng } from "@/utils/og";

export async function GET() {
	return pngResponse(
		await renderOgPng({
			meta: ogCopy.site.meta,
			title: homeCopy.hero.title,
			description: ogCopy.site.description,
		}),
	);
}
