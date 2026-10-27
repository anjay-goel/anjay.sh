import { type CollectionEntry, getCollection, render } from "astro:content";
import type { ThumbnailKey } from "@/components/art/thumbnail-art";
import { metaCopy } from "@/content/copy/meta";
import {
	type CollectionDoc,
	collectionHref,
	findCollectionForPost,
	getCollections,
	type SeriesPart,
	seriesPartFor,
} from "@/data/collections";
import { genericTags, primaryTagOverrides } from "@/data/primary-tags";
import { getThumbnailKey } from "@/data/thumbnails";
import { siteConfig } from "@/site-config";
import { getYear } from "@/utils/date";
import { withBase } from "@/utils/path";

/** Fetch all posts. Drafts are excluded in production builds. */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

export function getPostHref(post: CollectionEntry<"post">): string {
	return post.data.externalUrl ?? withBase(`/posts/${post.id}/`);
}

/** Date used for sorting — `updatedDate` if `siteConfig.sortPostsByUpdatedDate`, else `publishDate`. */
export function getPostSortDate(post: CollectionEntry<"post">): Date {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate);
}

/** Sort by `getPostSortDate`, newest first. Mutates input. */
export function sortMDByDate(posts: CollectionEntry<"post">[]): CollectionEntry<"post">[] {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** Every tag across the given posts, including duplicates. */
export function getAllTags(posts: CollectionEntry<"post">[]): string[] {
	return posts.flatMap((post) => post.data.tags);
}

/** Unique tags across the given posts, sorted alphabetically. */
export function getUniqueTags(posts: CollectionEntry<"post">[]): string[] {
	return [...new Set(getAllTags(posts))].sort((a, b) => a.localeCompare(b));
}

/** Unique tags with their post counts, sorted by count (desc) then tag (asc). */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	const counts = getAllTags(posts).reduce((map, tag) => {
		map.set(tag, (map.get(tag) ?? 0) + 1);
		return map;
	}, new Map<string, number>());
	return [...counts.entries()].sort(([aTag, aCount], [bTag, bCount]) =>
		bCount === aCount ? aTag.localeCompare(bTag) : bCount - aCount,
	);
}

/** Posts that carry the given tag (order preserved from the input). */
export function getPostsByTag(
	posts: CollectionEntry<"post">[],
	tag: string,
): CollectionEntry<"post">[] {
	return posts.filter((post) => post.data.tags.includes(tag));
}

export type PostEntry = CollectionEntry<"post">;

export type PostLabelKind = "collection" | "series" | "tag";

export interface PostLabel {
	text: string;
	kind: PostLabelKind;
	accent: boolean;
	href: string;
}

export interface PostSummary {
	id: string;
	title: string;
	description: string;
	href: string;
	external: boolean;
	date: Date;
	year: number;
	tags: string[];
	primaryTag: string | undefined;
	label: PostLabel | undefined;
	minutes: number | undefined;
	thumbnail: ThumbnailKey | undefined;
	collection: CollectionDoc | undefined;
	part: SeriesPart | undefined;
}

export interface YearGroup<T> {
	year: number;
	items: T[];
}

export function isExternalPost(post: PostEntry): boolean {
	return Boolean(post.data.externalUrl);
}

export function getPrimaryTag(post: PostEntry): string | undefined {
	const override = primaryTagOverrides[post.id];
	if (override) return override;
	const tags = post.data.tags;
	return tags.find((t) => !genericTags.includes(t)) ?? tags[0];
}

export function tagHref(tag: string): string {
	return withBase(`/tags/${tag}/`);
}

export async function getReadingMinutes(post: PostEntry): Promise<number | undefined> {
	if (isExternalPost(post)) return undefined;
	const cached = (post.rendered?.metadata?.frontmatter as { readingMinutes?: unknown } | undefined)?.readingMinutes;
	if (typeof cached === "number") return cached;
	const { remarkPluginFrontmatter } = await render(post);
	const minutes = (remarkPluginFrontmatter as { readingMinutes?: number }).readingMinutes;
	return typeof minutes === "number" ? minutes : undefined;
}

export function getPostLabel(
	post: PostEntry,
	collection: CollectionDoc | undefined,
	part: SeriesPart | undefined,
): PostLabel | undefined {
	if (collection && part) {
		return { text: part.label, kind: "series", accent: true, href: collectionHref(collection) };
	}
	if (collection) {
		return { text: collection.data.label, kind: "collection", accent: true, href: collectionHref(collection) };
	}
	const tag = getPrimaryTag(post);
	return tag ? { text: metaCopy.tag(tag), kind: "tag", accent: false, href: tagHref(tag) } : undefined;
}

export async function toPostSummary(
	post: PostEntry,
	collections?: CollectionDoc[],
): Promise<PostSummary> {
	const all = collections ?? (await getCollections());
	const collection = findCollectionForPost(all, post.id);
	const part = collection ? seriesPartFor(collection, post.id) : undefined;
	const date = getPostSortDate(post);
	return {
		id: post.id,
		title: post.data.title,
		description: post.data.description,
		href: getPostHref(post),
		external: isExternalPost(post),
		date,
		year: getYear(date),
		tags: post.data.tags,
		primaryTag: getPrimaryTag(post),
		label: getPostLabel(post, collection, part),
		minutes: await getReadingMinutes(post),
		thumbnail: getThumbnailKey(post.id),
		collection,
		part,
	};
}

export async function getPostSummaries(posts?: PostEntry[]): Promise<PostSummary[]> {
	const source = sortMDByDate([...(posts ?? (await getAllPosts()))]);
	const collections = await getCollections();
	return Promise.all(source.map((p) => toPostSummary(p, collections)));
}

export function groupByYear<T extends { year: number }>(items: T[]): YearGroup<T>[] {
	const groups: YearGroup<T>[] = [];
	for (const item of items) {
		const last = groups.at(-1);
		if (last && last.year === item.year) last.items.push(item);
		else groups.push({ year: item.year, items: [item] });
	}
	return groups;
}

export function getPostYears(posts: PostEntry[]): number[] {
	return [...new Set(posts.map((p) => getYear(getPostSortDate(p))))].sort((a, b) => b - a);
}

export type MetaPart = string | { text: string; accent?: boolean };

export function postMetaParts(
	summary: PostSummary,
	options: { label?: boolean; minutes?: boolean } = {},
): MetaPart[] {
	const { label = true, minutes = true } = options;
	const parts: MetaPart[] = [];
	if (label && summary.label) parts.push({ text: summary.label.text, accent: summary.label.accent });
	if (minutes) {
		if (summary.external) parts.push(metaCopy.external);
		else if (summary.minutes !== undefined) parts.push(metaCopy.minutes(summary.minutes));
	}
	return parts;
}
