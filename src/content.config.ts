import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const post = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/post" }),
	schema: ({ image }) =>
		z.object({
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			description: z.string().min(10).max(160),
			draft: z.boolean().default(false),
			externalUrl: z.url().optional(),
			ogImage: z.string().optional(),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			title: z.string().max(120),
			updatedDate: z
				.string()
				.or(z.date())
				.optional()
				.transform((val) => (val ? new Date(val) : undefined)),
		}),
});

const pageFact = z.union([
	z.object({ term: z.string(), text: z.string() }),
	z.object({ term: z.string(), source: z.enum(["shipped", "education", "writing"]) }),
]);

const page = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/page" }),
	schema: z.object({
		title: z.string().max(120),
		description: z.string().max(160).optional(),
		heading: z.string().optional(),
		dek: z.string().optional(),
		photoAlt: z.string().optional(),
		factsLabel: z.string().optional(),
		facts: z.array(pageFact).default([]),
	}),
});

const collection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/collections" }),
	schema: z.object({
		title: z.string(),
		label: z.string(),
		kind: z.enum(["collection", "series"]),
		description: z.string(),
		shortDescription: z.string().optional(),
		cta: z.string().optional(),
		homeLabel: z.string().optional(),
		order: z.number(),
		cover: z.enum(["surge", "stack", "sip", "container"]),
		posts: z.array(reference("post")).min(1),
		cardTags: z.record(z.string(), z.string()).default({}),
	}),
});

export const collections = { post, page, collections: collection };
