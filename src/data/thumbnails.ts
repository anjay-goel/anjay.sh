import type { ThumbnailKey } from "@/components/art/thumbnail-art";

export const thumbnails: Record<string, ThumbnailKey> = {
	"building-an-ai-dubbing-pipeline-for-micro-dramas": "dub",
	"hello-world": "hello",
	"background-app-launch-bug": "surge",
	"anatomy-of-containers-iii": "caps",
	"anatomy-of-containers-ii": "netns",
	"anatomy-of-containers-i": "proctree",
	"non-blocking-io": "loop",
	"myth-of-market-timing": "sip",
	"covid-19-india-analysing-death-registration-trends": "covid",
};

export function getThumbnailKey(postId: string): ThumbnailKey | undefined {
	return thumbnails[postId];
}
