import { siteConfig } from "@/site-config";

const timeZone = siteConfig.date.options.timeZone ?? "UTC";

const dateFormat = new Intl.DateTimeFormat(siteConfig.date.locale, {
	timeZone,
	...siteConfig.date.options,
});

const railFormatter = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone,
});

const stampFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
	timeZone,
});

const bylineFormatter = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone,
});

const eyebrowFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
	timeZone,
});

export function getFormattedDate(
	date: string | number | Date,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (typeof options !== "undefined") {
		return new Date(date).toLocaleDateString(siteConfig.date.locale, {
			timeZone,
			...(siteConfig.date.options as Intl.DateTimeFormatOptions),
			...options,
		});
	}

	return dateFormat.format(new Date(date));
}

/** Short rail date: `5 Mar 2026`. */
export function formatRailDate(date: Date): string {
	return railFormatter.format(date);
}

/** Featured-card stamp: `March 2026`. */
export function formatStampDate(date: Date): string {
	return stampFormatter.format(date);
}

/** Article byline date: `5 March 2026`. */
export function formatBylineDate(date: Date): string {
	return bylineFormatter.format(date);
}

/** Article eyebrow date: `March 2026`. */
export function formatEyebrowDate(date: Date): string {
	return eyebrowFormatter.format(date);
}

const partsFormatter = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone,
});

function dateParts(date: Date): { day: string; month: string; year: string } {
	const parts = partsFormatter.formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
	return { day: get("day"), month: get("month"), year: get("year") };
}

export function formatDayMonth(date: Date): string {
	const { day, month } = dateParts(date);
	return `${day} ${month}`;
}

export function formatDayMonthYear(date: Date): string {
	const { day, month, year } = dateParts(date);
	return `${day} ${month} ${year}`;
}

export function getYear(date: Date): number {
	return Number(dateParts(date).year);
}
