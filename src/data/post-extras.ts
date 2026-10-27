import type { ThumbnailKey } from "@/components/art/thumbnail-art";

interface PostExtras {
	thumbnail?: ThumbnailKey;
	primaryTag?: string;
	homeLabel?: string;
	authorNote?: string;
}

export const genericTags: readonly string[] = ["programming"];

const externalSources: Record<string, string> = {
	"insiders.dashverse.ai": "on the Dashverse blog",
};

const postExtras: Record<string, PostExtras> = {
	"building-an-ai-dubbing-pipeline-for-micro-dramas": { thumbnail: "dub", homeLabel: "AI & pipelines" },
	"claude-code-long-running-agent": { homeLabel: "AI & tooling" },
	"hello-world": { thumbnail: "hello" },
	"background-app-launch-bug": { thumbnail: "surge" },
	"anatomy-of-containers-iii": { thumbnail: "caps", authorNote: "Go · hands-on" },
	"anatomy-of-containers-ii": { thumbnail: "netns" },
	"anatomy-of-containers-i": { thumbnail: "proctree" },
	"non-blocking-io": { thumbnail: "loop" },
	"myth-of-market-timing": { thumbnail: "sip" },
	"covid-19-india-analysing-death-registration-trends": { thumbnail: "covid" },
	"linux-startup-guide": { primaryTag: "linux" },
	"IIT-KGP-An-update-on-VPNs": { primaryTag: "how-to" },
};

export function getPostExtras(postId: string): PostExtras {
	return postExtras[postId] ?? {};
}

export function externalSourceFor(href: string): string | undefined {
	try {
		return externalSources[new URL(href).hostname];
	} catch {
		return undefined;
	}
}
