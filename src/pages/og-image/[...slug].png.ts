import type { APIContext, InferGetStaticPropsType } from "astro";
import { metaCopy } from "@/content/copy/meta";
import { ogCopy } from "@/content/copy/og";
import { getAllPosts, getPostSortDate, getReadingMinutes } from "@/data/post";
import { formatDayMonthYear } from "@/utils/date";
import { pngResponse } from "@/utils/icons";
import { type OgCard, renderOgPng } from "@/utils/og";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET({ props }: APIContext) {
	return pngResponse(await renderOgPng(props as Props));
}

export async function getStaticPaths() {
	const posts = (await getAllPosts()).filter(({ data }) => !data.ogImage);
	return Promise.all(
		posts.map(async (post) => {
			const minutes = await getReadingMinutes(post);
			const meta = [
				formatDayMonthYear(getPostSortDate(post)),
				minutes === undefined ? undefined : ogCopy.minutesRead(minutes),
			]
				.filter(Boolean)
				.join(metaCopy.separator);
			const props: OgCard = { meta, title: post.data.title, description: post.data.description };
			return { params: { slug: post.id }, props };
		}),
	);
}
