import { type CollectionEntry, getCollection } from "astro:content";
import { collectionsCopy } from "@/content/copy/collections";
import { withBase } from "@/utils/path";

export type CollectionDoc = CollectionEntry<"collections">;

export async function getCollections(): Promise<CollectionDoc[]> {
	const entries = await getCollection("collections");
	return entries.sort((a, b) => a.data.order - b.data.order);
}

export function collectionHref(collection: CollectionDoc): string {
	return withBase(`/collections/${collection.id}/`);
}

export function collectionCountLabel(collection: CollectionDoc): string {
	const n = collection.data.posts.length;
	return collection.data.kind === "series"
		? collectionsCopy.partCount(n)
		: collectionsCopy.postCount(n);
}

export function orderCollectionPosts<T extends { id: string }>(
	collection: CollectionDoc,
	posts: T[],
): T[] {
	const byId = new Map(posts.map((p) => [p.id, p]));
	return collection.data.posts.map((p) => byId.get(p.id)).filter((p): p is T => p !== undefined);
}
