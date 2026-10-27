import { getAllPosts } from "@/data/post";
import { withBase } from "@/utils/path";

export const getStaticPaths = () => [{ params: { redirects: "_redirects" } }];

export async function GET() {
	const posts = await getAllPosts();
	const lines = posts.flatMap(({ id, data }) => {
		if (!data.externalUrl) return [];
		const path = withBase(`/posts/${id}`);
		return [`${path}/ ${data.externalUrl} 301`, `${path} ${data.externalUrl} 301`];
	});
	return new Response(`${lines.join("\n")}\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
