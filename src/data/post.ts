import { type CollectionEntry, getCollection, render } from "astro:content";
import { siteConfig } from "@/site-config";

type Post = CollectionEntry<"post">;

/** Fetch all posts. Drafts are excluded in production builds. */
export async function getAllPosts(): Promise<Post[]> {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

export async function getSortedPosts(): Promise<Post[]> {
	return sortMDByDate(await getAllPosts());
}

export async function getAdjacentPosts(
	post: Post,
): Promise<{ newer: Post | undefined; older: Post | undefined }> {
	const posts = await getSortedPosts();
	const idx = posts.findIndex((p) => p.id === post.id);
	return {
		newer: idx > 0 ? posts[idx - 1] : undefined,
		older: idx >= 0 ? posts[idx + 1] : undefined,
	};
}

export async function getReadingTime(post: Post): Promise<string> {
	const { remarkPluginFrontmatter } = await render(post);
	return (remarkPluginFrontmatter as { minutesRead?: string }).minutesRead ?? "";
}

export function getPostHref(post: Post): string {
	return post.data.externalUrl ?? `/posts/${post.id}/`;
}

export function getTagHref(tag: string): string {
	return `/tags/${encodeURIComponent(tag)}/`;
}

/** Date used for sorting — `updatedDate` if `siteConfig.sortPostsByUpdatedDate`, else `publishDate`. */
export function getPostSortDate(post: Post): Date {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate);
}

/** Sort by `getPostSortDate`, newest first. Mutates input. */
export function sortMDByDate(posts: Post[]): Post[] {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** Every tag across the given posts, including duplicates. */
function getAllTags(posts: Post[]): string[] {
	return posts.flatMap((post) => post.data.tags);
}

/** Unique tags across the given posts, sorted alphabetically. */
export function getUniqueTags(posts: Post[]): string[] {
	return [...new Set(getAllTags(posts))].sort((a, b) => a.localeCompare(b));
}

/** Unique tags with their post counts, sorted by count (desc) then tag (asc). */
export function getUniqueTagsWithCount(posts: Post[]): [string, number][] {
	const counts = getAllTags(posts).reduce((map, tag) => {
		map.set(tag, (map.get(tag) ?? 0) + 1);
		return map;
	}, new Map<string, number>());
	return [...counts.entries()].sort(([aTag, aCount], [bTag, bCount]) =>
		bCount === aCount ? aTag.localeCompare(bTag) : bCount - aCount,
	);
}

/** Posts that carry the given tag (order preserved from the input). */
export function getPostsByTag(posts: Post[], tag: string): Post[] {
	return posts.filter((post) => post.data.tags.includes(tag));
}
