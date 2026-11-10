export function absoluteUrl(path: string, site: URL | string | undefined): string {
	return new URL(path, site).toString();
}
