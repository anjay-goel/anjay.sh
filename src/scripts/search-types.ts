export interface SearchPost {
	title: string;
	meta: string;
	href: string;
	external: boolean;
}

export type SearchPostIndex = Record<string, SearchPost>;

export interface PagefindWeightedLocation {
	weight: number;
	balanced_score: number;
	location: number;
}

export interface PagefindSubResult {
	title: string;
	url: string;
	excerpt: string;
	locations?: number[];
	weighted_locations?: PagefindWeightedLocation[];
}

export interface PagefindData {
	url: string;
	excerpt: string;
	content?: string;
	meta: { title?: string };
	sub_results?: PagefindSubResult[];
}

export interface PagefindResult {
	id: string;
	data: () => Promise<PagefindData>;
}

export interface PagefindSearch {
	results: PagefindResult[];
}

export interface Pagefind {
	options: (options: Record<string, unknown>) => Promise<void>;
	init: () => Promise<void>;
	debouncedSearch: (query: string, options?: Record<string, unknown>, ms?: number) => Promise<PagefindSearch | null>;
}
