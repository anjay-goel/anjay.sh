import { metaCopy } from "@/content/copy/meta";
import { getPostSummaries } from "@/data/post";
import type { SearchPostIndex } from "@/scripts/search-types";
import { formatDayMonthYear } from "@/utils/date";
import { withBase } from "@/utils/path";

export async function GET() {
	const summaries = await getPostSummaries();
	const index: SearchPostIndex = {};
	for (const post of summaries) {
		const meta = [formatDayMonthYear(post.date), post.label?.text]
			.filter(Boolean)
			.join(metaCopy.separator);
		index[withBase(`/posts/${post.id}/`)] = {
			title: post.title,
			meta,
			href: post.href,
			external: post.external,
		};
	}
	return new Response(JSON.stringify(index), {
		headers: { "Content-Type": "application/json; charset=utf-8" },
	});
}
