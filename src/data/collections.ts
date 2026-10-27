import { type CollectionEntry, getCollection } from "astro:content";
import { metaCopy } from "@/content/copy/meta";
import { withBase } from "@/utils/path";
import { toRoman } from "@/utils/roman";

export type CollectionDoc = CollectionEntry<"collections">;

export interface SeriesPart {
	collection: CollectionDoc;
	index: number;
	roman: string;
	total: number;
	label: string;
	prevId: string | undefined;
	nextId: string | undefined;
}

export async function getCollections(): Promise<CollectionDoc[]> {
	const entries = await getCollection("collections");
	return entries.sort((a, b) => a.data.order - b.data.order);
}

export function collectionPostIds(collection: CollectionDoc): string[] {
	return collection.data.posts.map((p) => p.id);
}

export function collectionHref(collection: CollectionDoc | string): string {
	const slug = typeof collection === "string" ? collection : collection.id;
	return withBase(`/collections/${slug}/`);
}

export function collectionCountLabel(collection: CollectionDoc): string {
	const n = collection.data.posts.length;
	return collection.data.kind === "series" ? metaCopy.partCount(n) : metaCopy.postCount(n);
}

export function findCollectionForPost(
	collections: CollectionDoc[],
	postId: string,
): CollectionDoc | undefined {
	return collections.find((c) => collectionPostIds(c).includes(postId));
}

export function seriesPartFor(collection: CollectionDoc, postId: string): SeriesPart | undefined {
	if (collection.data.kind !== "series") return undefined;
	const ids = collectionPostIds(collection);
	const i = ids.indexOf(postId);
	if (i < 0) return undefined;
	const roman = toRoman(i + 1);
	return {
		collection,
		index: i + 1,
		roman,
		total: ids.length,
		label: metaCopy.part(roman),
		prevId: ids[i - 1],
		nextId: ids[i + 1],
	};
}

export function orderCollectionPosts<T extends { id: string }>(
	collection: CollectionDoc,
	posts: T[],
): T[] {
	const byId = new Map(posts.map((p) => [p.id, p]));
	return collectionPostIds(collection)
		.map((id) => byId.get(id))
		.filter((p): p is T => p !== undefined);
}
