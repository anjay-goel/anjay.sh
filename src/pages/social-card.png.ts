import { homeCopy } from "@/content/copy/home";
import { metaCopy } from "@/content/copy/meta";
import { ogCopy } from "@/content/copy/og";
import { siteConfig } from "@/site-config";
import { pngResponse } from "@/utils/icons";
import { renderOgPng } from "@/utils/og";

export async function GET() {
	return pngResponse(
		await renderOgPng({
			meta: [siteConfig.author, ogCopy.site.meta].join(metaCopy.separator),
			title: homeCopy.hero.title,
			description: siteConfig.intro,
			descriptionLines: 3,
		}),
	);
}
